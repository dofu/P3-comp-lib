/**
 * `<pds-tabs>`: a tab list managing selection and keyboard navigation for
 * its `pds-tab` children.
 *
 * @element pds-tabs
 * @slot - One or more `pds-tab` elements.
 * @fires change - Bubbles from whichever `pds-tab` becomes selected.
 * @cssprop --pds-surface-1 - Background of the whole tab row.
 * @cssprop --pds-transparency-outline-20 - The row's bottom divider colour.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
      background: var(--pds-surface-1, #ffffff);
    }
    .list {
      display: flex;
      overflow-x: auto;
      border-bottom: 1px solid var(--pds-transparency-outline-20, #ffffff33);
    }
  </style>
  <div class="list" part="list" role="tablist"><slot></slot></div>
`;

export class PdsTabs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._slot = this.shadowRoot.querySelector("slot");
    this._onSlotChange = this._syncSelection.bind(this);
  }

  connectedCallback() {
    this._slot.addEventListener("slotchange", this._onSlotChange);
    this._syncWhenReady();
  }

  disconnectedCallback() {
    this._slot.removeEventListener("slotchange", this._onSlotChange);
  }

  /** connectedCallback can run before a slotted pds-tab has upgraded (for
   * example if this module loads first). Setting `.selected` on a
   * not-yet-upgraded element creates a plain own property that
   * permanently shadows the real getter/setter once it does upgrade, a
   * well-known Custom Elements pitfall. Waiting for pds-tab to be defined
   * avoids it regardless of script/import order; a no-op await if it's
   * already defined. */
  _syncWhenReady() {
    if (customElements.get("pds-tab")) {
      this._syncSelection();
      return;
    }
    customElements.whenDefined("pds-tab").then(() => {
      if (this.isConnected) this._syncSelection();
    });
  }

  _tabs() {
    return Array.from(this.children).filter((el) => el.tagName === "PDS-TAB");
  }

  _syncSelection() {
    const tabs = this._tabs();
    if (!tabs.length) return;
    const selected = tabs.filter((t) => t.selected);
    if (selected.length === 0) tabs[0].selected = true;
    else if (selected.length > 1) for (const t of selected.slice(1)) t.selected = false;
    for (const t of tabs) t._setRoving(t.selected);
    if (!tabs.some((t) => t._hasListeners)) {
      for (const t of tabs) {
        t._hasListeners = true;
        t.addEventListener("click", () => this._select(t));
        t.addEventListener("keydown", (e) => this._onKeydown(e, t));
      }
    }
  }

  _select(tab) {
    if (tab.disabled) return;
    for (const t of this._tabs()) {
      t.selected = t === tab;
      t._setRoving(t === tab);
    }
    tab.focus();
    tab.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  _onKeydown(event, tab) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const tabs = this._tabs();
    const i = tabs.indexOf(tab);
    let next;
    if (event.key === "Home") next = tabs[0];
    else if (event.key === "End") next = tabs[tabs.length - 1];
    else {
      const dir = event.key === "ArrowRight" ? 1 : -1;
      next = tabs[(i + dir + tabs.length) % tabs.length];
    }
    if (next) this._select(next);
  }

  get selectedTab() { return this._tabs().find((t) => t.selected) || null; }
}

customElements.define("pds-tabs", PdsTabs);
