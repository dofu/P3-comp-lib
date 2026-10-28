# pds-search

## When to use

Use `pds-search` as the search entry point for a screen or list. Listen
for `search` rather than raw `input` events; it already debounces and
enforces a minimum query length for you.

```html
<pds-search placeholder="Search" min-length="2" debounce="300"></pds-search>
<script type="module">
  document.querySelector("pds-search").addEventListener("search", (e) => {
    runSearch(e.detail.value);
  });
</script>
```

## Do

- Trust the `search` event's debounce rather than wiring your own.
- Use the `icon` slot for a leading icon or an avatar.

## Don't

- Never fire a real network request on every keystroke; let `debounce` and
  `min-length` do that filtering.

## Rules from the design system documentation

- The placeholder says what can be searched, in a few words. It
  disappears entirely once typing starts.
- The leading icon is either a navigation action (back, menu) or a search
  glyph, never both.
- Up to two trailing icons. An avatar pairs with at most one.
- Tapping the bar opens the search view: recent searches first, matching
  suggestions while typing, the full result set on submit. The back action
  returns to whatever opened it.
- Chips filter what is already on screen. They never find new content;
  that is search.
- The search bar is the persistent entry point on Home or at the top of a
  section.

## Known limitations

- No Focused or Disabled visual state yet.
