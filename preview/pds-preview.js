/**
 * `<pds-preview>`: the reviewer's frame around a generated screen. Not an
 * app component: it is the chrome a vibe-coded page wraps its screen in so
 * a reviewer can flip light and dark and rounded and square corners. The
 * controls sit outside the screen and are never part of it.
 *
 * @element pds-preview
 *
 * @attr {'light'|'dark'} [theme=light] - Theme to preview. Set as `data-theme`
 *   on this element, so several previews on one page can differ, and on
 *   `<html>` too when this is the only preview on the page.
 * @attr {'rounded'|'square'} [corners=rounded] - Frame corners: 48 px
 *   radius, or none.
 * @attr {number} [width=375] - Frame width in CSS px.
 * @attr {number} [height=812] - Frame minimum height in CSS px. The frame
 *   grows with its content.
 * @attr {'on'|'off'} [status-bar=on] - The phone status bar (`pds-status-bar`)
 *   at the top of the frame, as on the P3 screens in Figma.
 * @attr {boolean} [notch=false] - Draw the device notch in the status bar. Off
 *   by default: on a light screen the black notch reads as a stain at small sizes.
 * @attr {'on'|'off'} [home-indicator=on] - The phone's home line
 *   (`pds-home-indicator`) at the bottom of the frame. The bottom navigation
 *   bar is not added here: only root screens carry one.
 * @attr {'en'|'zh'|'ja'} [language=en] - Copy language to preview: English,
 *   modern Chinese (Simplified, `zh-Hans`) or Japanese. Sets `lang` on
 *   `<html>` and swaps the screen's copy: an element with `data-zh` and
 *   `data-ja` gets its text replaced; an element with `data-<attr>-zh` and
 *   `data-<attr>-ja` gets that attribute replaced (title, label,
 *   placeholder, supporting-text, error, message, action-label). English
 *   is kept in `data-en` / `data-<attr>-en` and restored on EN.
 *   While 中文 or 日本語 is selected, a note under the toolbar states that the
 *   copy is the model's shortest suggestion, not from POEMS translation files.
 *   A second note appears when Roboto is not installed on the device: text
 *   is then shown in a fallback font and may not be 100% accurate. A third,
 *   always shown, says the page is a concept prototype, not a requirements
 *   document and not a build for developers.
 *
 * @slot - The screen. The frame paints `--pds-surface-1` behind it and
 *   `--pds-on-surface-1` for text, so the screen need not style its own
 *   page background.
 *
 * @fires preview-change - detail: `{ theme, corners, language }` after any toggle.
 *   (Named so it cannot be confused with the screen's own `change` events,
 *   which bubble up through this wrapper.)
 *
 * @cssprop --pds-surface-1 - Frame background.
 * @cssprop --pds-on-surface-1 - Frame text colour.
 * @cssprop --pds-preview-radius - Corner radius when `corners="rounded"` (default 48px).
 */
import "../src/pds-status-bar.js";
import "../src/pds-home-indicator.js";

const LANG_TAGS = { en: "en", zh: "zh-Hans", ja: "ja" };

