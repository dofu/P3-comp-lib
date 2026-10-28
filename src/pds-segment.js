/**
 * `<pds-segment>`: one option inside a `<pds-segmented-button>`.
 *
 * @element pds-segment
 *
 * @attr {string} value - The value the group reports when this segment is chosen.
 * @attr {boolean} [selected=false] - The chosen segment. The group keeps exactly one.
 * @attr {boolean} [disabled=false] - Cannot be chosen.
 * @attr {'positive'|'negative'} [tone] - Colour of the selected state: green for
 *   Buy or price up, red for Sell or price down. Everything else is orange.
 *
 * @slot - The label: one or two words. It never wraps or truncates; the
 *   control grows instead.
 *
 * @cssprop --pds-container-primary-1 - Selected fill.
 * @cssprop --pds-transparency-outline-20 - Outline of an unselected segment.
 * @cssprop --pds-on-container-inverse-primary - Label of an unselected segment.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      flex: 1 1 0;
      min-width: 0;
      font-family: var(--pds-font-family, Roboto, system-ui, sans-serif);
    }
    :host([hidden]) { display: none; }
    button {
      all: unset;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 40px;
      padding: 9px 12px; /* 9 + 20 line + 9 + the two 1 px borders = 40 */
      margin-left: -1px; /* neighbouring outlines overlap into one hairline */
      border: 1px solid var(--pds-transparency-outline-20, rgba(20, 20, 20, 0.2));
      color: var(--pds-on-container-inverse-primary, #141414);
      font-size: var(--pds-type-body-medium-size, 14px);
      letter-spacing: var(--pds-type-body-medium-tracking, 0.25px);
      line-height: var(--pds-type-body-medium-line, 20px);
      white-space: nowrap; /* a segment label never wraps; the control grows */
      cursor: pointer;
    }
    :host(:first-child) button { margin-left: 0; border-radius: var(--pds-radius-full, 9999px) 0 0 var(--pds-radius-full, 9999px); }
    :host(:last-child) button { border-radius: 0 var(--pds-radius-full, 9999px) var(--pds-radius-full, 9999px) 0; }
    :host(:first-child:last-child) button { border-radius: var(--pds-radius-full, 9999px); }
    button:hover { background: var(--pds-state-hover, rgba(20, 20, 20, 0.08)); }
    button:active { background: var(--pds-state-pressed, rgba(20, 20, 20, 0.12)); }
    :host([selected]) button {
      z-index: 1;
      background: var(--pds-container-primary-1, #f78f20);
      border-color: transparent;
      color: var(--pds-grey-600, #141414);
    }
    :host([selected][tone="positive"]) button { background: var(--pds-container-positive, #008b57); color: var(--pds-on-container-positive, #ffffff); }
    :host([selected][tone="negative"]) button { background: var(--pds-container-negative, #ca2323); color: var(--pds-on-container-negative, #ffffff); }
    :host([disabled]) button { color: var(--pds-grey-300, #747474); cursor: not-allowed; }
    :host([disabled][selected]) button { opacity: 0.5; }
    button:focus-visible { z-index: 2; outline: 2px solid var(--pds-outline-focus, #0043ce); outline-offset: 2px; }
  </style>
  <button type="button" part="segment" role="radio" aria-checked="false" tabindex="-1"><slot></slot></button>
`;

export class PdsSegment extends HTMLElement {
  static get observedAttributes() { return ["selected", "disabled", "value", "tone"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open", delegatesFocus: true });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
  }

  connectedCallback() { this._sync(); }
  attributeChangedCallback() { this._sync(); }

  _sync() {
    this._button.setAttribute("aria-checked", String(this.selected));
    this._button.disabled = this.disabled;
    this._button.tabIndex = this.selected && !this.disabled ? 0 : -1;
  }

  get value() { return this.getAttribute("value") ?? ""; }
  set value(v) { this.setAttribute("value", v); }
  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }
  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }
  get tone() { return this.getAttribute("tone"); }
  set tone(v) { if (v) this.setAttribute("tone", v); else this.removeAttribute("tone"); }
}

customElements.define("pds-segment", PdsSegment);
