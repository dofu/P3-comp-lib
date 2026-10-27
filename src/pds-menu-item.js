/**
 * `<pds-menu-item>`: a single row inside `pds-menu`.
 *
 * @element pds-menu-item
 *
 * @attr {'0'|'-2'|'-4'} [density=0] - Row height: 56px / 48px / 40px.
 *   Normally set by the parent `pds-menu`, not authored directly.
 * @attr {boolean} [selected=false] - Shows a checked leading icon and a
 *   tinted background.
 * @attr {boolean} [disabled=false]
 * @attr {string} [value] - Included on the `select` event's detail.
 *
 * @slot - Label text.
 * @slot leading - An optional leading icon. Ignored while `selected`.
 * @slot trailing - An optional trailing icon or shortcut hint.
 *
 * @fires select - Fired on click or Enter/Space when not disabled.
 *   `detail: { value }`.
 *
 * @cssprop --pds-scheme-secondary-container - Selected row background.
 * @cssprop --pds-scheme-on-surface - Label colour, and the base colour
 *   for the hover/focus/pressed state layer.
 * @cssprop --pds-scheme-on-surface-variant - Trailing icon or shortcut
 *   hint colour.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
    }
    .row {
      all: unset;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      height: 56px;
      padding: 0 12px;
      cursor: pointer;
      color: var(--pds-scheme-on-surface, #1d1b20);
      position: relative;
    }
    :host([density="-2"]) .row { height: 48px; }
    :host([density="-4"]) .row { height: 40px; }
    :host([selected]) .row { background: var(--pds-scheme-secondary-container, #e8def8); }
    .row:hover { background: color-mix(in srgb, var(--pds-scheme-on-surface, #1d1b20) 8%, transparent); }
    .row:focus-visible { outline: 2px solid var(--pds-scheme-on-surface, #1d1b20); outline-offset: -2px; }
    ::slotted([slot="leading"]) { width: 20px; height: 20px; flex: none; }
    .check { width: 20px; height: 20px; flex: none; display: none; }
    :host([selected]) .check { display: inline-flex; }
    :host([selected]) ::slotted([slot="leading"]) { display: none; }
    .label { flex: 1 1 auto; font-size: 14px; line-height: 20px; text-align: left; }
    ::slotted([slot="trailing"]) { flex: none; color: var(--pds-scheme-on-surface-variant, #49454f); }
    :host([disabled]) .row { opacity: 0.38; cursor: default; pointer-events: none; }
  </style>
  <div class="row" part="row" role="menuitem" tabindex="0">
    <svg class="check" part="check" viewBox="0 0 20 20" fill="none">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <slot name="leading" part="leading"></slot>
    <span class="label" part="label"><slot></slot></span>
    <slot name="trailing" part="trailing"></slot>
  </div>
`;

export class PdsMenuItem extends HTMLElement {
  static get observedAttributes() {
    return ["disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._row = this.shadowRoot.querySelector(".row");
    this._upgradeProperty("selected");
    this._upgradeProperty("value");
  }

  /** See the longer note on pds-tabs/pds-tab: draining a property write
   * that landed on this element before its class registered avoids a
   * silent, permanent shadowing bug. */
  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  connectedCallback() {
    this._row.addEventListener("click", this._onActivate.bind(this));
    this._row.addEventListener("keydown", this._onKeydown.bind(this));
    this._syncDisabled();
  }

  attributeChangedCallback() {
    this._syncDisabled();
  }

  _syncDisabled() {
    if (this.disabled) this._row.removeAttribute("tabindex");
    else this._row.setAttribute("tabindex", "0");
  }

  _onKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._onActivate();
    }
  }

  _onActivate() {
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("select", { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get value() { return this.getAttribute("value") || ""; }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("pds-menu-item", PdsMenuItem);
