/**
 * `<pds-icon-button>`: an icon-only button with a 48px touch target, for the
 * back and close actions in a top app bar and for toolbar actions.
 *
 * @element pds-icon-button
 *
 * @attr {string} icon - Icon name from `icons/` (see `icons/icons.json`), e.g.
 *   `arrow_left`, `close`, `search`, `notification`.
 * @attr {string} label - Accessible name, required: what the button does
 *   ("Back", "Close"). There is no visible text.
 * @attr {boolean} [disabled=false] - Disabled state.
 *
 * @fires click - Native click event; suppressed while `disabled`.
 *
 * @cssprop --pds-on-surface-1 - Icon colour.
 * @cssprop --pds-state-hover - Hover wash.
 * @cssprop --pds-state-pressed - Pressed wash.
 * @cssprop --pds-container-primary-1 - Focus ring.
 */
import "./pds-icon.js";

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      flex: none;
      width: 48px;
      height: 48px;
      color: var(--pds-on-surface-1, #141414);
    }
    :host([hidden]) { display: none; }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      color: inherit;
      cursor: pointer;
    }
    button:hover { background: var(--pds-state-hover, rgba(20, 20, 20, 0.08)); }
    button:active { background: var(--pds-state-pressed, rgba(20, 20, 20, 0.12)); }
    button:focus-visible { outline: 2px solid var(--pds-container-primary-1, #f78f20); outline-offset: -2px; }
    button:disabled { cursor: not-allowed; opacity: 0.38; }
  </style>
  <button type="button" part="button"><pds-icon part="icon"></pds-icon></button>
`;

export class PdsIconButton extends HTMLElement {
  static get observedAttributes() {
    return ["icon", "label", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
    this._icon = this.shadowRoot.querySelector("pds-icon");
    this._button.addEventListener("click", (e) => { if (this.disabled) { e.stopImmediatePropagation(); e.preventDefault(); } });
  }

  connectedCallback() { this._sync(); }
  attributeChangedCallback() { this._sync(); }

  _sync() {
    this._icon.setAttribute("name", this.icon);
    this._button.setAttribute("aria-label", this.label || this.icon.replace(/[_-]/g, " "));
    this._button.disabled = this.disabled;
  }

  get icon() { return this.getAttribute("icon") || ""; }
  set icon(v) { this.setAttribute("icon", v); }

  get label() { return this.getAttribute("label") || ""; }
  set label(v) { this.setAttribute("label", v); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }
}

if (!customElements.get("pds-icon-button")) customElements.define("pds-icon-button", PdsIconButton);
