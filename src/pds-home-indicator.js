/**
 * `<pds-home-indicator>`: the phone's home indicator zone at the bottom of a
 * screen, as drawn on the P3 screens in Figma (375 x 34, the 134 x 5 line
 * centred, 8px from the bottom). It is separate from `pds-navigation-bar`
 * because every screen has the home line and only root screens have the bar.
 *
 * @element pds-home-indicator
 *
 * @cssprop --pds-on-surface-1 - Line colour; the zone itself is transparent
 *   and takes the screen's surface behind it.
 *
 * Decorative: `aria-hidden`.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      height: 34px;
      box-sizing: border-box;
      flex: none;
    }
    :host([hidden]) { display: none; }
    .line {
      position: absolute;
      left: 50%;
      bottom: 8px;
      width: 134px;
      height: 5px;
      margin-left: -67px;
      border-radius: 2.5px;
      background: var(--pds-on-surface-1, #141414);
    }
  </style>
  <span class="line" part="line"></span>
`;

export class PdsHomeIndicator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
  }
}

if (!customElements.get("pds-home-indicator")) customElements.define("pds-home-indicator", PdsHomeIndicator);
