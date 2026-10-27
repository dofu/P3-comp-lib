/**
 * `<pds-checkbox>`: an independent, multi-select choice.
 *
 * Use a checkbox when selections are independent and more than one can be
 * true at once, or when a choice only takes effect once the user submits
 * a form. Use `pds-switch` instead for a setting that takes effect
 * immediately.
 *
 * @element pds-checkbox
 *
 * @attr {boolean} [checked=false] - Checked state.
 * @attr {boolean} [indeterminate=false] - Indeterminate state; renders
 *   over `checked` when both are set.
 * @attr {boolean} [disabled=false] - Disabled state.
 * @attr {string} [name] - Forwarded to the internal input.
 * @attr {string} [value=on] - Forwarded to the internal input's value.
 *
 * @slot - The label text, inside the same tap target as the checkbox.
 *
 * @fires change - Re-dispatched from the internal input's native change.
 *
 * @cssprop --pds-transparency-outline-50 - Border colour, unchecked/indeterminate.
 * @cssprop --pds-orange-500 - Fill colour, checked.
 * @cssprop --pds-white - Checkmark colour.
 * @cssprop --pds-on-surface-1 - Indeterminate dash colour and label colour.
 * @cssprop --pds-transparent-white-8 - Hover/Pressed wash.
 *
 * Known limitations:
 * - No form participation via ElementInternals yet; read `.checked` /
 *   `.indeterminate` directly rather than relying on a parent form's FormData.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      font-family: Roboto, system-ui, sans-serif;
    }
    label {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    :host([disabled]) label {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .control {
      position: relative;
      width: 40px;
      height: 40px;
      flex: none;
    }
    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }
    .wash {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: transparent;
      pointer-events: none;
    }
    .box {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--pds-transparency-outline-50, #ffffff80);
      box-sizing: border-box;
      background: transparent;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mark {
      width: 14px;
      height: 14px;
      display: none;
    }
    .mark svg { display: block; width: 100%; height: 100%; }
    input:checked ~ .box,
    :host([indeterminate]) .box {
      background: var(--pds-orange-500, #f78f20);
      border-color: transparent;
    }
    input:checked ~ .box .mark.check { display: block; }
    :host([indeterminate]) .box .mark.dash { display: block; }
    :host([indeterminate]) .box .mark.check { display: none; }
    input:hover ~ .wash,
    input:focus-visible ~ .wash {
      background: var(--pds-transparent-white-8, rgba(255, 255, 255, 0.08));
    }
    input:focus-visible ~ .box {
      outline: 2px solid var(--pds-orange-500, #f78f20);
      outline-offset: 2px;
    }
    .text {
      font-size: 16px;
      letter-spacing: 0.5px;
      line-height: 24px;
      color: var(--pds-on-surface-1, #141414);
    }
  </style>
  <label part="label">
    <span class="control" part="control">
      <input type="checkbox" />
      <span class="wash" part="wash"></span>
      <span class="box" part="box">
        <span class="mark check" part="check">
          <svg viewBox="0 0 16 16" fill="none"><path d="M2 8.5L6 12.5L14 3.5" stroke="var(--pds-white, #ffffff)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span class="mark dash" part="dash">
          <svg viewBox="0 0 16 16" fill="none"><path d="M3 8H13" stroke="var(--pds-white, #ffffff)" stroke-width="2" stroke-linecap="round"/></svg>
        </span>
      </span>
    </span>
    <span class="text" part="text"><slot></slot></span>
  </label>
`;

export class PdsCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ["checked", "indeterminate", "disabled", "name", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector("input");
    this._onChange = this._onChange.bind(this);
  }

  connectedCallback() {
    this._input.addEventListener("change", this._onChange);
    this._sync();
  }

  disconnectedCallback() {
    this._input.removeEventListener("change", this._onChange);
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    this._input.checked = this.checked;
    this._input.indeterminate = this.indeterminate;
    this._input.disabled = this.disabled;
    this._input.name = this.name || "";
    this._input.value = this.value;
  }

  _onChange() {
    this.checked = this._input.checked;
    this.indeterminate = false;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  get checked() { return this.hasAttribute("checked"); }
  set checked(v) { this.toggleAttribute("checked", Boolean(v)); }

  get indeterminate() { return this.hasAttribute("indeterminate"); }
  set indeterminate(v) { this.toggleAttribute("indeterminate", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get name() { return this.getAttribute("name") || ""; }
  set name(v) { this.setAttribute("name", v); }

  get value() { return this.getAttribute("value") || "on"; }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("pds-checkbox", PdsCheckbox);
