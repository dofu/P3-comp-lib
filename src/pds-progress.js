/**
 * `<pds-progress>`: a circular or linear progress indicator.
 *
 * @element pds-progress
 *
 * @attr {'circular'|'linear'} [shape=circular] - Which shape to render.
 * @attr {boolean} [determinate=false] - true requires `value` and
 *   announces it; false (default) loops indefinitely and announces busy
 *   instead. Never combine both.
 * @attr {number} [value=0] - 0-100, clamped. Read only when `determinate`.
 * @attr {'4'|'8'} [thickness=4] - Stroke weight in pixels. Circular: 40px
 *   diameter at 4, 44px at 8. Linear: a 12px track either way, only the
 *   inner bar height changes.
 *
 * @cssprop --pds-transparency-outline-20 - Track colour, both shapes.
 * @cssprop --pds-blue-300 - Active/fill colour, both shapes.
 *
 * Known limitations:
 * - The track colour token currently resolves to the same value in Dark
 *   and Light mode, so the track reads faint on a light background today.
 * - Stepper, segmented-bar, and pull-to-refresh style indicators are
 *   separate components, not covered here.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-block;
    }
    svg {
      display: block;
      transform: rotate(-90deg);
    }
    .track { stroke: var(--pds-transparency-outline-20, #ffffff33); fill: none; }
    .active { stroke: var(--pds-blue-300, #5481de); fill: none; stroke-linecap: round; }
    :host([determinate]) .active {
      transition: stroke-dashoffset 0.2s ease;
    }
    :host(:not([determinate])) svg {
      animation: pds-spin 1s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      :host(:not([determinate])) svg { animation-duration: 3s; }
    }
    @keyframes pds-spin { to { transform: rotate(270deg); } }

    .linear {
      display: none;
      position: relative;
      width: 100%;
      height: 12px;
      border-radius: 999px;
      overflow: hidden;
      background: var(--pds-transparency-outline-20, #ffffff33);
    }
    .linear .bar {
      position: absolute;
      inset: 0;
      background: var(--pds-blue-300, #5481de);
      border-radius: 999px;
      transform-origin: left center;
    }
    :host([shape="linear"]) .linear { display: block; }
    :host([shape="linear"]) svg { display: none; }
    :host([determinate]) .linear .bar { transition: transform 0.2s ease; }
    :host(:not([determinate])) .linear .bar {
      animation: pds-linear-indeterminate 1.4s ease-in-out infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      :host(:not([determinate])) .linear .bar { animation-duration: 3.5s; }
    }
    @keyframes pds-linear-indeterminate {
      0% { transform: translateX(-100%) scaleX(0.4); }
      50% { transform: translateX(20%) scaleX(0.6); }
      100% { transform: translateX(100%) scaleX(0.4); }
    }
  </style>
  <svg part="circular" viewBox="0 0 40 40" width="40" height="40">
    <circle class="track" part="track" cx="20" cy="20" r="18" stroke-width="4" />
    <circle class="active" part="active" cx="20" cy="20" r="18" stroke-width="4" />
  </svg>
  <div class="linear" part="linear">
    <div class="track" part="track" style="position:absolute;inset:0;border-radius:999px;"></div>
    <div class="bar" part="active"></div>
  </div>
`;

const CIRCUMFERENCE = 2 * Math.PI * 18;

export class PdsProgress extends HTMLElement {
  static get observedAttributes() {
    return ["shape", "determinate", "value", "thickness"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._circle = this.shadowRoot.querySelector("circle.active");
    this._bar = this.shadowRoot.querySelector(".linear .bar");
  }

  connectedCallback() {
    this.setAttribute("role", "progressbar");
    if (!this.hasAttribute("shape")) this.setAttribute("shape", "circular");
    if (!this.hasAttribute("thickness")) this.setAttribute("thickness", "4");
    this._syncThickness();
    this._syncValue();
  }

  attributeChangedCallback(name) {
    if (name === "thickness") this._syncThickness();
    if (name === "determinate" || name === "value") this._syncValue();
  }

  _syncThickness() {
    const w = this.thickness === "8" ? 8 : 4;
    const r = 20 - w / 2 - (this.thickness === "8" ? 2 : 0);
    for (const c of this.shadowRoot.querySelectorAll("circle")) {
      c.setAttribute("stroke-width", String(w));
      c.setAttribute("r", String(r));
    }
    const size = this.thickness === "8" ? 44 : 40;
    const svg = this.shadowRoot.querySelector("svg");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    for (const c of this.shadowRoot.querySelectorAll("circle")) {
      c.setAttribute("cx", String(size / 2));
      c.setAttribute("cy", String(size / 2));
    }
  }

  _syncValue() {
    if (this.determinate) {
      this.setAttribute("aria-valuenow", String(this.value));
      this.setAttribute("aria-valuemin", "0");
      this.setAttribute("aria-valuemax", "100");
      this.removeAttribute("aria-busy");
      const circumference = CIRCUMFERENCE;
      const offset = circumference * (1 - this.value / 100);
      this._circle.style.strokeDasharray = String(circumference);
      this._circle.style.strokeDashoffset = String(offset);
      this._bar.style.transform = `scaleX(${this.value / 100})`;
    } else {
      this.removeAttribute("aria-valuenow");
      this.removeAttribute("aria-valuemin");
      this.removeAttribute("aria-valuemax");
      this.setAttribute("aria-busy", "true");
      this._circle.style.strokeDasharray = String(CIRCUMFERENCE);
      this._circle.style.strokeDashoffset = String(CIRCUMFERENCE * 0.25);
      this._bar.style.transform = "";
    }
  }

  get shape() { return this.getAttribute("shape") || "circular"; }
  set shape(v) { this.setAttribute("shape", v); }

  get determinate() { return this.hasAttribute("determinate"); }
  set determinate(v) { this.toggleAttribute("determinate", Boolean(v)); }

  get value() { return Math.max(0, Math.min(100, Number(this.getAttribute("value") || 0))); }
  set value(v) { this.setAttribute("value", String(v)); }

  get thickness() { return this.getAttribute("thickness") || "4"; }
  set thickness(v) { this.setAttribute("thickness", v); }
}

customElements.define("pds-progress", PdsProgress);
