/**
 * `<pds-tab>`: a tab item, used inside `pds-tabs`.
 *
 * @element pds-tab
 *
 * @attr {boolean} [selected=false] - Normally set by the parent `pds-tabs`.
 * @attr {boolean} [disabled=false] - Disabled state.
 * @attr {string} [value] - An identifier for whatever content this tab switches to.
 *
 * @slot - The label text. Casing is left exactly as typed.
 * @slot badge - Optional badge content; place a `pds-badge` here.
 *
 * @fires change - Dispatched by the parent `pds-tabs` when this tab becomes selected.
 *
 * @cssprop --pds-on-container-tertiary - Selected label and indicator colour.
 * @cssprop --pds-on-surface-1 - Unselected label colour.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      flex: none;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 48px;
      padding: 0 16px;
      font-size: 14px;
      letter-spacing: 0.1px;
      line-height: 20px;
      color: var(--pds-on-surface-1, #141414);
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
    }
    :host([selected]) button {
      color: var(--pds-on-container-tertiary, #c36807);
      border-bottom-color: var(--pds-on-container-tertiary, #c36807);
    }
    :host([disabled]) button { cursor: not-allowed; opacity: 0.5; }
    button:focus-visible {
      outline: 2px solid var(--pds-on-container-tertiary, #c36807);
      outline-offset: -2px;
    }
  </style>
  <button type="button" part="tab" role="tab">
    <slot></slot>
    <slot name="badge"></slot>
  </button>
`;

export class PdsTab extends HTMLElement {
  static get observedAttributes() {
    return ["selected"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
    this._upgradeProperty("selected");
    this._upgradeProperty("value");
  }

  connectedCallback() {
    this._syncSelected();
  }

  attributeChangedCallback(name) {
    if (name === "selected") this._syncSelected();
  }

  /** Drains a property value that may have been set on this element
   * before its class was registered (e.g. a parent `pds-tabs` writing
   * `tab.selected` while this module is still loading): without this,
   * that early write creates a plain own property that permanently
   * shadows the getter/setter below, silently breaking it. */
  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  _syncSelected() {
    this._button.setAttribute("aria-selected", String(this.selected));
  }

  /** Roving-tabindex setter used by the parent `pds-tabs`; not public API. */
  _setRoving(isTabStop) {
    this.tabIndex = isTabStop ? 0 : -1;
  }

  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get value() { return this.getAttribute("value") || ""; }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("pds-tab", PdsTab);
