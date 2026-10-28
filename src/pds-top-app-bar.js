/**
 * `<pds-top-app-bar>`: the header at the top of a screen.
 *
 * @element pds-top-app-bar
 *
 * @attr {'short'|'short-with-sub'|'long'} [variant=short] - short and
 *   short-with-sub are a fixed 64px; long is 96px and can grow further
 *   for a longer headline.
 * @attr {string} [title] - The headline text. Renders as the default
 *   slot's fallback content; slotted markup takes over instead.
 * @attr {string} [subtitle] - Second line of text; only shown while
 *   `variant="short-with-sub"`.
 * @attr {boolean} [scrolled=false] - Applies an on-scroll tint. This
 *   component has no scroll listener of its own; toggle this yourself.
 *
 * @slot - The title text, for richer markup than the `title` attribute allows.
 * @slot leading - A leading icon or back button, sized to a 48x48 target.
 * @slot trailing - Trailing action icons.
 *
 * @cssprop --pds-surface-1 - Bar background.
 * @cssprop --pds-on-surface-1 - Title colour, and the default colour the
 *   leading/trailing slots inherit.
 * @cssprop --pds-on-surface-2 - Subtitle colour.
 * @cssprop --pds-top-app-bar-scroll-tint - Opacity (0 to 1) of the tint
 *   applied while `scrolled`.
 *
 * Known limitations:
 * - The exact scroll-tint opacity is not finalised; a placeholder value
 *   is used today.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
      --pds-top-app-bar-scroll-tint: 0.08;
    }
    header {
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 4px;
      min-height: 64px;
      background: var(--pds-surface-1, #ffffff);
      box-sizing: border-box;
    }
    :host([variant="long"]) header {
      align-items: flex-start;
      flex-direction: column;
      min-height: 96px;
      padding: 8px 16px 8px 4px;
    }
    header::after {
      content: "";
      position: absolute;
      inset: 0;
      background: #000;
      opacity: 0;
      pointer-events: none;
    }
    :host([scrolled]) header::after {
      opacity: var(--pds-top-app-bar-scroll-tint, 0.08);
    }
    .leading, .trailing {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    ::slotted([slot="leading"]),
    ::slotted([slot="trailing"]) {
      width: 48px;
      height: 48px;
      color: var(--pds-on-surface-1, #141414);
    }
    .content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    :host(:not([variant="long"])) .content {
      justify-content: center;
    }
    .title {
      font-size: var(--pds-type-title-large-size, 22px);
      line-height: var(--pds-type-title-large-line, 28px);
      color: var(--pds-on-surface-1, #141414);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :host([variant="long"]) .title {
      white-space: normal;
    }
    .subtitle {
      display: none;
      font-size: var(--pds-type-body-medium-size, 14px);
      letter-spacing: var(--pds-type-body-medium-tracking, 0.25px);
      line-height: var(--pds-type-body-medium-line, 20px);
      color: var(--pds-on-surface-2, #595959);
    }
    :host([variant="short-with-sub"]) .subtitle {
      display: block;
    }
  </style>
  <header part="bar">
    <span class="leading" part="leading"><slot name="leading"></slot></span>
    <span class="content" part="content">
      <span class="title" part="title"><slot></slot></span>
      <span class="subtitle" part="subtitle"></span>
    </span>
    <span class="trailing" part="trailing"><slot name="trailing"></slot></span>
  </header>
`;

export class PdsTopAppBar extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "title", "subtitle", "scrolled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._titleSlot = this.shadowRoot.querySelector(".title slot");
    this._subtitleEl = this.shadowRoot.querySelector(".subtitle");
    this._fallbackNode = null; // the text node this component writes into the slot when there is no authored content
    this._onTitleSlotChange = this._onTitleSlotChange.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "short");
    this._titleSlot.addEventListener("slotchange", this._onTitleSlotChange);
    this._onTitleSlotChange();
    this._syncSubtitle();
  }

  attributeChangedCallback(name) {
    if (name === "title") this._syncTitleFallback();
    if (name === "subtitle") this._syncSubtitle();
  }

  _onTitleSlotChange() {
    const hasContent = this._titleSlot.assignedNodes().some(
      (n) => n.nodeType === Node.ELEMENT_NODE || (n.textContent || "").trim() !== ""
    );
    if (!hasContent) this._syncTitleFallback();
  }

  _syncTitleFallback() {
    // Authored content wins; the component's own fallback node does not count as authored,
    // so a later change to the title attribute still updates the rendered title.
    const authored = this._titleSlot.assignedNodes().some(
      (n) => n !== this._fallbackNode && (n.nodeType === Node.ELEMENT_NODE || (n.textContent || "").trim() !== "")
    );
    if (authored) return;
    const text = this.getAttribute("title") || "";
    if (!this._fallbackNode) this._fallbackNode = document.createTextNode(text);
    else this._fallbackNode.textContent = text;
    if (this._fallbackNode.parentNode !== this) {
      // Only drop stray whitespace text in the default slot; never remove slotted elements (leading/trailing icons).
      for (const n of [...this.childNodes]) if (n.nodeType === Node.TEXT_NODE && !n.textContent.trim()) n.remove();
      this.appendChild(this._fallbackNode);
    }
  }

  _syncSubtitle() {
    this._subtitleEl.textContent = this.getAttribute("subtitle") || "";
  }

  get variant() { return this.getAttribute("variant") || "short"; }
  set variant(v) { this.setAttribute("variant", v); }

  get subtitle() { return this.getAttribute("subtitle") || ""; }
  set subtitle(v) { this.setAttribute("subtitle", v); }

  get scrolled() { return this.hasAttribute("scrolled"); }
  set scrolled(v) { this.toggleAttribute("scrolled", Boolean(v)); }
}

customElements.define("pds-top-app-bar", PdsTopAppBar);
