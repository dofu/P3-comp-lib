/**
 * `<pds-dialog>`: a modal that interrupts the user for a decision.
 *
 * @element pds-dialog
 *
 * @attr {boolean} [dismissible=false] - When true, Esc and a backdrop
 *   click close it. When false (default), only a slotted action can
 *   close it.
 *
 * @slot title - The dialog's headline.
 * @slot - The dialog's body content.
 * @slot actions - Up to two actions (composed from `pds-button`). Never
 *   more than two: one to confirm, one to dismiss.
 *
 * @fires pds-dialog-close - Fired after the dialog closes. detail.returnValue
 *   mirrors the native dialog's returnValue.
 *
 * @cssprop --pds-container-secondary-1-50 - Dialog container fill.
 * @cssprop --pds-on-surface-1 - Title and body text colour.
 * @cssprop --pds-dialog-scrim-opacity - Backdrop darkness, 0 to 1.
 * @cssprop --pds-dialog-max-width - Hard width ceiling, default 560px.
 *
 * Known limitations:
 * - No icon slot or scrollable-content layout yet, just title, body, and
 *   up to two actions.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      font-family: Roboto, system-ui, sans-serif;
      --pds-dialog-scrim-opacity: 0.5;
      --pds-dialog-max-width: 560px;
    }
    dialog {
      border: none;
      border-radius: 16px;
      padding: 24px;
      max-width: var(--pds-dialog-max-width, 560px);
      width: calc(100vw - 48px);
      box-sizing: border-box;
      background: var(--pds-container-secondary-1-50, #eaeaea);
      color: var(--pds-on-surface-1, #141414);
    }
    dialog::backdrop {
      background: #000;
      opacity: var(--pds-dialog-scrim-opacity, 0.5);
    }
    .title {
      font-size: 22px;
      line-height: 28px;
      margin-bottom: 16px;
    }
    .body {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 24px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  </style>
  <dialog part="dialog">
    <div class="title" part="title"><slot name="title"></slot></div>
    <div class="body" part="body"><slot></slot></div>
    <div class="actions" part="actions"><slot name="actions"></slot></div>
  </dialog>
`;

export class PdsDialog extends HTMLElement {
  static get observedAttributes() {
    return ["dismissible"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._dialog = this.shadowRoot.querySelector("dialog");
    this._onCancel = this._onCancel.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onClose = this._onClose.bind(this);
  }

  connectedCallback() {
    this._dialog.addEventListener("cancel", this._onCancel);
    this._dialog.addEventListener("click", this._onClick);
    this._dialog.addEventListener("close", this._onClose);
  }

  disconnectedCallback() {
    this._dialog.removeEventListener("cancel", this._onCancel);
    this._dialog.removeEventListener("click", this._onClick);
    this._dialog.removeEventListener("close", this._onClose);
  }

  _onCancel(event) {
    if (!this.dismissible) event.preventDefault();
  }

  _onClick(event) {
    if (this.dismissible && event.target === this._dialog) this._dialog.close();
  }

  _onClose() {
    this.dispatchEvent(new CustomEvent("pds-dialog-close", {
      bubbles: true, composed: true, detail: { returnValue: this._dialog.returnValue },
    }));
  }

  get dismissible() { return this.hasAttribute("dismissible"); }
  set dismissible(v) { this.toggleAttribute("dismissible", Boolean(v)); }

  get open() { return this._dialog.open; }
  get returnValue() { return this._dialog.returnValue; }
  set returnValue(v) { this._dialog.returnValue = v; }

  showModal() { this._dialog.showModal(); }
  close(returnValue) { this._dialog.close(returnValue); }
}

customElements.define("pds-dialog", PdsDialog);
