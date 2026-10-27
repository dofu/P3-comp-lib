/**
 * `<pds-bottom-sheet>`: a panel anchored to the bottom edge of the
 * viewport, for a focused task or a short set of choices on narrow
 * screens. Wraps the native `<dialog>` element.
 *
 * @element pds-bottom-sheet
 *
 * @attr {boolean} [open=false] - Reflects the sheet's shown/hidden state.
 *   Prefer the `show()`/`close()` methods over toggling this directly.
 * @attr {boolean} [dismissible=true] - Whether Escape and a backdrop
 *   click close the sheet. Set `dismissible="false"` for a sheet that
 *   requires an explicit in-content action to close.
 *
 * @slot - The sheet's content.
 *
 * @fires dismiss - Fired when the sheet closes. `detail: { reason }`,
 *   where reason is `"backdrop"`, `"escape"`, or `"api"`.
 *
 * @cssprop --pds-surface-1 - Sheet background.
 * @cssprop --pds-transparent-black-50 - Backdrop scrim.
 * @cssprop --pds-scheme-on-surface-variant - Drag handle colour.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host { font-family: Roboto, system-ui, sans-serif; }
    dialog {
      margin: 0;
      padding: 0;
      border: none;
      position: fixed;
      inset: auto 0 0 0;
      width: 100%;
      max-height: 80vh;
      box-sizing: border-box;
      border-radius: 28px 28px 0 0;
      background: var(--pds-surface-1, #ffffff);
      overflow-y: auto;
    }
    dialog::backdrop {
      background: var(--pds-transparent-black-50, rgba(0, 0, 0, 0.5));
    }
    .handle {
      display: flex;
      justify-content: center;
      padding: 8px 0;
      position: sticky;
      top: 0;
      background: inherit;
    }
    .handle::before {
      content: "";
      width: 32px;
      height: 4px;
      border-radius: 999px;
      background: var(--pds-scheme-on-surface-variant, #79747e);
      opacity: 0.4;
    }
    .content { padding: 0 16px 16px; }
  </style>
  <dialog part="dialog">
    <div class="handle" part="handle"></div>
    <div class="content" part="content"><slot></slot></div>
  </dialog>
`;

export class PdsBottomSheet extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._dialog = this.shadowRoot.querySelector("dialog");
    this._upgradeProperty("open");
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
    this._dialog.addEventListener("cancel", (event) => {
      if (!this.dismissible) { event.preventDefault(); return; }
      this._closeWith("escape");
    });
    this._dialog.addEventListener("click", (event) => {
      if (event.target === this._dialog && this.dismissible) this._closeWith("backdrop");
    });
    if (this.open) this._dialog.showModal();
  }

  attributeChangedCallback(name) {
    if (name !== "open") return;
    if (this.open && !this._dialog.open) this._dialog.showModal();
    else if (!this.open && this._dialog.open) this._dialog.close();
  }

  show() { this.open = true; }
  close() { this._closeWith("api"); }

  _closeWith(reason) {
    this.open = false;
    this.dispatchEvent(new CustomEvent("dismiss", { bubbles: true, composed: true, detail: { reason } }));
  }

  get open() { return this.hasAttribute("open"); }
  set open(v) { this.toggleAttribute("open", Boolean(v)); }

  get dismissible() { return !this.hasAttribute("dismissible") || this.getAttribute("dismissible") !== "false"; }
  set dismissible(v) { this.setAttribute("dismissible", String(Boolean(v))); }
}

customElements.define("pds-bottom-sheet", PdsBottomSheet);
