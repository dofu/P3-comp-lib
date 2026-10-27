# Instructions for coding agents

This folder is the P3 component library: `pds-*` web components, plain
JavaScript, no build step. When you build or change any screen in a
project that includes this library, these rules apply.

1. Read `README.md`, section "Rules for every screen", and follow it.
2. Build from this library only. Never write your own button, input, tab,
   chip, switch, list, dialog or navigation, never style a raw `<button>`
   or `<input>` to look like one, and never copy from another UI kit or
   from the current POEMS app. If a component is missing, say so and use
   the closest one.
3. `custom-elements.json` is the contract: use only the attributes it
   lists. Per-component guidance (when to use, do and don't) is in
   `src/<component>.md`. Colours come from `tokens/tokens.css` only.
4. Wrap every screen you render for review in `<pds-preview>` from
   `preview/pds-preview.js`, and finish with the checklist in the README.
5. Copy is short and complete, no fillers, and every string is given in
   English, modern Chinese (Simplified) and Japanese with the `data-zh`,
   `data-ja` and `data-<attr>-zh/ja` conventions in `preview/pds-preview.md`.
