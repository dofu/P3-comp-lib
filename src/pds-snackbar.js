/**
 * `<pds-snackbar>`: a brief, non-blocking confirmation that something happened.
 *
 * A snackbar confirms a background action that already finished ("Order
 * submitted successfully"). It never blocks the user and never carries
 * information the user needs to complete a task or avoid an error; use a
 * dialog for that instead.
 *
 * @element pds-snackbar
 *
 * @attr {string} [message] - The notification text. Omit and use the
 *   default slot instead for richer needs. Keep it to one short,
 *   plain-language line; never markup or a link.
 * @attr {string} [action-label] - Optional single action, rendered as a
 *   plain text button, never filled or elevated. Suspends the auto-dismiss
 *   timer; waits for the user to act instead.
 * @attr {number} [duration=6000] - Milliseconds before auto-dismiss. 0
 *   disables auto-dismiss. Ignored while `action-label` is set.
 * @attr {boolean} [dismissible=false] - Shows a close button, a 48x48 tap
 *   target around a 24x24 icon.
 *
 * @slot - Message content, used only when the `message` attribute is not set.
 *
 * Place it inside the screen (inside `pds-preview`): the preview frame contains
 * `position: fixed`, so the snackbar sits at the bottom of the phone frame.
 * Appended to `document.body` it sits at the bottom of the browser window.
 *
 * @fires dismiss - detail: `{ reason: "timeout" | "action" | "close" }`.
 *   Fired just before the component hides itself.
 *
 * @cssprop --pds-container-secondary-2-100 - Surface fill.
 * @cssprop --pds-on-container-inverse-primary - Message and close-icon colour.
 * @cssprop --pds-on-container-tertiary - Action label colour.
 * @cssprop --pds-snackbar-offset-bottom - Gap from the viewport bottom edge.
 * @cssprop --pds-transparency-outline-20 - Hover/focus feedback placeholder.
 *
 * Known limitations:
 * - The action label's colour does not currently meet WCAG AA contrast
 *   against the snackbar's background in either theme.
 * - No entrance/exit animation yet; the component shows and hides instantly.
 * - The auto-dismiss timer does not pause on hover, focus, or touch.
 * - Only one snackbar showing at a time is an app-level concern; this
 *   component does not enforce it.
 */
const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px 4px;
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: var(--pds-snackbar-offset-bottom, 16px);
      max-width: 344px;
      margin: 0 auto;
      box-sizing: border-box;
      padding: 14px 16px;
      border-radius: 4px;
      background: var(--pds-container-secondary-2-100, #595959);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 4px 8px 3px rgba(0, 0, 0, 0.15);
      font-family: Roboto, system-ui, sans-serif;
      z-index: 1000;
    }
    :host([hidden]) { display: none; }
    [hidden] { display: none !important; }
    .message {
      flex: 1;
      min-width: 0;
      font-size: 14px;
      line-height: 20px;
      color: var(--pds-on-container-inverse-primary, #ffffff);
    }
    .action {
      all: unset;
      flex: none;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1px;
      text-transform: uppercase;
      color: var(--pds-on-container-tertiary, #f78f20);
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
    }
    .action:hover, .action:focus-visible {
      background: var(--pds-transparency-outline-20, #ffffff33);
    }
    .close {
      all: unset;
      flex: none;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--pds-on-container-inverse-primary, #ffffff);
      border-radius: 50%;
    }
    .close:hover, .close:focus-visible {
      background: var(--pds-transparency-outline-20, #ffffff33);
    }
    .close svg { width: 24px; height: 24px; }
  </style>
  <span class="message" part="message"><span class="text" hidden></span><slot></slot></span>
  <button type="button" class="action" part="action" hidden></button>
  <button type="button" class="close" part="close" aria-label="Dismiss" hidden>
    <svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  </button>
`;

export class PdsSnackbar extends HTMLElement {
  static get observedAttributes() {
    return ["message", "action-label", "duration", "dismissible"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._messageSlot = this.shadowRoot.querySelector(".message slot");
    this._textEl = this.shadowRoot.querySelector(".message .text");
    this._actionBtn = this.shadowRoot.querySelector(".action");
    this._closeBtn = this.shadowRoot.querySelector(".close");
    this._timer = null;
    this._onActionClick = this._onActionClick.bind(this);
    this._onCloseClick = this._onCloseClick.bind(this);
  }

  connectedCallback() {
    this.setAttribute("role", "status");
    this._actionBtn.addEventListener("click", this._onActionClick);
    this._closeBtn.addEventListener("click", this._onCloseClick);
    this._sync();
  }

  disconnectedCallback() {
    this._actionBtn.removeEventListener("click", this._onActionClick);
    this._closeBtn.removeEventListener("click", this._onCloseClick);
    this._clearTimer();
  }

  attributeChangedCallback() {
    this._sync();
  }

  _sync() {
    const message = this.getAttribute("message");
    // Write into a span beside the slot; replacing the parent's children would delete the slot.
    this._textEl.textContent = message ?? "";
    this._textEl.hidden = message === null;
    this._messageSlot.hidden = message !== null;
    const label = this.getAttribute("action-label");
    this._actionBtn.hidden = !label;
    this._actionBtn.textContent = label || "";
    this._closeBtn.hidden = !this.dismissible;
    this._clearTimer();
    if (!label && this.duration > 0) {
      this._timer = setTimeout(() => this._close("timeout"), this.duration);
    }
  }

  _clearTimer() {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
  }

  _onActionClick() { this._close("action"); }
  _onCloseClick() { this._close("close"); }

  _close(reason) {
    this._clearTimer();
    this.dispatchEvent(new CustomEvent("dismiss", { bubbles: true, composed: true, detail: { reason } }));
    this.hidden = true;
  }

  get message() { return this.getAttribute("message"); }
  set message(v) { if (v === null) this.removeAttribute("message"); else this.setAttribute("message", v); }

  get actionLabel() { return this.getAttribute("action-label"); }
  set actionLabel(v) { if (v === null) this.removeAttribute("action-label"); else this.setAttribute("action-label", v); }

  get duration() { return Number(this.getAttribute("duration") ?? 6000); }
  set duration(v) { this.setAttribute("duration", String(v)); }

  get dismissible() { return this.hasAttribute("dismissible"); }
  set dismissible(v) { this.toggleAttribute("dismissible", Boolean(v)); }
}

customElements.define("pds-snackbar", PdsSnackbar);
