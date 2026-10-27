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

## Known limitations

- No Focused or Disabled visual state yet.
