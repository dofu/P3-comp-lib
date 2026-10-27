/**
 * `<pds-list>`: a plain structural container (role="list") for `pds-list-row` children.
 *
 * @element pds-list
 * @slot - One or more `pds-list-row` elements.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host { display: block; }
  </style>
  <slot></slot>
`;

export class PdsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "list");
  }
}

customElements.define("pds-list", PdsList);
