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
4. Add `pds-navigation-bar` only on root screens; the preview frame
   already carries the status bar and the home line.
5. Wrap every screen you render for review in `<pds-preview>` from
   `preview/pds-preview.js`, and end with only what the reviewer must decide
   (README rule 7): no build notes, no component list. The deliverable is
   the live page. If a picture is asked for anyway, render it with
   `corners="square"` and no toggles: rounded corners are for the live
   page only.
6. A screen you build is a high-fidelity concept to show an idea: not a
   URS, not settled requirements, not a build to hand to developers. Say
   so if asked.
7. Copy is short and complete, no fillers, and every string is given in
   English, modern Chinese (Simplified) and Japanese with the `data-zh`,
   `data-ja` and `data-<attr>-zh/ja` conventions in `preview/pds-preview.md`.
   Chinese and Japanese copy is your suggestion, the shortest wording
   possible, not taken from POEMS translation files; say so if asked.
8. Follow README section "Content rules from the design system": a
   financial value never truncates or rounds; a money action never reads
   OK, Yes or Submit; one choice from a few is a segmented button or radio,
   several at once are chips or checkboxes; nothing shrinks or truncates at
   larger text sizes. Each `src/<component>.md` ends with that component's
   own rules; read it before using the component.
