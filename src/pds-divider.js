/**
 * `<pds-divider>`: a thin rule that separates content within one context.
 *
 * @element pds-divider
 *
 * @attr {'horizontal'|'vertical'} [direction=horizontal] - Line orientation.
 * @attr {'full-width'|'inset'|'middle-inset'} [length=full-width] -
 *   full-width = no offset; inset = leading edge offset 16px, trailing
 *   edge flush; middle-inset = both edges offset 16px.
 *
 * @cssprop --pds-transparency-outline-20 - The line colour.
 *
 * Known limitations:
 * - This colour token currently resolves to the same value in both Dark
 *   and Light mode, so the line reads a little faint against a light
 *   background today.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
    }
    :host([direction="vertical"]) {
      display: inline-flex;
      align-self: stretch;
    }
    hr {
      margin: 0;
      border: none;
      background: var(--pds-transparency-outline-20, #ffffff33);
      flex: none;
    }
    :host(:not([direction="vertical"])) hr {
      width: 100%;
      height: 1px;
    }
    :host([direction="vertical"]) {
      flex-direction: column;
    }
    :host([direction="vertical"]) hr {
      width: 1px;
      height: 100%;
      align-self: stretch;
    }

    :host([length="inset"]:not([direction="vertical"])) hr { margin-left: 16px; }
    :host([length="middle-inset"]:not([direction="vertical"])) hr { margin-left: 16px; margin-right: 16px; }
    :host([length="inset"][direction="vertical"]) hr { margin-top: 16px; }
    :host([length="middle-inset"][direction="vertical"]) hr { margin-top: 16px; margin-bottom: 16px; }
  </style>
  <hr part="line" />
`;

export class PdsDivider extends HTMLElement {
  static get observedAttributes() {
    return ["direction", "length"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._hr = this.shadowRoot.querySelector("hr");
  }

  connectedCallback() {
    if (!this.hasAttribute("direction")) this.setAttribute("direction", "horizontal");
    if (!this.hasAttribute("length")) this.setAttribute("length", "full-width");
    this._syncOrientation();
  }

  attributeChangedCallback(name) {
    if (name === "direction") this._syncOrientation();
  }

  _syncOrientation() {
    this._hr.setAttribute("aria-orientation", this.direction);
  }

  /** @type {'horizontal'|'vertical'} */
  get direction() { return this.getAttribute("direction") || "horizontal"; }
  set direction(v) { this.setAttribute("direction", v); }

  /** @type {'full-width'|'inset'|'middle-inset'} */
  get length() { return this.getAttribute("length") || "full-width"; }
  set length(v) { this.setAttribute("length", v); }
}

customElements.define("pds-divider", PdsDivider);
