/**
 * `<pds-icon>`: one icon from this library's `icons/` folder, inlined as SVG
 * so it takes the surrounding text colour (`currentColor`).
 *
 * @element pds-icon
 *
 * @attr {string} name - File name in `icons/` without `.svg`, for example
 *   `search`, `home-rounded`, `home-filled`, `trade`. The full list is
 *   `icons/icons.json`. A missing `-rounded`/`-filled` variant falls back to
 *   the base name (that fallback costs one 404 request; prefer `iconName()`
 *   or `pds-nav-item`'s `icon` attribute, which know which icons are styled).
 * @attr {number} [size=24] - Width and height in CSS px.
 * @attr {string} [label] - Accessible name. Without it the icon is decorative.
 *
 * @fires pds-icon-error - detail: `{ name }` when no file could be loaded.
 *
 * @cssprop --pds-icon-size - Width and height; the `size` attribute sets it.
 *
 * Icons come from `icons/icons.js`, a module that inlines every SVG, loaded
 * once per page with a script import, so they work in sandboxed single-file
 * pages (a claude.ai artifact) and from a CDN copy of the repo. The SVG
 * files in `icons/` are the fallback when the module is unavailable. Never
 * copy the library into a page to make icons work; import it from the CDN.
 */
const ICONS_URL = new URL("../icons/", import.meta.url);

/** Icons that exist as `<name>-rounded` and `<name>-filled` (see icons/icons.json). */
export const STYLED_ICONS = new Set(["home", "watchlist", "globe", "community", "me", "like", "edit", "edit_individual", "edit_group", "fractional_share"]);

/** `<name>-<style>` when the icon has that style, else `<name>`. */
export function iconName(name, style) {
  return STYLED_ICONS.has(name) ? `${name}-${style}` : name;
}
const cache = new Map();

// icons/icons.js inlines every icon as a module, so a page that cannot fetch (a sandboxed single-file page,
// such as a claude.ai artifact) still gets its icons through a script import. The SVG files remain the fallback.
const bundle = import(/* webpackIgnore: true */ new URL("icons.js", ICONS_URL).href).then((m) => m.default).catch(() => null);

function fetchIcon(name) {
  if (!cache.has(name)) {
    cache.set(name, bundle.then((icons) => {
      if (icons && icons[name]) return icons[name];
      return fetch(new URL(`${name}.svg`, ICONS_URL)).then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status} for icons/${name}.svg`))));
    }));
  }
  return cache.get(name);
}

const TEMPLATE = document.createElement("template");
TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      flex: none;
      width: var(--pds-icon-size, 24px);
      height: var(--pds-icon-size, 24px);
      color: inherit;
      vertical-align: middle;
    }
    :host([hidden]) { display: none; }
    .box, .box svg { display: block; width: 100%; height: 100%; }
  </style>
  <span class="box" part="svg"></span>
`;

export class PdsIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size", "label"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this._box = this.shadowRoot.querySelector(".box");
    this._token = 0;
  }

  connectedCallback() { this._sync(); }
  attributeChangedCallback() { this._sync(); }

  _sync() {
    this.style.setProperty("--pds-icon-size", `${this.size}px`);
    const label = this.getAttribute("label");
    if (label) {
      this.setAttribute("role", "img");
      this.setAttribute("aria-label", label);
      this.removeAttribute("aria-hidden");
    } else {
      this.removeAttribute("role");
      this.removeAttribute("aria-label");
      this.setAttribute("aria-hidden", "true");
    }
    this._load(this.name);
  }

  async _load(name) {
    const token = ++this._token;
    if (!name) { this._box.innerHTML = ""; return; }
    const candidates = [name];
    const base = name.replace(/-(rounded|filled)$/, "");
    if (base !== name) candidates.push(base);
    for (const candidate of candidates) {
      try {
        const svg = await fetchIcon(candidate);
        if (token !== this._token) return;
        this._box.innerHTML = svg;
        return;
      } catch { /* try the next candidate */ }
    }
    if (token !== this._token) return;
    this._box.innerHTML = "";
    this.dispatchEvent(new CustomEvent("pds-icon-error", { bubbles: true, composed: true, detail: { name } }));
  }

  get name() { return this.getAttribute("name") || ""; }
  set name(v) { this.setAttribute("name", v); }

  get size() { return Number(this.getAttribute("size")) || 24; }
  set size(v) { this.setAttribute("size", String(v)); }

  get label() { return this.getAttribute("label"); }
  set label(v) { if (v === null || v === undefined) this.removeAttribute("label"); else this.setAttribute("label", v); }
}

if (!customElements.get("pds-icon")) customElements.define("pds-icon", PdsIcon);
