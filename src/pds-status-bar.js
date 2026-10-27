/**
 * `<pds-status-bar>`: the phone's status bar at the top of a screen, as drawn
 * on the P3 screens in Figma (375 x 44, iPhone layout): time on the left,
 * signal, wifi and battery on the right, optional notch.
 *
 * @element pds-status-bar
 *
 * @attr {string} [time=9:41] - The clock text.
 * @attr {boolean} [notch=false] - Draw the device notch (black, 219 x 30,
 *   centred). Off in `pds-preview` unless it is given `notch`.
 *
 * @cssprop --pds-on-surface-1 - Time, icon and battery colour; the bar itself
 *   is transparent and takes the screen's surface behind it.
 *
 * Decorative: it carries no live data, so the whole bar is `aria-hidden`.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
      height: 44px;
      box-sizing: border-box;
      color: var(--pds-on-surface-1, #141414);
      font-family: Roboto, system-ui, sans-serif;
      user-select: none;
    }
    :host([hidden]) { display: none; }
    .time {
      position: absolute;
      left: 24px;
      top: 12px;
      height: 21px;
      line-height: 21px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: -0.3px;
    }
    .right {
      position: absolute;
      right: 14.67px;
      top: 17.33px;
      width: 66.66px;
      height: 11.34px;
      display: block;
    }
    .notch {
      position: absolute;
      left: 50%;
      top: -2px;
      width: 219px;
      height: 30px;
      margin-left: -109.5px;
      display: none;
    }
    :host([notch]) .notch { display: block; }
  </style>
  <svg class="notch" viewBox="0 0 219 30" aria-hidden="true">__NOTCH__</svg>
  <span class="time" part="time">9:41</span>
  <svg class="right" part="icons" viewBox="0 0 66.6612 11.336" fill="none" aria-hidden="true">__RIGHT__</svg>
`.replace("__NOTCH__", `<g><path d="M0 0H219C216.894 0.602689 215.418 2.49525 215.345 4.68446L215.317 5.5618C215.317 19.0587 204.375 30 190.878 30H28.1217C14.6249 30 3.68349 19.0587 3.68349 5.5618L3.65455 4.68447C3.58233 2.49525 2.10586 0.602689 0 0Z" fill="#141414"/></g>`).replace("__RIGHT__", `<g><g><path opacity="0.35" d="M45.0002 0.502686H61.6662C62.8628 0.502686 63.8332 1.47306 63.8332 2.66968V8.66968C63.833 9.86615 62.8627 10.8357 61.6662 10.8357H45.0002C43.8037 10.8357 42.8334 9.86615 42.8332 8.66968V2.66968C42.8332 1.47306 43.8036 0.502686 45.0002 0.502686Z" fill="currentColor" stroke="currentColor"/><path opacity="0.4" d="M65.3332 3.66935V7.66935C66.1379 7.33058 66.6612 6.54249 66.6612 5.66935C66.6612 4.79622 66.1379 4.00813 65.3332 3.66935" fill="currentColor"/><path d="M44.3332 3.10269C44.3332 2.49517 44.8257 2.00269 45.4332 2.00269H61.2332C61.8407 2.00269 62.3332 2.49517 62.3332 3.10269V8.23602C62.3332 8.84353 61.8407 9.33602 61.2332 9.33602H45.4332C44.8257 9.33602 44.3332 8.84353 44.3332 8.23602V3.10269Z" fill="currentColor"/></g><path fill-rule="evenodd" clip-rule="evenodd" d="M29.6637 2.27733C31.8796 2.27742 34.0107 3.12886 35.6167 4.65566C35.7376 4.77354 35.9309 4.77205 36.05 4.65233L37.206 3.48566C37.2663 3.42494 37.2999 3.34269 37.2994 3.25711C37.2989 3.17153 37.2644 3.08967 37.2033 3.02966C32.9882 -1.00989 26.3384 -1.00989 22.1233 3.02966C22.0623 3.08963 22.0276 3.17146 22.0271 3.25704C22.0265 3.34262 22.0601 3.42489 22.1203 3.48566L23.2767 4.65233C23.3957 4.77223 23.5891 4.77372 23.71 4.65566C25.3162 3.12876 27.4476 2.27732 29.6637 2.27733ZM29.6637 6.07299C30.8812 6.07292 32.0552 6.52545 32.9577 7.34266C33.0797 7.45864 33.272 7.45613 33.391 7.33699L34.5457 6.17033C34.6065 6.10913 34.6402 6.02612 34.6393 5.93985C34.6385 5.85359 34.603 5.77127 34.541 5.71133C31.7928 3.15494 27.5369 3.15494 24.7887 5.71133C24.7266 5.77127 24.6912 5.85363 24.6904 5.93992C24.6895 6.02621 24.7234 6.10922 24.7843 6.17033L25.9387 7.33699C26.0577 7.45613 26.2499 7.45864 26.372 7.34266C27.2739 6.52599 28.447 6.0735 29.6637 6.07299ZM31.9767 8.62681C31.9784 8.71332 31.9444 8.79672 31.8827 8.85733L29.8853 10.873C29.8268 10.9322 29.747 10.9656 29.6637 10.9656C29.5804 10.9656 29.5006 10.9322 29.442 10.873L27.4443 8.85733C27.3826 8.79668 27.3487 8.71325 27.3505 8.62674C27.3523 8.54023 27.3898 8.45831 27.454 8.40033C28.7296 7.32144 30.5978 7.32144 31.8733 8.40033C31.9375 8.45836 31.9749 8.54031 31.9767 8.62681Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M16 0.335938H15C14.4477 0.335938 14 0.783653 14 1.33594V10.0026C14 10.5549 14.4477 11.0026 15 11.0026H16C16.5523 11.0026 17 10.5549 17 10.0026V1.33594C17 0.783653 16.5523 0.335938 16 0.335938ZM10.3333 2.66927H11.3333C11.8856 2.66927 12.3333 3.11699 12.3333 3.66927V10.0026C12.3333 10.5549 11.8856 11.0026 11.3333 11.0026H10.3333C9.78105 11.0026 9.33333 10.5549 9.33333 10.0026V3.66927C9.33333 3.11699 9.78105 2.66927 10.3333 2.66927ZM6.66667 5.0026H5.66667C5.11438 5.0026 4.66667 5.45032 4.66667 6.0026V10.0026C4.66667 10.5549 5.11438 11.0026 5.66667 11.0026H6.66667C7.21895 11.0026 7.66667 10.5549 7.66667 10.0026V6.0026C7.66667 5.45032 7.21895 5.0026 6.66667 5.0026ZM2 7.0026H1C0.447715 7.0026 0 7.45032 0 8.0026V10.0026C0 10.5549 0.447715 11.0026 1 11.0026H2C2.55228 11.0026 3 10.5549 3 10.0026V8.0026C3 7.45032 2.55228 7.0026 2 7.0026Z" fill="currentColor"/></g>`);

export class PdsStatusBar extends HTMLElement {
  static get observedAttributes() {
    return ["time", "notch"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._time = this.shadowRoot.querySelector(".time");
  }

  connectedCallback() {
    this.setAttribute("aria-hidden", "true");
    this._sync();
  }

  attributeChangedCallback() { this._sync(); }

  _sync() {
    this._time.textContent = this.time;
  }

  get time() { return this.getAttribute("time") || "9:41"; }
  set time(v) { this.setAttribute("time", v); }

  get notch() { return this.hasAttribute("notch"); }
  set notch(v) { this.toggleAttribute("notch", Boolean(v)); }
}

if (!customElements.get("pds-status-bar")) customElements.define("pds-status-bar", PdsStatusBar);
