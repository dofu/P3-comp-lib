/**
 * `<pds-list-row>`: one row inside a `pds-list`.
 *
 * @element pds-list-row
 *
 * @attr {'1'|'2'|'3'} [lines=1] - 1 Line (57px), 2 Line (65px), or 3
 *   Line+ (93px, secondary text clamped to 2 lines). Height is a minimum,
 *   not a cap.
 * @attr {boolean} [divider=false] - Shows a bottom rule.
 * @attr {boolean} [divider-inset=false] - Only visible while `divider` is
 *   set. Insets the divider 16px from both edges.
 *
 * @slot leading - Leading content (avatar, icon, or an inline control).
 * @slot - Primary text. Wraps rather than truncating.
 * @slot secondary - Secondary text. Clamped to 2 lines while `lines="3"`.
 * @slot trailing - Trailing content (icon, value, or an inline control).
 *   Never wraps or shrinks.
 *
 * @fires click - Whole-row-tappable by default; becomes inert (no
 *   tabindex) once a recognised interactive control is detected in
 *   leading/trailing.
 *
 * @cssprop --pds-on-surface-1 - Primary text, secondary text, and icon
 *   slots' default colour.
 * @cssprop --pds-transparency-outline-20 - Divider colour.
 *
 * Known limitations:
 * - No Hover/Pressed/Selected styling yet.
 * - No swipe actions.
 * - The divider colour token currently resolves to the same value in
 *   Dark and Light mode, so it reads faint on a light background.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
      min-height: 57px;
      padding: 8px 16px;
      box-sizing: border-box;
      cursor: pointer;
    }
    :host([lines="2"]) .row { min-height: 65px; }
    :host([lines="3"]) .row { min-height: 93px; padding: 12px 16px; align-items: flex-start; }
    ::slotted([slot="leading"]) { width: 40px; height: 40px; flex: none; color: var(--pds-on-surface-1, #141414); }
    .content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .primary {
      font-size: var(--pds-type-body-large-size, 16px);
      letter-spacing: var(--pds-type-body-large-tracking, 0.5px);
      line-height: var(--pds-type-body-large-line, 24px);
      color: var(--pds-on-surface-1, #141414);
    }
    .secondary {
      font-size: var(--pds-type-body-medium-size, 14px);
      letter-spacing: var(--pds-type-body-medium-tracking, 0.25px);
      line-height: var(--pds-type-body-medium-line, 20px);
      color: var(--pds-on-surface-1, #141414);
    }
    :host([lines="3"]) .secondary {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    ::slotted([slot="trailing"]) { flex: none; white-space: nowrap; color: var(--pds-on-surface-1, #141414); }
    .divider {
      display: none;
      height: 1px;
      background: var(--pds-transparency-outline-20, #ffffff33);
    }
    :host([divider]) .divider { display: block; }
    :host([divider][divider-inset]) .divider { margin: 0 16px; }
  </style>
  <div class="row" part="row">
    <slot name="leading" part="leading"></slot>
    <span class="content" part="content">
      <span class="primary" part="headline"><slot></slot></span>
      <span class="secondary" part="supporting-text"><slot name="secondary"></slot></span>
    </span>
    <slot name="trailing" part="trailing"></slot>
  </div>
  <div class="divider" part="divider"></div>
`;

export class PdsListRow extends HTMLElement {
  static get observedAttributes() {
    return ["lines", "divider", "divider-inset"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._leadingSlot = this.shadowRoot.querySelector('slot[name="leading"]');
    this._trailingSlot = this.shadowRoot.querySelector('slot[name="trailing"]');
    this._onSlotChange = this._syncTapModel.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "listitem");
    if (!this.hasAttribute("lines")) this.setAttribute("lines", "1");
    this._leadingSlot.addEventListener("slotchange", this._onSlotChange);
    this._trailingSlot.addEventListener("slotchange", this._onSlotChange);
    this._syncTapModel();
  }

  _syncTapModel() {
    const interactiveTags = ["PDS-SWITCH", "PDS-CHECKBOX", "PDS-RADIO", "PDS-BUTTON", "BUTTON", "INPUT", "A"];
    const assigned = [...this._leadingSlot.assignedElements(), ...this._trailingSlot.assignedElements()];
    const hasInteractive = assigned.some((el) => interactiveTags.includes(el.tagName));
    if (hasInteractive) {
      this.removeAttribute("tabindex");
    } else {
      this.tabIndex = 0;
    }
  }

  get lines() { return this.getAttribute("lines") || "1"; }
  set lines(v) { this.setAttribute("lines", v); }

  get divider() { return this.hasAttribute("divider"); }
  set divider(v) { this.toggleAttribute("divider", Boolean(v)); }

  get dividerInset() { return this.hasAttribute("divider-inset"); }
  set dividerInset(v) { this.toggleAttribute("divider-inset", Boolean(v)); }
}

customElements.define("pds-list-row", PdsListRow);
