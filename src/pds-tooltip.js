/**
 * `<pds-tooltip>`: a short label or richer note attached to a trigger element.
 *
 * @element pds-tooltip
 *
 * @attr {'plain'|'rich'} [variant=plain] - plain = a single label; rich =
 *   heading, body, and up to two actions.
 * @attr {'above'|'below'} [placement=above] - Where the surface renders
 *   relative to the trigger.
 * @attr {string} [label] - Plain-variant text. Required for variant="plain".
 * @attr {string} [heading] - Rich-variant title. Omit to hide it.
 * @attr {boolean} [open=false] - Whether the tooltip surface is shown.
 *   Normally driven by hover/focus of the slotted trigger.
 *
 * @slot - The trigger element the tooltip attaches to.
 * @slot body - Rich-variant supporting text.
 * @slot primary-action - Rich-variant first action.
 * @slot secondary-action - Rich-variant second action; omit for a single action.
 *
 * @cssprop --pds-container-secondary-2-100 - Fill for the surface and the nub, both variants.
 * @cssprop --pds-on-container-inverse-primary - Text colour, both variants.
 * @cssprop --pds-on-container-tertiary - Fallback colour applied to slotted actions.
 *
 * Known limitations:
 * - No dynamic viewport-collision handling; placement is fixed CSS, not
 *   recalculated on scroll or resize.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
      font-family: Roboto, system-ui, sans-serif;
    }
    [hidden] { display: none !important; }
    .surface {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      background: var(--pds-container-secondary-2-100, #595959);
      color: var(--pds-on-container-inverse-primary, #ffffff);
      border-radius: 4px;
      box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.3);
      z-index: 100;
      pointer-events: none;
    }
    :host([placement="above"]) .surface { bottom: calc(100% + 8px); }
    :host([placement="below"]) .surface { top: calc(100% + 8px); }
    :host(:not([open])) .surface { display: none; }

    :host(:not([variant="rich"])) .surface {
      padding: 4px 8px;
      font-size: 12px;
      letter-spacing: 0.4px;
      line-height: 16px;
      max-width: 250px;
    }
    :host([variant="rich"]) .surface {
      width: 312px;
      border-radius: 12px;
      padding: 12px 16px 8px;
    }
    .heading {
      display: none;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1px;
      line-height: 20px;
      margin-bottom: 4px;
    }
    :host([variant="rich"][heading]) .heading { display: block; }
    .body {
      font-size: 14px;
      letter-spacing: 0.25px;
      line-height: 20px;
      display: none;
    }
    :host([variant="rich"]) .body { display: block; }
    .actions {
      display: none;
      margin-top: 8px;
      gap: 8px;
      justify-content: flex-start;
    }
    :host([variant="rich"]) .actions { display: flex; }
    ::slotted([slot="primary-action"]),
    ::slotted([slot="secondary-action"]) {
      color: var(--pds-on-container-tertiary, #f78f20);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  </style>
  <slot part="trigger"></slot>
  <div class="surface" part="surface">
    <div class="heading" part="heading"></div>
    <div class="body" part="body"><slot name="body"></slot></div>
    <div class="label" part="label"></div>
    <div class="actions" part="actions">
      <slot name="primary-action"></slot>
      <slot name="secondary-action"></slot>
    </div>
  </div>
`;

export class PdsTooltip extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "placement", "label", "heading", "open"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._labelEl = this.shadowRoot.querySelector(".label");
    this._headingEl = this.shadowRoot.querySelector(".heading");
    this._show = this._show.bind(this);
    this._hide = this._hide.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "plain");
    if (!this.hasAttribute("placement")) this.setAttribute("placement", "above");
    this.addEventListener("mouseenter", this._show);
    this.addEventListener("mouseleave", this._hide);
    this.addEventListener("focusin", this._show);
    this.addEventListener("focusout", this._hide);
    this._sync();
  }

  disconnectedCallback() {
    this.removeEventListener("mouseenter", this._show);
    this.removeEventListener("mouseleave", this._hide);
    this.removeEventListener("focusin", this._show);
    this.removeEventListener("focusout", this._hide);
  }

  attributeChangedCallback(name) {
    if (name === "label" || name === "heading") this._sync();
  }

  _sync() {
    this._labelEl.textContent = this.getAttribute("label") || "";
    this._headingEl.textContent = this.getAttribute("heading") || "";
  }

  _show() { this.open = true; }
  _hide() { this.open = false; }

  get variant() { return this.getAttribute("variant") || "plain"; }
  set variant(v) { this.setAttribute("variant", v); }

  get placement() { return this.getAttribute("placement") || "above"; }
  set placement(v) { this.setAttribute("placement", v); }

  get open() { return this.hasAttribute("open"); }
  set open(v) { this.toggleAttribute("open", Boolean(v)); }
}

customElements.define("pds-tooltip", PdsTooltip);
