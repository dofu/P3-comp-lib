/**
 * `<pds-chip>`: a compact, tappable input, filter, or choice element.
 *
 * @element pds-chip
 *
 * @attr {boolean} [selected=false] - Shows a check icon in place of any
 *   leading icon and switches to the filled colour recipe.
 * @attr {'positive'|'negative'} [tone] - Colour of the selected state: green for Buy
 *   or price up, red for Sell or price down. Use for Buy/Sell choices.
 * @attr {boolean} [dismissible=false] - Shows a trailing dismiss button
 *   and fires `dismiss` when activated.
 * @attr {boolean} [disabled=false] - Disabled state.
 *
 * @slot - The chip's label text.
 * @slot icon - Optional leading icon (inline SVG or `<img>`). Hidden
 *   automatically while `selected`.
 *
 * @fires click - Native click; suppressed while `disabled`.
 * @fires dismiss - Fired when the dismiss button is activated; detail:
 *   `{ label }`. Not fired while disabled.
 *
 * @cssprop --pds-transparency-outline-20 - Border colour, unselected and disabled.
 * @cssprop --pds-orange-500 - Fill colour, selected.
 * @cssprop --pds-on-surface-1 - Label/icon colour, unselected enabled.
 * @cssprop --pds-grey-600 - Label/icon colour, selected.
 * @cssprop --pds-grey-300 - Label/icon colour, disabled.
 *
 * Known limitations:
 * - This border colour token currently resolves to the same value in Dark
 *   and Light mode, so the outline reads faint on a light background today.
 * - Hover and Pressed colours are not finalised yet.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      font-family: Roboto, system-ui, sans-serif;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      min-height: 32px;
      border-radius: 8px;
      border: 1px solid var(--pds-transparency-outline-20, #ffffff33);
      background: transparent;
      box-sizing: border-box;
      gap: 8px;
      padding: 0 16px;
    }
    :host([selected]) .chip {
      background: var(--pds-orange-500, #f78f20);
      border-color: transparent;
    }
    :host([disabled]) .chip {
      color: var(--pds-grey-300, #747474);
      cursor: not-allowed;
    }
    .body {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: var(--pds-type-body-medium-size, 14px);
      letter-spacing: var(--pds-type-body-medium-tracking, 0.25px);
      line-height: var(--pds-type-body-medium-line, 20px);
      white-space: nowrap; /* a chip grows with its label; the row scrolls */
      color: var(--pds-on-surface-1, #141414);
    }
    :host([selected]) .body { color: var(--pds-grey-600, #141414); }
    :host([selected][tone="positive"]) .chip { background: var(--pds-container-positive, #008b57); border-color: transparent; }
    :host([selected][tone="negative"]) .chip { background: var(--pds-container-negative, #ca2323); border-color: transparent; }
    :host([selected][tone="positive"]) .body, :host([selected][tone="positive"]) .check { color: var(--pds-on-container-positive, #ffffff); }
    :host([selected][tone="negative"]) .body, :host([selected][tone="negative"]) .check { color: var(--pds-on-container-negative, #ffffff); }
    :host([disabled]) .body { color: var(--pds-grey-300, #747474); cursor: not-allowed; }
    .body:focus-visible {
      outline: 2px solid var(--pds-orange-500, #f78f20);
      outline-offset: 2px;
    }
    ::slotted([slot="icon"]) {
      width: 18px;
      height: 18px;
      display: inline-flex;
    }
    :host([selected]) ::slotted([slot="icon"]) { display: none; }
    .check {
      width: 18px;
      height: 18px;
      display: none;
    }
    :host([selected]) .check { display: inline-flex; }
    .dismiss {
      all: unset;
      display: none;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin-left: 4px;
    }
    :host([dismissible]) .dismiss { display: inline-flex; }
    :host([disabled]) .dismiss { cursor: not-allowed; }
    .dismiss:focus-visible {
      outline: 2px solid var(--pds-orange-500, #f78f20);
      outline-offset: 2px;
    }
  </style>
  <span class="chip" part="chip">
    <button type="button" class="body" part="body">
      <span class="check" part="check-icon" aria-hidden="true">
        <svg viewBox="0 0 18 18" fill="none"><path d="M3 9L7 13L15 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
      <slot name="icon" part="leading-icon"></slot>
      <slot></slot>
    </button>
    <button type="button" class="dismiss" part="dismiss-button" aria-label="Remove">
      <svg viewBox="0 0 18 18" fill="none" part="dismiss-icon"><path d="M4 4L14 14M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </button>
  </span>
`;

export class PdsChip extends HTMLElement {
  static get observedAttributes() {
    return ["selected", "dismissible", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._body = this.shadowRoot.querySelector(".body");
    this._dismissBtn = this.shadowRoot.querySelector(".dismiss");
    this._onBodyClick = this._onBodyClick.bind(this);
    this._onDismissClick = this._onDismissClick.bind(this);
  }

  connectedCallback() {
    this._body.addEventListener("click", this._onBodyClick);
    this._dismissBtn.addEventListener("click", this._onDismissClick);
    this._sync();
  }

  disconnectedCallback() {
    this._body.removeEventListener("click", this._onBodyClick);
    this._dismissBtn.removeEventListener("click", this._onDismissClick);
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    this._body.disabled = this.disabled;
    this._dismissBtn.disabled = this.disabled;
  }

  _onBodyClick(event) {
    if (this.disabled) { event.stopImmediatePropagation(); event.preventDefault(); }
  }

  _onDismissClick(event) {
    event.stopPropagation();
    if (this.disabled) return;
    this.dispatchEvent(new CustomEvent("dismiss", {
      bubbles: true, composed: true, detail: { label: this.textContent.trim() },
    }));
  }

  get selected() { return this.hasAttribute("selected"); }
  set selected(v) { this.toggleAttribute("selected", Boolean(v)); }

  get dismissible() { return this.hasAttribute("dismissible"); }
  set dismissible(v) { this.toggleAttribute("dismissible", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }
}

customElements.define("pds-chip", PdsChip);
