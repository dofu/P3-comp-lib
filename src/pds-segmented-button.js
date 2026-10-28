import "./pds-segment.js";

/**
 * `<pds-segmented-button>`: one choice from two to four options, all visible,
 * one always selected. Buy / Short sell / Sell, Cash / CPF / SRS, Day / GTD.
 *
 * This is the single-choice control. Chips are for several choices at once
 * and never deselect each other; a switch is for a setting that applies at
 * once. The chosen segment is filled; the others are outlined. No check
 * icon: the fill carries the state.
 *
 * @element pds-segmented-button
 *
 * @attr {string} [value] - The value of the chosen segment. Set it to choose
 *   from script; it updates when the user taps or uses the arrow keys.
 * @attr {boolean} [full=false] - Stretch to the width of the container (a
 *   trade ticket's Buy / Short sell / Sell row). Otherwise the control hugs
 *   its segments.
 * @attr {boolean} [disabled=false] - Disables every segment.
 *
 * @slot - Two to four `<pds-segment>` elements, each with a `value`.
 *
 * @fires change - detail: `{ value }`. Fired when the user changes the
 *   choice, not when `value` is set from script.
 *
 * Known limitations:
 * - Segments are label only; no icon configuration yet.
 * - Multi-select segmented buttons are not implemented; use chips.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: stretch;
      box-sizing: border-box;
      max-width: 100%;
      min-height: 48px; /* 40 px control inside a 48 px touch row, as in Figma */
      padding: 4px 0;
      vertical-align: middle;
    }
    :host([full]) { display: flex; width: 100%; }
    :host([hidden]) { display: none; }
  </style>
  <slot></slot>
`;

export class PdsSegmentedButton extends HTMLElement {
  static get observedAttributes() { return ["value", "disabled"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
    this._onSlotChange = () => this._sync();
  }

  connectedCallback() {
    this.setAttribute("role", "radiogroup");
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    this.shadowRoot.querySelector("slot").addEventListener("slotchange", this._onSlotChange);
    this._sync();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
  }

  attributeChangedCallback() { this._sync(); }

  _segments() { return Array.from(this.children).filter((c) => c.tagName === "PDS-SEGMENT"); }

  _sync() {
    const segments = this._segments();
    if (!segments.length) return;
    // No value yet: adopt the segment marked selected in the HTML, else the first.
    if (!this.hasAttribute("value")) {
      const marked = segments.find((s) => s.selected) || segments[0];
      this.setAttribute("value", marked.value);
      return; // attributeChangedCallback re-enters with the value set
    }
    for (const s of segments) {
      s.selected = s.value === this.value;
      if (this.disabled) s.disabled = true;
    }
  }

  _choose(segment) {
    if (!segment || segment.disabled || this.disabled || segment.value === this.value) return;
    this.value = segment.value;
    this.dispatchEvent(new CustomEvent("change", { bubbles: true, composed: true, detail: { value: this.value } }));
  }

  _onClick(e) {
    this._choose(e.target.closest("pds-segment"));
  }

  _onKeydown(e) {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys) && e.key !== "Home" && e.key !== "End") return;
    const segments = this._segments().filter((s) => !s.disabled);
    if (!segments.length) return;
    const current = segments.findIndex((s) => s.selected);
    let next;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = segments.length - 1;
    else next = (current + keys[e.key] + segments.length) % segments.length;
    e.preventDefault();
    this._choose(segments[next]);
    segments[next].focus();
  }

  get value() { return this.getAttribute("value") ?? ""; }
  set value(v) { this.setAttribute("value", v); }
  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }
  get full() { return this.hasAttribute("full"); }
  set full(v) { this.toggleAttribute("full", Boolean(v)); }
}

customElements.define("pds-segmented-button", PdsSegmentedButton);
