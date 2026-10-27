/**
 * `<pds-radio>`: exactly one selection from a named group.
 *
 * Native radio grouping via a shared `name` does not cross a Shadow DOM
 * boundary, so this component manages mutual exclusion itself in
 * JavaScript rather than relying on the browser.
 *
 * @element pds-radio
 *
 * @attr {boolean} [checked=false] - Whether this radio is selected.
 * @attr {boolean} [disabled=false] - Disabled state.
 * @attr {string} [name] - Groups every `pds-radio` sharing this exact
 *   value into one mutually exclusive set.
 * @attr {string} [value] - Forwarded to the internal input's value.
 *
 * @slot - The radio's label text. Casing is left exactly as typed.
 *
 * @fires change - Fired when the user checks this radio (click, Space, or
 *   Arrow-key navigation from a sibling in the same group).
 *
 * @cssprop --pds-orange-500 - Ring, dot and hover/press wash colour when checked.
 * @cssprop --pds-grey-300 - Ring, dot and hover/press wash colour when unchecked.
 * @cssprop --pds-on-surface-1 - Label text colour.
 *
 * Known limitations:
 * - Disabled currently looks identical to Enabled; only interactivity is removed.
 * - The 40x40px control is short of the usual 48px touch-target guideline.
 * - No Focus colour is finalised yet; the focus ring is a placeholder.
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
    .ring {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid var(--pds-grey-300, #747474);
      box-sizing: border-box;
      pointer-events: none;
    }
    .dot {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--pds-orange-500, #f78f20);
      opacity: 0;
      pointer-events: none;
    }
    input:checked ~ .ring {
      border-color: var(--pds-orange-500, #f78f20);
    }
    input:checked ~ .dot {
      opacity: 1;
    }
    input:hover ~ .wash {
      background: color-mix(in srgb, var(--pds-grey-300, #747474) 15%, transparent);
    }
    input:checked:hover ~ .wash {
      background: color-mix(in srgb, var(--pds-orange-500, #f78f20) 15%, transparent);
    }
    input:active ~ .wash {
      background: color-mix(in srgb, var(--pds-grey-300, #747474) 30%, transparent);
    }
    input:checked:active ~ .wash {
      background: color-mix(in srgb, var(--pds-orange-500, #f78f20) 30%, transparent);
    }
    input:focus-visible ~ .ring {
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
      <input type="radio" />
      <span class="wash" part="wash"></span>
      <span class="ring" part="ring"></span>
      <span class="dot" part="dot"></span>
    </span>
    <span class="text" part="text"><slot></slot></span>
  </label>
`;

export class PdsRadio extends HTMLElement {
  static get observedAttributes() {
    return ["checked", "disabled", "name", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._input = this.shadowRoot.querySelector("input");
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
  }

  connectedCallback() {
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    this._input.tabIndex = -1;
    this.tabIndex = this.checked ? 0 : -1;
    this._sync();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    this._input.checked = this.checked;
    this._input.disabled = this.disabled;
    this._input.value = this.value || "";
  }

  _group() {
    const root = this.getRootNode();
    return Array.from(root.querySelectorAll(`pds-radio[name="${this.name}"]`));
  }

  _select() {
    if (this.disabled) return;
    for (const other of this._group()) {
      if (other !== this) other.checked = false;
      other.tabIndex = other === this ? 0 : -1;
    }
    this.checked = true;
    this.focus();
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  _onClick(event) {
    event.preventDefault();
    this._select();
  }

  _onKeydown(event) {
    const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
    if (event.key === " ") {
      event.preventDefault();
      this._select();
      return;
    }
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const group = this._group();
    const i = group.indexOf(this);
    const dir = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
    const next = group[(i + dir + group.length) % group.length];
    if (next) next._select();
  }

  get checked() { return this.hasAttribute("checked"); }
  set checked(v) { this.toggleAttribute("checked", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get name() { return this.getAttribute("name") || ""; }
  set name(v) { this.setAttribute("name", v); }

  get value() { return this.getAttribute("value") || ""; }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("pds-radio", PdsRadio);
