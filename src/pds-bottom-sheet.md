# pds-bottom-sheet / pds-side-sheet

## When to use

Use a bottom sheet for a focused task or short set of choices on a
narrow screen, anchored to the bottom edge. Use a side sheet for the
same purpose on a wider screen, anchored to the left or right edge.
For content that blocks the entire screen and demands a decision
before continuing, use `pds-dialog` instead.

```html
<pds-bottom-sheet id="filters">
  <h2>Filter by</h2>
  <!-- filter controls -->
</pds-bottom-sheet>

<pds-side-sheet id="details" side="end">
  <h2>Details</h2>
  <!-- detail content -->
</pds-side-sheet>
```

```js
filters.show();
filters.addEventListener("dismiss", (event) => {
  console.log(event.detail.reason); // "backdrop" | "escape" | "api"
});
```

## Do

- Call `show()`/`close()` rather than toggling the `open` attribute
  directly, so the sheet's internal state stays in sync.
- Set `dismissible="false"` only when the content itself offers a
  clear way to close the sheet.

## Don't

- Don't stack a second sheet or dialog on top of an open sheet.

## Known limitations

- The bottom sheet's drag handle is decorative; dragging to dismiss
  is not implemented.
- Neither component currently offers a non-modal (docked alongside
  content) mode; both are always modal.
