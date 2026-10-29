/**
 * `<pds-button>`: a button for the one action a screen wants the user to take.
 *
 * @element pds-button
 *
 * @attr {'small'|'medium'|'large'} [size=medium] - Which size to render.
 *   Height is a minimum, not a cap: the button always grows to fit its
 *   content.
 * @attr {'primary'|'secondary'} [variant=primary] - primary = filled;
 *   secondary = outlined.
 * @attr {'positive'|'negative'} [tone] - Buy or price-up actions take `positive`
 *   (green); Sell or price-down actions take `negative` (red). Applies to both
 *   variants.
 * @attr {boolean} [disabled=false] - Disabled state.
 * @attr {boolean} [pending=false] - Shows an inline spinner, keeps the
 *   label, and disables the button so a second tap cannot fire while a
 *   request is in flight. Set it back to false yourself once the request
 *   finishes or fails.
 * @attr {string} [reserve] - Comma-separated alternate labels this button can
 *   show, for example `reserve="Following"` on a Follow button. The button
 *   takes the width of its widest label, so toggling the label never changes
 *   the width and a column of such buttons lines up. Give the labels in the
 *   same language and casing as the slotted label.
 * @attr {boolean} [block=false] - Fill the container's width: for the single
 *   screen-level action and for stacked actions that share one width. Width
 *   is otherwise the label plus padding; never set a pixel width on a button.
 *
 * @slot - The button's label text. Casing is applied by the component
 *   (Small keeps whatever case you type; Medium and Large uppercase it),
 *   so type the label in normal sentence case and let the size decide.
 * @slot icon - Optional leading icon (an inline SVG or `<img>`). Hidden
 *   automatically while `pending`.
 *
 * @fires click - Native click event; suppressed while `disabled` or `pending`.
 *
 * @cssprop --pds-container-primary-1 - Fill for the primary variant.
 * @cssprop --pds-grey-600 - Label colour for the primary variant.
 * @cssprop --pds-orange-500 - Border and label colour for the secondary variant.
 * @cssprop --pds-container-disabled - Fill for the disabled state (visible in both themes).
 * @cssprop --pds-grey-300 - Label colour for the disabled state.
 *
 * Known limitations:
 * - Hover, Pressed and Focus colours are not finalised yet; the
 *   `:hover`/`:active`/`:focus-visible` styles below are a placeholder.
 * - `size="small"` is 40px tall, short of the usual 48px touch-target
 *   guideline. No hit-slop is applied yet.
 * - A ghost/text-only variant is planned but not implemented.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-block;
      font-family: Roboto, system-ui, sans-serif;
      --_radius: 999px;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border-radius: var(--_radius);
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      white-space: nowrap;
    }
    button:focus-visible {
      outline: 2px solid var(--pds-container-primary-1, #f78f20);
      outline-offset: 2px;
    }
    button:disabled {
      cursor: not-allowed;
    }
    :host([block]) {
      display: block;
    }
    :host([block]) button {
      width: 100%;
    }
    .label {
      display: inline-grid;
      justify-items: center;
      align-items: center;
    }
    .label > slot {
      display: block;
      grid-area: 1 / 1;
    }
    .label > .ghost {
      grid-area: 1 / 1;
      visibility: hidden;
      white-space: nowrap;
    }

    :host([size="small"]) button {
      min-height: 40px;
      padding: 12px 16px;
      font-size: var(--pds-type-label-medium-size, 12px);
      letter-spacing: var(--pds-type-label-medium-tracking, 0.5px);
      text-transform: none;
    }
    :host([size="medium"]) button,
    :host(:not([size])) button {
      min-height: 44px;
      padding: 12px 24px;
      font-size: var(--pds-type-label-large-size, 14px);
      letter-spacing: var(--pds-type-label-large-tracking, 0.1px);
      text-transform: uppercase;
    }
    :host([size="large"]) button {
      min-height: 92px;
      padding: 12px 48px;
      font-size: var(--pds-type-headline-medium-size, 28px);
      letter-spacing: 0.1px;
      text-transform: uppercase;
    }

    :host([variant="secondary"]) button {
      background: transparent;
      color: var(--pds-orange-500, #f78f20);
      border: 1px solid var(--pds-orange-500, #f78f20);
    }
    :host(:not([variant="secondary"])) button {
      background: var(--pds-container-primary-1, #f78f20);
      color: var(--pds-grey-600, #141414);
      border: 1px solid transparent; /* same geometry as secondary, so a filled Follow and an outlined Following line up */
    }

    :host([tone="positive"]:not([variant="secondary"])) button { background: var(--pds-container-positive, #008b57); color: var(--pds-on-container-positive, #ffffff); }
    :host([tone="negative"]:not([variant="secondary"])) button { background: var(--pds-container-negative, #ca2323); color: var(--pds-on-container-negative, #ffffff); }
    :host([tone="positive"][variant="secondary"]) button { border-color: var(--pds-container-positive, #008b57); color: var(--pds-container-positive, #008b57); }
    :host([tone="negative"][variant="secondary"]) button { border-color: var(--pds-container-negative, #ca2323); color: var(--pds-container-negative, #ca2323); }
    :host([disabled]) button {
      background: var(--pds-container-disabled, rgba(20, 20, 20, 0.12));
      color: var(--pds-grey-300, #747474);
      border: 1px solid transparent;
    }

    ::slotted([slot="icon"]) {
      width: 1em;
      height: 1em;
      display: inline-flex;
    }

    .spinner {
      width: 1em;
      height: 1em;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      animation: pds-spin 0.8s linear infinite;
      display: none;
    }
    :host([pending]) .spinner {
      display: inline-block;
    }
    :host([pending]) ::slotted([slot="icon"]) {
      display: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 2.4s;
      }
    }
    @keyframes pds-spin {
      to { transform: rotate(360deg); }
    }
  </style>
  <button type="button" part="button">
    <span class="spinner" aria-hidden="true"></span>
    <slot name="icon"></slot>
    <span class="label" part="label"><slot></slot></span>
  </button>
`;

export class PdsButton extends HTMLElement {
  static get observedAttributes() {
    return ["size", "variant", "disabled", "pending", "reserve"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._button = this.shadowRoot.querySelector("button");
    this._label = this.shadowRoot.querySelector(".label");
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("size")) this.setAttribute("size", "medium");
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "primary");
    this.addEventListener("click", this._onClick, true);
    this._syncDisabled();
    this._syncReserve();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick, true);
  }

  attributeChangedCallback(name) {
    if (name === "disabled" || name === "pending") this._syncDisabled();
    if (name === "reserve") this._syncReserve();
  }

  /** Ghost copies of the reserved labels sit under the real one, hidden, so the
   *  button is as wide as the widest label it can show. */
  _syncReserve() {
    for (const ghost of this._label.querySelectorAll(".ghost")) ghost.remove();
    const labels = (this.getAttribute("reserve") || "").split(",").map(s => s.trim()).filter(Boolean);
    for (const text of labels) {
      const ghost = document.createElement("span");
      ghost.className = "ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = text;
      this._label.appendChild(ghost);
    }
  }

  _syncDisabled() {
    const isDisabled = this.disabled || this.pending;
    this._button.disabled = isDisabled;
    this._button.setAttribute("aria-busy", String(this.pending));
  }

  _onClick(event) {
    if (this.disabled || this.pending) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  /** @type {'small'|'medium'|'large'} */
  get size() { return this.getAttribute("size") || "medium"; }
  set size(v) { this.setAttribute("size", v); }

  /** @type {'primary'|'secondary'} */
  get variant() { return this.getAttribute("variant") || "primary"; }
  set variant(v) { this.setAttribute("variant", v); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get tone() { return this.getAttribute("tone"); }
  set tone(v) { if (v) this.setAttribute("tone", v); else this.removeAttribute("tone"); }

  get pending() { return this.hasAttribute("pending"); }
  set pending(v) { this.toggleAttribute("pending", Boolean(v)); }

  /** Comma-separated alternate labels; the button reserves the widest. */
  get reserve() { return this.getAttribute("reserve") || ""; }
  set reserve(v) { if (v) this.setAttribute("reserve", v); else this.removeAttribute("reserve"); }

  get block() { return this.hasAttribute("block"); }
  set block(v) { this.toggleAttribute("block", Boolean(v)); }
}

customElements.define("pds-button", PdsButton);
