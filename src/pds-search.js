/**
 * `<pds-search>`: a search bar wrapping a native `<input type="search">`.
 *
 * @element pds-search
 *
 * @attr {string} [placeholder] - Forwarded to the internal input.
 * @attr {string} [value] - Seeds the internal input's initial value.
 * @attr {number} [debounce=300] - Milliseconds to wait after the last
 *   keystroke before firing `search`.
 * @attr {number} [min-length=2] - Minimum trimmed query length required
 *   before `search` can fire.
 *
 * @slot icon - Optional leading icon or avatar.
 *
 * @fires search - detail: `{ value }`. Fires `debounce` ms after the last
 *   keystroke once `min-length` is met, or immediately on Enter.
 *
 * @cssprop --pds-transparency-outline-20 - Border colour.
 * @cssprop --pds-transparent-white-8 - Hover wash.
 * @cssprop --pds-transparent-white-12 - Pressed wash.
 * @cssprop --pds-on-surface-1 - Icon and typed-text colour.
 * @cssprop --pds-on-surface-2 - Placeholder text colour.
 *
 * Known limitations:
 * - No Focused or Disabled visual state yet.
 * - This border colour token currently resolves to the same value in
 *   Dark and Light mode, so the outline reads faint on a light background.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
    }
    .bar {
      display: flex;
      align-items: center;
      gap: 4px;
      min-height: 56px;
      border-radius: 28px;
      border: 1px solid var(--pds-transparency-outline-20, #ffffff33);
      padding: 4px;
      box-sizing: border-box;
    }
    .bar:hover { background: var(--pds-transparent-white-8, rgba(255, 255, 255, 0.08)); }
    .bar:has(input:active) { background: var(--pds-transparent-white-12, rgba(255, 255, 255, 0.12)); }
    ::slotted([slot="icon"]) {
      width: 48px;
      height: 48px;
      color: var(--pds-on-surface-1, #141414);
      flex: none;
    }
    input {
      all: unset;
      flex: 1;
      min-width: 0;
      font-size: 16px;
      letter-spacing: 0.5px;
      line-height: 24px;
      color: var(--pds-on-surface-1, #141414);
    }
    input::placeholder { color: var(--pds-on-surface-2, #595959); }
    .search-button {
      all: unset;
      flex: none;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--pds-on-surface-1, #141414);
    }
    .search-button svg { width: 18px; height: 18px; }
  </style>
  <div class="bar" part="bar">
    <slot name="icon" part="leading-icon"></slot>
    <input type="search" part="input" />
    <button type="button" class="search-button" part="search-button" aria-label="Search">
      <svg viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/><path d="M13 13L17 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  </div>
`;

export class PdsSearch extends HTMLElement {
  static get observedAttributes() {
    return ["placeholder", "value", "debounce", "min-length"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector("input");
    this._searchBtn = this.shadowRoot.querySelector(".search-button");
    this._timer = null;
    this._onInput = this._onInput.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onSearchClick = this._onSearchClick.bind(this);
  }

  connectedCallback() {
    this._input.addEventListener("input", this._onInput);
    this._input.addEventListener("keydown", this._onKeydown);
    this._searchBtn.addEventListener("click", this._onSearchClick);
    this._sync();
  }

  disconnectedCallback() {
    this._input.removeEventListener("input", this._onInput);
    this._input.removeEventListener("keydown", this._onKeydown);
    this._searchBtn.removeEventListener("click", this._onSearchClick);
    if (this._timer) clearTimeout(this._timer);
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    this._input.placeholder = this.getAttribute("placeholder") || "";
    if (this.hasAttribute("value")) this._input.value = this.getAttribute("value");
  }

  _onInput() {
    if (this._timer) clearTimeout(this._timer);
    this._timer = setTimeout(() => this._maybeFire(), this.debounce);
  }

  _onKeydown(event) {
    if (event.key === "Enter") this._maybeFire(true);
  }

  _onSearchClick() { this._maybeFire(true); }

  _maybeFire(force) {
    const value = this._input.value.trim();
    if (!force && value.length < this.minLength) return;
    this.dispatchEvent(new CustomEvent("search", { bubbles: true, composed: true, detail: { value } }));
  }

  get value() { return this._input.value; }
  set value(v) { this._input.value = v; }

  get debounce() { return Number(this.getAttribute("debounce") ?? 300); }
  set debounce(v) { this.setAttribute("debounce", String(v)); }

  get minLength() { return Number(this.getAttribute("min-length") ?? 2); }
  set minLength(v) { this.setAttribute("min-length", String(v)); }
}

customElements.define("pds-search", PdsSearch);
