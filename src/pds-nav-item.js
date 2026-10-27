/**
 * `<pds-nav-item>`: a navigation destination, used inside `pds-navigation-bar`.
 *
 * @element pds-nav-item
 *
 * @attr {boolean} [selected=false] - Exactly one `pds-nav-item` sharing
 *   the same parent is selected at a time; enforced by the parent.
 * @attr {string} [icon] - Icon name from `icons/` (see `icons/icons.json`):
 *   `home`, `watchlist`, `globe`, `trade`, `community`, `me` for the P3
 *   bottom bar. The item shows `<name>-rounded` when unselected and
 *   `<name>-filled` when selected, falling back to `<name>` where no
 *   variant exists. Use the `icon` slot instead for a custom icon.
 *
 * @slot - The item's label text.
 * @slot icon - A custom icon (inline SVG), when `icon` is not set.
 * @slot badge - An optional `pds-badge`, positioned on the icon's corner.
 *
 * @fires change - Fired when the user selects this item.
 *
 * @cssprop --pds-container-primary-1 - Selected icon colour and the 2px
 *   indicator line at the top of the selected item.
 * @cssprop --pds-on-surface-1 - Selected label colour.
 * @cssprop --pds-on-surface-2 - Unselected icon and label colour.
 *
 * Matches the P3 bottom bar (Trade Tab Header file): items 62px tall, a 2px
 * orange line across the top of the selected item, orange icon and bold
 * label when selected, grey icon and label otherwise. No pill.
 */
import { iconName } from "./pds-icon.js";

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
      gap: 6px;
      width: 100%;
      height: 62px;
      cursor: pointer;
      position: relative;
      color: var(--pds-on-surface-2, #595959);
    }
    button::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: transparent;
    }
    :host([selected]) button::before { background: var(--pds-container-primary-1, #f78f20); }
    .icon-wrap { position: relative; display: inline-flex; width: 24px; height: 24px; }
    :host([selected]) .icon-wrap { color: var(--pds-container-primary-1, #f78f20); }
    ::slotted([slot="icon"]) { width: 24px; height: 24px; }
    ::slotted([slot="badge"]) { position: absolute; top: -4px; right: -4px; }
    .label {
      font-size: 12px;
      letter-spacing: 0.5px;
      line-height: 16px;
    }
    :host([selected]) .label {
      color: var(--pds-on-surface-1, #141414);
      font-weight: 700;
    }
    button:focus-visible {
      outline: 2px solid var(--pds-container-primary-1, #f78f20);
      outline-offset: -2px;
    }
  </style>
  <button type="button" part="button" role="tab">
    <span class="icon-wrap" part="icon">
      <slot name="icon"></slot>
      <slot name="badge"></slot>
    </span>
    <span class="label" part="label"><slot></slot></span>
  </button>
`;

export class PdsNavItem extends HTMLElement {
  static get observedAttributes() {
    return ["selected", "icon"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
    this._iconWrap = this.shadowRoot.querySelector(".icon-wrap");
    this._iconEl = null;
    this._upgradeProperty("selected");
    this._upgradeProperty("icon");
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

  connectedCallback() { this._sync(); }
  attributeChangedCallback() { this._sync(); }

  _sync() {
    this._button.setAttribute("aria-selected", String(this.selected));
    const icon = this.icon;
    if (!icon) {
      if (this._iconEl) { this._iconEl.remove(); this._iconEl = null; }
      return;
    }
    if (!this._iconEl) {
      this._iconEl = document.createElement("pds-icon");
      this._iconWrap.prepend(this._iconEl);
    }
    this._iconEl.setAttribute("name", iconName(icon, this.selected ? "filled" : "rounded"));
  }

  _setRoving(isTabStop) {
    this.tabIndex = isTabStop ? 0 : -1;
  }

  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }

  get icon() { return this.getAttribute("icon") || ""; }
  set icon(v) { if (v) this.setAttribute("icon", v); else this.removeAttribute("icon"); }
}

customElements.define("pds-nav-item", PdsNavItem);
