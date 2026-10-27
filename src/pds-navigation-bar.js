/**
 * `<pds-navigation-bar>`: a bottom navigation bar managing single-selection
 * among its `pds-nav-item` children.
 *
 * @element pds-navigation-bar
 * @slot - One or more `pds-nav-item` elements, in destination order.
 * @cssprop --pds-surface-1 - Bar background.
 * @cssprop --pds-transparency-outline-20 - The bar's top divider.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      background: var(--pds-surface-1, #ffffff);
      border-top: 1px solid var(--pds-transparency-outline-20, #ffffff33);
    }
    .items {
      display: flex;
    }
  </style>
  <div class="items" part="items" role="tablist"><slot></slot></div>
`;

export class PdsNavigationBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._slot = this.shadowRoot.querySelector("slot");
    this._onSlotChange = this._syncSelection.bind(this);
  }

  connectedCallback() {
    this._slot.addEventListener("slotchange", this._onSlotChange);
    this.addEventListener("click", this._onClick.bind(this));
    this._syncWhenReady();
  }

  disconnectedCallback() {
    this._slot.removeEventListener("slotchange", this._onSlotChange);
  }

  /** See the longer note on pds-tabs: connectedCallback can run before a
   * slotted pds-nav-item has upgraded. Waiting for pds-nav-item to be
   * defined avoids silently breaking the initial selection sync. */
  _syncWhenReady() {
    if (customElements.get("pds-nav-item")) {
      this._syncSelection();
      return;
    }
    customElements.whenDefined("pds-nav-item").then(() => {
      if (this.isConnected) this._syncSelection();
    });
  }

  _items() {
    return Array.from(this.children).filter((el) => el.tagName === "PDS-NAV-ITEM");
  }

  _syncSelection() {
    const items = this._items();
    if (!items.length) return;
    const selected = items.filter((el) => el.selected);
    if (selected.length === 0) items[0].selected = true;
    else if (selected.length > 1) for (const el of selected.slice(1)) el.selected = false;
    for (const el of items) el._setRoving(el.selected);
  }

  _onClick(event) {
    const item = event.target.closest("pds-nav-item");
    if (!item || !this.contains(item)) return;
    for (const el of this._items()) {
      el.selected = el === item;
      el._setRoving(el === item);
    }
    item.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }
}

customElements.define("pds-navigation-bar", PdsNavigationBar);
