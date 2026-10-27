/**
 * `<pds-switch>`: an on/off toggle whose effect is immediate.
 *
 * Use this rather than a checkbox when the setting takes effect right
 * away, with no separate save step. Use a checkbox instead when the
 * choice only takes effect on a later submit.
 *
 * @element pds-switch
 *
 * @attr {boolean} [checked=false] - The on/off state. Wraps a native
 *   `<input type="checkbox" role="switch">`.
 * @attr {boolean} [disabled=false] - Disabled state (a flat opacity dim,
 *   not a colour swap).
 * @attr {string} [label] - Accessible name, applied as `aria-label` on the
 *   internal input.
 * @attr {string} [name] - Forwarded to the internal input for form use.
 * @attr {string} [value=on] - Forwarded to the internal input for form use.
 *
 * @fires change - Re-dispatched from the internal input's native change.
 *
 * @cssprop --pds-surface-2 - Track fill, off.
 * @cssprop --pds-container-primary-1 - Track fill, on.
 * @cssprop --pds-on-container-inverse-primary - Track outline (off only)
 *   and thumb fill, off.
 * @cssprop --pds-on-container-tertiary - Thumb fill, on.
 * @cssprop --pds-transparent-black-20 - Track outline and thumb overlay, off.
 * @cssprop --pds-transparent-black-50 - Thumb overlay, on.
 * @cssprop --pds-transparent-white-8 - Hover/Focus ripple.
 * @cssprop --pds-transparent-white-12 - Pressed ripple.
 *
 * Known limitations:
 * - No form participation via ElementInternals yet; read `.checked` /
 *   `.value` directly rather than relying on a parent form's FormData.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      font-family: Roboto, system-ui, sans-serif;
    }
    .control {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 48px;
      height: 48px;
      justify-content: center;
      cursor: pointer;
    }
    :host([disabled]) .control {
      cursor: not-allowed;
      opacity: 0.3;
    }
    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }
    .track {
      position: relative;
      pointer-events: none; /* clicks and taps must reach the input underneath */
      width: 52px;
      height: 32px;
      border-radius: 999px;
      background: var(--pds-surface-2, #2f2f2f);
      border: 1px solid var(--pds-transparent-black-20, rgba(0, 0, 0, 0.2));
      box-sizing: border-box;
      transition: background 0.15s ease;
    }
    .state-layer {
      position: absolute;
      top: 50%;
      left: -4px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      transform: translateY(-50%);
      background: transparent;
      transition: left 0.15s ease;
      pointer-events: none;
    }
    .thumb {
      position: absolute;
      top: 50%;
      left: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--pds-on-container-inverse-primary, #141414);
      transform: translateY(-50%);
      transition: left 0.15s ease, width 0.15s ease, height 0.15s ease;
    }
    input:checked ~ .track {
      background: var(--pds-container-primary-1, #f78f20);
      border-color: transparent;
    }
    input:checked ~ .track .state-layer {
      left: 16px;
    }
    input:checked ~ .track .thumb {
      left: 20px;
      width: 24px;
      height: 24px;
    }
    input:hover ~ .track .state-layer,
    input:focus-visible ~ .track .state-layer {
      background: var(--pds-transparent-white-8, rgba(255, 255, 255, 0.08));
    }
    input:active ~ .track .state-layer {
      background: var(--pds-transparent-white-12, rgba(255, 255, 255, 0.12));
    }
    input:focus-visible ~ .track {
      outline: 2px solid var(--pds-container-primary-1, #f78f20);
      outline-offset: 2px;
    }
  </style>
  <span class="control" part="control">
    <input type="checkbox" role="switch" />
    <span class="track" part="track">
      <span class="state-layer" part="state-layer"></span>
      <span class="thumb" part="thumb"></span>
    </span>
  </span>
`;

export class PdsSwitch extends HTMLElement {
  static get observedAttributes() {
    return ["checked", "disabled", "label", "name", "value"];
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
    this._input.disabled = this.disabled;
    this._input.name = this.name || "";
    this._input.value = this.value;
    if (this.label) this._input.setAttribute("aria-label", this.label);
    else this._input.removeAttribute("aria-label");
  }

  _onChange() {
    this.checked = this._input.checked;
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  }

  get checked() { return this.hasAttribute("checked"); }
  set checked(v) { this.toggleAttribute("checked", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }

  get label() { return this.getAttribute("label"); }
  set label(v) { this.setAttribute("label", v); }

  get name() { return this.getAttribute("name") || ""; }
  set name(v) { this.setAttribute("name", v); }

  get value() { return this.getAttribute("value") || "on"; }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("pds-switch", PdsSwitch);
