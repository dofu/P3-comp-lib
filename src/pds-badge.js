/**
 * `<pds-badge>`: a small status indicator, a dot or a count.
 *
 * @element pds-badge
 *
 * @attr {number} [count] - Omit for the presence dot (6x6px, no label).
 *   Set a number for the count pill.
 * @attr {number} [max=99] - Cap for the count pill. Pass `max="999"` if a
 *   larger cap fits your use case better.
 *
 * @cssprop --pds-red-100 - Fill for both sizes.
 * @cssprop --pds-white - Label colour on the count pill.
 *
 * Behaviour:
 * - Non-interactive: the badge never receives pointer or keyboard focus.
 * - A dot never announces a number; it announces "new content" to assistive
 *   technology. A count pill announces the number, or "`{max}`+" once capped.
 * - This component does not include placement offsets (e.g. sitting on the
 *   corner of an icon or tab); position it with the host element's own CSS.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      pointer-events: none;
      font-family: Roboto, system-ui, sans-serif;
    }
    /* The native [hidden] attribute is UA-origin, and it loses to any
       author-origin "display" declaration on the same element regardless
       of specificity, which is exactly what .dot/.pill declare below.
       Re-assert it with !important so hiding actually works. */
    [hidden] {
      display: none !important;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 999px;
      background: var(--pds-red-100, #e96e6e);
    }
    .pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--pds-red-100, #e96e6e);
      color: var(--pds-white, #ffffff);
      font-size: 11px;
      font-weight: 500;
      line-height: 1;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  </style>
  <span class="dot" part="dot"></span>
  <span class="pill" part="pill" hidden></span>
  <span class="visually-hidden"></span>
`;

export class PdsBadge extends HTMLElement {
  static get observedAttributes() {
    return ["count", "max"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._dot = this.shadowRoot.querySelector(".dot");
    this._pill = this.shadowRoot.querySelector(".pill");
    this._sr = this.shadowRoot.querySelector(".visually-hidden");
  }

  connectedCallback() {
    this.setAttribute("role", "status");
    this._render();
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const hasCount = this.hasAttribute("count");
    this._dot.hidden = hasCount;
    this._pill.hidden = !hasCount;
    if (!hasCount) {
      this._sr.textContent = "New content";
      return;
    }
    const max = Number(this.getAttribute("max") ?? 99);
    const count = Number(this.getAttribute("count"));
    const label = Number.isFinite(count) && count > max ? `${max}+` : String(count);
    this._pill.textContent = label;
    this._sr.textContent = `${label} new`;
  }

  /** @type {number|null} */
  get count() {
    return this.hasAttribute("count") ? Number(this.getAttribute("count")) : null;
  }
  set count(v) {
    if (v === null || v === undefined) this.removeAttribute("count");
    else this.setAttribute("count", String(v));
  }

  get max() { return Number(this.getAttribute("max") ?? 99); }
  set max(v) { this.setAttribute("max", String(v)); }
}

customElements.define("pds-badge", PdsBadge);
