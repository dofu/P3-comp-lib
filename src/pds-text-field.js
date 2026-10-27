/**
 * `<pds-text-field>`: a labelled text input, wrapping a native input/textarea.
 *
 * @element pds-text-field
 *
 * @attr {string} [label] - Visible caption, programmatically associated
 *   with the input via a real `<label for>`.
 * @attr {'start'} [label-position] - `start` puts the label to the left of the
 *   field on one row (the trade ticket layout). Default: label above.
 * @attr {string} [value] - Current text; reflects the live control on
 *   every input event.
 * @attr {string} [placeholder] - Forwarded to the internal control.
 * @attr {string} [error] - An error message. Replaces `supporting-text`
 *   when set; the two never show together.
 * @attr {string} [supporting-text] - Helper text below the field. Hidden
 *   whenever `error` is set.
 * @attr {boolean} [disabled=false] - Disabled state.
 * @attr {'text'|'password'|'tel'} [type=text] - Forwarded to the internal
 *   input. Ignored while `multiline` is set.
 * @attr {boolean} [multiline=false] - Renders a real `<textarea>` instead
 *   of `<input>`.
 * @attr {string} [name] - Forwarded to the internal control.
 *
 * @slot leading-icon - Optional leading icon/adornment.
 * @slot trailing-icon - Optional trailing icon/adornment.
 *
 * @fires input - Native input event, already composed.
 * @fires change - Re-dispatched since the internal control's own change
 *   does not cross the shadow boundary.
 *
 * @cssprop --pds-on-surface-1 - Label colour, typed-value colour, and
 *   default supporting-text colour.
 * @cssprop --pds-on-surface-2 - Label colour when disabled.
 * @cssprop --pds-transparency-outline-20 - Border colour at rest, and
 *   both fill and border when disabled.
 * @cssprop --pds-on-surface-text-negative - Border and text colour when
 *   `error` is set.
 * @cssprop --pds-grey-300 - Placeholder colour, and the disabled state's
 *   displayed-text colour.
 * @cssprop --pds-outline-focus - Border colour while the field has focus (blue-500).
 * @cssprop --pds-on-container-caret - Text cursor (caret) colour: blue-500 in
 *   Light, blue-200 in Dark (Figma "On Container/Caret").
 *
 * Known limitations:
 * - Only a single generic trailing-icon slot; no built-in password
 *   show/hide toggle.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
    }
    .label {
      display: block;
      font-size: 12px;
      letter-spacing: 0.4px;
      line-height: 16px;
      color: var(--pds-on-surface-1, #141414);
      margin-bottom: 4px;
    }
    :host([disabled]) .label { color: var(--pds-on-surface-2, #595959); }
    .container {
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 56px;
      border-radius: 8px;
      border: 1px solid var(--pds-transparency-outline-20, #ffffff33);
      padding: 8px 16px;
      box-sizing: border-box;
    }
    :host(:focus-within) .container { border-color: var(--pds-outline-focus, #0043ce); }
    :host([error]) .container { border-color: var(--pds-on-surface-text-negative, #ca2323); }
    :host([disabled]) .container {
      border-color: var(--pds-transparency-outline-20, #ffffff33);
      background: var(--pds-transparency-outline-20, #ffffff33);
    }
    ::slotted([slot="leading-icon"]) { width: 40px; height: 40px; flex: none; }
    ::slotted([slot="trailing-icon"]) { width: 24px; height: 24px; flex: none; }
    input, textarea {
      all: unset;
      flex: 1;
      min-width: 0;
      font-size: 16px;
      letter-spacing: 0.5px;
      line-height: 24px;
      color: var(--pds-on-surface-1, #141414);
      white-space: nowrap;
      overflow-x: auto;
      caret-color: var(--pds-on-container-caret, #0043ce);
    }
    textarea { white-space: normal; resize: vertical; }
    input::placeholder, textarea::placeholder { color: var(--pds-grey-300, #747474); }
    :host([disabled]) input, :host([disabled]) textarea { color: var(--pds-grey-300, #747474); }
    .supporting {
      margin-top: 4px;
      font-size: 12px;
      line-height: 16px;
      color: var(--pds-on-surface-1, #141414);
    }
    :host([error]) .supporting { color: var(--pds-on-surface-text-negative, #ca2323); }
    .supporting:empty { display: none; }
    :host([label-position="start"]) { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); column-gap: 12px; align-items: center; }
    :host([label-position="start"]) .label { margin: 0; padding-right: 4px; }
    :host([label-position="start"]) .supporting { grid-column: 2; }
  </style>
  <label class="label" part="label"></label>
  <div class="container" part="container">
    <slot name="leading-icon" part="leading-icon"></slot>
    <input part="input" />
    <slot name="trailing-icon" part="trailing-icon"></slot>
  </div>
  <div class="supporting" part="supporting"></div>
`;

const STEPS = [16, 14, 12];

export class PdsTextField extends HTMLElement {
  static get observedAttributes() {
    return ["label", "value", "placeholder", "error", "supporting-text", "disabled", "type", "multiline", "name"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._labelEl = this.shadowRoot.querySelector(".label");
    this._container = this.shadowRoot.querySelector(".container");
    this._control = this.shadowRoot.querySelector("input");
    this._supportingEl = this.shadowRoot.querySelector(".supporting");
    this._id = `pds-text-field-${Math.random().toString(36).slice(2, 9)}`;
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  connectedCallback() {
    this._control.id = this._id;
    this._labelEl.htmlFor = this._id;
    this._control.addEventListener("input", this._onInput);
    this._control.addEventListener("change", this._onChange);
    this._sync();
  }

  disconnectedCallback() {
    this._control.removeEventListener("input", this._onInput);
    this._control.removeEventListener("change", this._onChange);
  }

  attributeChangedCallback(name) {
    if (name === "multiline") { this._rebuildControl(); return; }
    this._sync();
  }

  _rebuildControl() {
    const tag = this.multiline ? "textarea" : "input";
    if (this._control.tagName.toLowerCase() === tag) return;
    const next = document.createElement(tag);
    next.id = this._id;
    next.setAttribute("part", "input");
    if (tag === "input") next.className = "";
    this._control.replaceWith(next);
    this._control.removeEventListener("input", this._onInput);
    this._control.removeEventListener("change", this._onChange);
    this._control = next;
    this._control.addEventListener("input", this._onInput);
    this._control.addEventListener("change", this._onChange);
    this._sync();
  }

  _sync() {
    this._labelEl.textContent = this.getAttribute("label") || "";
    this._control.placeholder = this.getAttribute("placeholder") || "";
    this._control.disabled = this.disabled;
    this._control.name = this.getAttribute("name") || "";
    if (!this.multiline) this._control.type = this.type;
    if (this.hasAttribute("value")) this._control.value = this.getAttribute("value");
    const error = this.getAttribute("error");
    this._supportingEl.textContent = error || this.getAttribute("supporting-text") || "";
    this._applyLadder();
  }

  _applyLadder() {
    if (this.multiline) return;
    this._control.style.fontSize = "";
    for (const size of STEPS) {
      if (this._control.scrollWidth <= this._control.clientWidth || size === STEPS[STEPS.length - 1]) {
        this._control.style.fontSize = `${size}px`;
        if (this._control.scrollWidth <= this._control.clientWidth) break;
      }
    }
  }

  _onInput() {
    this.setAttribute("value", this._control.value);
    this._applyLadder();
  }

  _onChange() {
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  get value() { return this._control.value; }
  set value(v) { this.setAttribute("value", v); }

  get error() { return this.getAttribute("error"); }
  set error(v) { if (v === null) this.removeAttribute("error"); else this.setAttribute("error", v); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get type() { return this.getAttribute("type") || "text"; }
  set type(v) { this.setAttribute("type", v); }

  get multiline() { return this.hasAttribute("multiline"); }
  set multiline(v) { this.toggleAttribute("multiline", Boolean(v)); }
}

customElements.define("pds-text-field", PdsTextField);