/** True when `family` is installed: text set in it measures differently from the fallback. */
function fontAvailable(family) {
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    const sample = "mmmmmmmmmmlliWQ0123";
    const widths = ["monospace", "serif"].map((fallback) => {
      ctx.font = `32px ${fallback}`; const base = ctx.measureText(sample).width;
      ctx.font = `32px "${family}", ${fallback}`; return ctx.measureText(sample).width !== base;
    });
    return widths.some(Boolean);
  } catch { return true; }
}
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 24px 16px 40px;
      box-sizing: border-box;
      min-height: 100vh;
      background: transparent; /* no stage colour, so nothing shows outside the frame's rounded corners */
      font-family: Roboto, system-ui, sans-serif;
      --pds-preview-radius: 48px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px 24px;
    }
    .control {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: #5c5c5c;
    }
    .segment {
      display: inline-flex;
      padding: 3px;
      border-radius: 999px;
      background: #ffffff;
      border: 1px solid #cfcfcf;
    }
    button {
      all: unset;
      cursor: pointer;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 500;
      color: #333333;
      line-height: 18px;
    }
    button[aria-pressed="true"] {
      background: #1b1b1b;
      color: #ffffff;
    }
    button:focus-visible {
      outline: 2px solid #f78f20;
      outline-offset: 2px;
    }
    .note {
      margin: -8px 0 0;
      max-width: 560px;
      text-align: center;
      font-size: 12px;
      line-height: 16px;
      color: #5c5c5c;
    }
    .note[hidden] { display: none; }
    .frame {
      display: flex;
      flex-direction: column;
      transform: translateZ(0); /* makes the frame the containing block for position: fixed children: snackbars, contained dialogs and sheets */
      width: var(--_width, 375px);
      max-width: 100%;
      min-height: var(--_height, 812px);
      box-sizing: border-box;
      overflow: hidden;
      border-radius: var(--pds-preview-radius, 48px);
      background: var(--pds-surface-1, #ffffff);
      color: var(--pds-on-surface-1, #141414);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
    .home { margin-top: auto; }
    ::slotted(pds-navigation-bar) { margin-top: auto; } /* a bottom bar placed as a direct child sits above the home line */
    .frame.has-nav .home { margin-top: 0; }
    :host([corners="square"]) .frame {
      border-radius: 0;
    }
  </style>
  <div class="toolbar" part="toolbar">
    <div class="control">
      <span id="theme-label">Preview theme</span>
      <div class="segment" role="group" aria-labelledby="theme-label">
        <button type="button" data-theme-choice="light" aria-pressed="true">Light</button>
        <button type="button" data-theme-choice="dark" aria-pressed="false">Dark</button>
      </div>
    </div>
    <div class="control">
      <span id="corners-label">Corners</span>
      <div class="segment" role="group" aria-labelledby="corners-label">
        <button type="button" data-corners-choice="rounded" aria-pressed="true">Rounded</button>
        <button type="button" data-corners-choice="square" aria-pressed="false">Square</button>
      </div>
    </div>
    <div class="control">
      <span id="language-label">Language</span>
      <div class="segment" role="group" aria-labelledby="language-label">
        <button type="button" data-language-choice="en" aria-pressed="true" lang="en">EN</button>
        <button type="button" data-language-choice="zh" aria-pressed="false" lang="zh-Hans">中文</button>
        <button type="button" data-language-choice="ja" aria-pressed="false" lang="ja">日本語</button>
      </div>
    </div>
  </div>
  <p class="note" part="note" hidden>中文 and 日本語 copy is suggested by the model, shortest wording possible, not taken from POEMS translation files. Translators review it before release.</p>
  <p class="note note-scope" part="scope-note">Concept prototype: it shows the idea in the real components. Not a requirements document, not a build for developers.</p>
  <p class="note note-font" part="font-note" hidden>Roboto is not available on this device. Text is shown in a fallback font and may not be 100% accurate to the design.</p>
  <div class="frame" part="frame"><pds-status-bar class="status"></pds-status-bar><slot></slot><pds-home-indicator class="home"></pds-home-indicator></div>
`;

export class PdsPreview extends HTMLElement {
  static get observedAttributes() {
    return ["theme", "corners", "width", "height", "language", "status-bar", "home-indicator", "notch"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._frame = this.shadowRoot.querySelector(".frame");
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.querySelector(".toolbar").addEventListener("click", this._onClick);
    const fontNote = this.shadowRoot.querySelector(".note-font");
    fontNote.hidden = fontAvailable("Roboto");
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fontNote.hidden = fontAvailable("Roboto"); });
    this._sync();
    const slot = this.shadowRoot.querySelector("slot:not([name])");
    this._syncNav = () => this.shadowRoot.querySelector(".frame").classList.toggle("has-nav", slot.assignedElements().some((e) => e.tagName === "PDS-NAVIGATION-BAR"));
    slot.addEventListener("slotchange", this._syncNav);
    this._syncNav();
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector(".toolbar").removeEventListener("click", this._onClick);
  }

  attributeChangedCallback() {
    this._sync();
  }

  _onClick(event) {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.themeChoice) this.theme = button.dataset.themeChoice;
    if (button.dataset.cornersChoice) this.corners = button.dataset.cornersChoice;
    if (button.dataset.languageChoice) this.language = button.dataset.languageChoice;
    this.dispatchEvent(new CustomEvent("preview-change", { bubbles: true, composed: true, detail: { theme: this.theme, corners: this.corners, language: this.language } }));
  }

  _sync() {
    const theme = this.theme;
    const corners = this.corners;
    const previews = document.querySelectorAll("pds-preview");
    const sole = this.isConnected && previews.length === 1 && previews[0] === this;  // never touch the page from a detached or second preview
    this.dataset.theme = theme;
    if (sole) document.documentElement.dataset.theme = theme;
    for (const b of this.shadowRoot.querySelectorAll("[data-theme-choice]")) b.setAttribute("aria-pressed", String(b.dataset.themeChoice === theme));
    for (const b of this.shadowRoot.querySelectorAll("[data-corners-choice]")) b.setAttribute("aria-pressed", String(b.dataset.cornersChoice === corners));
    this._frame.style.setProperty("--_width", `${this.width}px`);
    this._frame.style.setProperty("--_height", `${this.height}px`);
    const language = this.language;
    for (const b of this.shadowRoot.querySelectorAll("[data-language-choice]")) b.setAttribute("aria-pressed", String(b.dataset.languageChoice === language));
    this.lang = LANG_TAGS[language];
    if (sole) document.documentElement.lang = LANG_TAGS[language];
    this.shadowRoot.querySelector(".note").hidden = language === "en";
    const status = this.shadowRoot.querySelector(".status");
    status.hidden = this.getAttribute("status-bar") === "off";
    status.toggleAttribute("notch", this.hasAttribute("notch"));
    this.shadowRoot.querySelector(".home").hidden = this.getAttribute("home-indicator") === "off";
    this._applyLanguage(language);
  }

  /** Swap the screen's copy to `language`, keeping the English in data-en / data-<attr>-en. */
  _applyLanguage(language) {
    for (const el of this.querySelectorAll("*")) {
      if (el.hasAttribute("data-zh") || el.hasAttribute("data-ja")) {
        if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent.trim());
        const text = el.getAttribute(`data-${language}`);
        if (text !== null) el.textContent = text;
      }
      for (const { name } of [...el.attributes]) {
        const m = /^data-(.+)-(zh|ja)$/.exec(name);
        if (!m) continue;
        const attr = m[1];
        if (!el.hasAttribute(`data-${attr}-en`)) el.setAttribute(`data-${attr}-en`, el.getAttribute(attr) ?? "");
        const value = el.getAttribute(`data-${attr}-${language}`);
        if (value !== null) el.setAttribute(attr, value);
      }
    }
  }

  get theme() { return this.getAttribute("theme") === "dark" ? "dark" : "light"; }
  set theme(v) { this.setAttribute("theme", v === "dark" ? "dark" : "light"); }

  get corners() { return this.getAttribute("corners") === "square" ? "square" : "rounded"; }
  set corners(v) { this.setAttribute("corners", v === "square" ? "square" : "rounded"); }

  get width() { return Number(this.getAttribute("width")) || 375; }
  set width(v) { this.setAttribute("width", String(v)); }

  get height() { return Number(this.getAttribute("height")) || 812; }
  set height(v) { this.setAttribute("height", String(v)); }

  get language() { const v = this.getAttribute("language"); return v === "zh" || v === "ja" ? v : "en"; }
  set language(v) { this.setAttribute("language", v === "zh" || v === "ja" ? v : "en"); }
}

if (!customElements.get("pds-preview")) customElements.define("pds-preview", PdsPreview);
