/**
 * `<pds-nav-item>`: a navigation destination, used inside `pds-navigation-bar`.
 *
 * @element pds-nav-item
 *
 * @attr {boolean} [selected=false] - Exactly one `pds-nav-item` sharing
 *   the same parent is selected at a time; enforced by the parent.
 *
 * @slot - The item's label text.
 * @slot icon - The destination's icon.
 * @slot badge - An optional `pds-badge`, positioned on the icon's corner.
 *
 * @fires change - Fired when the user selects this item.
 *
 * @cssprop --pds-scheme-secondary-container - Selected pill fill.
 * @cssprop --pds-scheme-on-surface - Selected label colour, and the base
 *   colour for the hover/focus/pressed wash.
 * @cssprop --pds-scheme-on-surface-variant - Unselected label colour.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      flex: 1 1 0;
      font-family: Roboto, system-ui, sans-serif;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      height: 56px;
      cursor: pointer;
      position: relative;
    }
    .icon-wrap { position: relative; display: inline-flex; }
    .pill {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 32px;
      border-radius: 999px;
    }
    :host([selected]) .pill { background: var(--pds-scheme-secondary-container, #e8def8); }
    ::slotted([slot="icon"]) { width: 24px; height: 24px; }
    ::slotted([slot="badge"]) { position: absolute; top: -4px; right: -4px; }
    .label {
      font-size: 12px;
      letter-spacing: 0.5px;
      line-height: 16px;
      color: var(--pds-scheme-on-surface-variant, #49454f);
    }
    :host([selected]) .label {
      color: var(--pds-scheme-on-surface, #1d1b20);
      font-weight: 600;
    }
    button:focus-visible {
      outline: 2px solid var(--pds-scheme-on-surface, #1d1b20);
      outline-offset: -2px;
    }
  </style>
  <button type="button" part="button" role="tab">
    <span class="pill" part="pill">
      <span class="icon-wrap">
        <slot name="icon"></slot>
        <slot name="badge"></slot>
      </span>
    </span>
    <span class="label" part="label"><slot></slot></span>
  </button>
`;

export class PdsNavItem extends HTMLElement {
  static get observedAttributes() {
    return ["selected"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
    this._upgradeProperty("selected");
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
    this._button.setAttribute("aria-selected", String(this.selected));
  }

  attributeChangedCallback() {
    this._button.setAttribute("aria-selected", String(this.selected));
  }

  _setRoving(isTabStop) {
    this.tabIndex = isTabStop ? 0 : -1;
  }

  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }
}

customElements.define("pds-nav-item", PdsNavItem);
