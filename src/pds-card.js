/**
 * `<pds-card>`: a flexible container for grouped content.
 *
 * This component is an early, unreviewed draft: sizes, spacing, and
 * colours here are a starting proposal, not settled values. Expect them
 * to change.
 *
 * @element pds-card
 *
 * @attr {'filled'|'outlined'|'tonal-raised'} [variant=filled] - Container style.
 * @attr {'xs'|'s'|'m'|'l'|'xl'} [size] - Width contract: xs 120px, s 156px,
 *   m 250px, l 343px, xl 384px. Height always hugs content. Omit to let
 *   width come from the container.
 * @attr {'16:9'|'3:4'|'1:1'|'none'} [media-ratio=none] - Aspect ratio
 *   applied to the media slot.
 * @attr {boolean} [interactive=false] - Whole-card tap target
 *   (role=button, focusable, Enter/Space fire click).
 * @attr {boolean} [disabled=false] - Only meaningful with `interactive`.
 *
 * @slot media - Optional media (image or video).
 * @slot header - Optional header: avatar, title, meta, overflow menu.
 * @slot - Main content.
 * @slot actions - Optional actions: text buttons, or one full-width CTA.
 * @slot meta - Optional meta/footer: engagement row, links.
 *
 * @fires click - Native click; suppressed while `interactive` and
 *   `disabled` are both set.
 *
 * @cssprop --pds-surface-2 - Filled variant background.
 * @cssprop --pds-container-secondary-1-50 - Tonal-raised variant background.
 * @cssprop --pds-transparency-outline-20 - Outlined variant border.
 * @cssprop --pds-on-surface-1 - Default text colour.
 *
 * Known limitations:
 * - This is a draft proposal, not a reviewed, final component.
 * - Filled and Tonal-raised currently look identical in Light mode.
 * - The outlined border colour token currently resolves to the same
 *   value in Dark and Light mode, so it reads faint on a light background.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: block;
      font-family: Roboto, system-ui, sans-serif;
      border-radius: 16px;
      padding: 16px;
      box-sizing: border-box;
      color: var(--pds-on-surface-1, #141414);
    }
    :host(:not([variant="outlined"]):not([variant="tonal-raised"])) {
      background: var(--pds-surface-2, #2f2f2f);
    }
    :host([variant="tonal-raised"]) {
      background: var(--pds-container-secondary-1-50, #595959);
    }
    :host([variant="outlined"]) {
      background: transparent;
      border: 1px solid var(--pds-transparency-outline-20, #ffffff33);
    }
    :host([size="xs"]) { width: 120px; }
    :host([size="s"]) { width: 156px; }
    :host([size="m"]) { width: 250px; }
    :host([size="l"]) { width: 343px; }
    :host([size="xl"]) { width: 384px; }
    :host([interactive]) { cursor: pointer; }
    :host([interactive][disabled]) { cursor: not-allowed; opacity: 0.5; }
    .media {
      display: none;
      border-radius: 10px;
      overflow: hidden;
      margin: -16px -16px 12px;
    }
    ::slotted([slot="media"]) { width: 100%; display: block; object-fit: cover; }
    :host([media-ratio="16:9"]) .media { display: block; aspect-ratio: 16 / 9; }
    :host([media-ratio="3:4"]) .media { display: block; aspect-ratio: 3 / 4; }
    :host([media-ratio="1:1"]) .media { display: block; aspect-ratio: 1 / 1; }
    .header, .actions, .meta { display: flex; }
    .header:empty, .actions:empty, .meta:empty { display: none; }
    .header { margin-bottom: 12px; }
    .actions { margin-top: 12px; gap: 8px; justify-content: flex-end; }
    .meta { margin-top: 12px; }
    .body:empty { display: none; }
  </style>
  <div class="media" part="media"><slot name="media"></slot></div>
  <div class="header" part="header"><slot name="header"></slot></div>
  <div class="body" part="body"><slot></slot></div>
  <div class="actions" part="actions"><slot name="actions"></slot></div>
  <div class="meta" part="meta"><slot name="meta"></slot></div>
`;

export class PdsCard extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "media-ratio", "interactive", "disabled"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._onClick = this._onClick.bind(this);
    this._onKeydown = this._onKeydown.bind(this);
  }

  connectedCallback() {
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "filled");
    if (!this.hasAttribute("media-ratio")) this.setAttribute("media-ratio", "none");
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeydown);
    this._syncInteractive();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    this.removeEventListener("keydown", this._onKeydown);
  }

  attributeChangedCallback(name) {
    if (name === "interactive" || name === "disabled") this._syncInteractive();
  }

  _syncInteractive() {
    if (this.interactive) {
      this.setAttribute("role", "button");
      this.tabIndex = this.disabled ? -1 : 0;
    } else {
      this.removeAttribute("role");
      this.removeAttribute("tabindex");
    }
  }

  _onClick(event) {
    if (this.interactive && this.disabled) { event.stopImmediatePropagation(); event.preventDefault(); }
  }

  _onKeydown(event) {
    if (!this.interactive || this.disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.click();
    }
  }

  get variant() { return this.getAttribute("variant") || "filled"; }
  set variant(v) { this.setAttribute("variant", v); }

  get size() { return this.getAttribute("size"); }
  set size(v) { if (v === null) this.removeAttribute("size"); else this.setAttribute("size", v); }

  get mediaRatio() { return this.getAttribute("media-ratio") || "none"; }
  set mediaRatio(v) { this.setAttribute("media-ratio", v); }

  get interactive() { return this.hasAttribute("interactive"); }
  set interactive(v) { this.toggleAttribute("interactive", Boolean(v)); }

  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(v) { this.toggleAttribute("disabled", Boolean(v)); }
}

customElements.define("pds-card", PdsCard);
