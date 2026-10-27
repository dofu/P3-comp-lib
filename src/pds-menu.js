/**
 * `<pds-menu>`: a dropdown panel of `pds-menu-item` children.
 *
 * @element pds-menu
 *
 * @attr {'0'|'-2'|'-4'} [density=0] - Propagated automatically to every
 *   slotted `pds-menu-item`.
 * @attr {boolean} [open=false] - Whether the panel is shown.
 *
 * @slot trigger - Optional trigger element. Click toggles open; Arrow
 *   Down/Up open the menu and focus the first/last item.
 * @slot - `pds-menu-item` elements.
 *
 * @fires select - Not fired directly; bubbles from whichever
 *   `pds-menu-item` descendant was activated (detail: `{ value }`).
 *
 * @cssprop --pds-container-secondary-1-50 - Panel fill.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
      font-family: Roboto, system-ui, sans-serif;
    }
    .panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 200px;
      border-radius: 4px;
      padding: 8px 0;
      background: var(--pds-container-secondary-1-50, #eaeaea);
      z-index: 100;
    }
    :host([density="0"]) .panel,
    :host(:not([density])) .panel {
      box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    :host(:not([open])) .panel { display: none; }
  </style>
  <slot name="trigger" part="trigger"></slot>
  <div class="panel" part="panel" role="menu"><slot></slot></div>
`;

export class PdsMenu extends HTMLElement {
  static get observedAttributes() {
    return ["density", "open"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._triggerSlot = this.shadowRoot.querySelector('slot[name="trigger"]');
    this._itemSlot = this.shadowRoot.querySelector(".panel slot");
    this._onTriggerClick = () => this.toggle();
    this._onDocClick = this._onDocClick.bind(this);
    this._onItemSelect = this._onItemSelect.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("density")) this.setAttribute("density", "0");
    this._triggerSlot.addEventListener("slotchange", () => this._wireTrigger());
    this._itemSlot.addEventListener("slotchange", () => this._syncItemDensity());
    this.addEventListener("select", this._onItemSelect);
    this._wireTrigger();
    this._syncItemDensity();
  }

  disconnectedCallback() {
    this.removeEventListener("select", this._onItemSelect);
    document.removeEventListener("click", this._onDocClick, true);
  }

  attributeChangedCallback(name) {
    if (name === "density") this._syncItemDensity();
    if (name === "open" && this.open) document.addEventListener("click", this._onDocClick, true);
    else document.removeEventListener("click", this._onDocClick, true);
  }

  _wireTrigger() {
    const trigger = this._triggerSlot.assignedElements()[0];
    if (trigger && !trigger._pdsMenuWired) {
      trigger._pdsMenuWired = true;
      trigger.addEventListener("click", this._onTriggerClick);
    }
  }

  _syncItemDensity() {
    const density = this.density;
    for (const item of this.querySelectorAll("pds-menu-item")) {
      item.setAttribute("density", density);
    }
  }

  _onDocClick(event) {
    if (!this.contains(event.target) && event.target !== this) this.close();
  }

  _onItemSelect() {
    this.close();
  }

  toggle() { this.open = !this.open; }
  close() { this.open = false; }

  get density() { return this.getAttribute("density") || "0"; }
  set density(v) { this.setAttribute("density", v); }

  get open() { return this.hasAttribute("open"); }
  set open(v) { this.toggleAttribute("open", Boolean(v)); }
}

customElements.define("pds-menu", PdsMenu);
