/**
 * `<pds-preview>`: the reviewer's frame around a generated screen. Not an
 * app component: it is the chrome a vibe-coded page wraps its screen in so
 * a reviewer can flip light and dark and rounded and square corners. The
 * controls sit outside the screen and are never part of it.
 *
 * @element pds-preview
 *
 * @attr {'light'|'dark'} [theme=light] - Theme to preview. Mirrored onto
 *   `data-theme` on the `<html>` element so `tokens/tokens.css` switches.
 * @attr {'rounded'|'square'} [corners=rounded] - Frame corners: 48 px
 *   radius, or none.
 * @attr {number} [width=375] - Frame width in CSS px.
 * @attr {number} [height=812] - Frame minimum height in CSS px. The frame
 *   grows with its content.
 * @attr {'en'|'zh'|'ja'} [language=en] - Copy language to preview: English,
 *   modern Chinese (Simplified, `zh-Hans`) or Japanese. Sets `lang` on
 *   `<html>` and swaps the screen's copy: an element with `data-zh` and
 *   `data-ja` gets its text replaced; an element with `data-<attr>-zh` and
 *   `data-<attr>-ja` gets that attribute replaced (title, label,
 *   placeholder, supporting-text, error, message, action-label). English
 *   is kept in `data-en` / `data-<attr>-en` and restored on EN.
 *   While 中文 or 日本語 is selected, a note under the toolbar states that the
 *   copy is the model's shortest suggestion, not from POEMS translation files.
 *
 * @slot - The screen. The frame paints `--pds-surface-1` behind it and
 *   `--pds-on-surface-1` for text, so the screen need not style its own
 *   page background.
 *
 * @fires pds-preview-change - detail: `{ theme, corners, language }` after any toggle.
 *   (Named so it cannot be confused with the screen's own `change` events,
 *   which bubble up through this wrapper.)
 *
 * @cssprop --pds-surface-1 - Frame background.
 * @cssprop --pds-on-surface-1 - Frame text colour.
 * @cssprop --pds-preview-radius - Corner radius when `corners="rounded"` (default 48px).
 */
const LANG_TAGS = { en: "en", zh: "zh-Hans", ja: "ja" };
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
      background: #e6e6e6;
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
      width: var(--_width, 375px);
      max-width: 100%;
      min-height: var(--_height, 812px);
      box-sizing: border-box;
      overflow: hidden;
      border-radius: var(--pds-preview-radius, 48px);
      background: var(--pds-surface-1, #ffffff);
      color: var(--pds-on-surface-1, #141414);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
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
  <div class="frame" part="frame"><slot></slot></div>
`;

export class PdsPreview extends HTMLElement {
  static get observedAttributes() {
    return ["theme", "corners", "width", "height", "language"];
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
    this._sync();
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
    this.dispatchEvent(new CustomEvent("pds-preview-change", { bubbles: true, composed: true, detail: { theme: this.theme, corners: this.corners, language: this.language } }));
  }

  _sync() {
    const theme = this.theme;
    const corners = this.corners;
    document.documentElement.dataset.theme = theme;
    for (const b of this.shadowRoot.querySelectorAll("[data-theme-choice]")) b.setAttribute("aria-pressed", String(b.dataset.themeChoice === theme));
    for (const b of this.shadowRoot.querySelectorAll("[data-corners-choice]")) b.setAttribute("aria-pressed", String(b.dataset.cornersChoice === corners));
    this._frame.style.setProperty("--_width", `${this.width}px`);
    this._frame.style.setProperty("--_height", `${this.height}px`);
    const language = this.language;
    for (const b of this.shadowRoot.querySelectorAll("[data-language-choice]")) b.setAttribute("aria-pressed", String(b.dataset.languageChoice === language));
    document.documentElement.lang = LANG_TAGS[language];
    this.shadowRoot.querySelector(".note").hidden = language === "en";
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
