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

## Rules from the design system documentation

- Content decides whether a sheet is Standard or Persistent. A sheet
  with a Cancel button is Persistent: tapping outside does not close it
  (`dismissible="false"`). A sheet without one is Standard: tapping
  outside closes it.
- Legal and compliance copy (a disclaimer, a terms notice) is always
  Persistent and needs an explicit acknowledgement.
- Every sheet has a close control reachable by keyboard and screen
  reader. The drag handle is never the only way out.
- Sheet titles are sentence case and may truncate at narrow widths.
  Values never truncate.
- Sizes from Figma: the bottom sheet has a 28 px radius on its top corners
  only and a 32 by 4 px handle; the side sheet is 320 px wide with a 16 px
  radius.

## Known limitations

- The bottom sheet's drag handle is decorative; dragging to dismiss
  is not implemented.
- Neither component currently offers a non-modal (docked alongside
  content) mode; both are always modal.
