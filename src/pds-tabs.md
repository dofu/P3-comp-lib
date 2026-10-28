# pds-tabs / pds-tab

## When to use

Use tabs to switch between distinct content sections in one screen. Avoid
tabs when the views show the same underlying data in a different format;
a segmented control fits that case better.

```html
<pds-tabs>
  <pds-tab selected>Stocks</pds-tab>
  <pds-tab>Bonds</pds-tab>
  <pds-tab>Funds <pds-badge slot="badge" count="2"></pds-badge></pds-tab>
</pds-tabs>
```

Arrow keys, Home, and End move both focus and selection between tabs.

## Do

- Keep labels short enough to fit on one line; the row scrolls
  horizontally rather than wrapping a label.

## Don't

- Never leave more than one tab selected at a time.

## Rules from the design system documentation

- A fixed row holds at most four tabs. A fifth means a scrolling row with
  the next tab peeking at the edge, never smaller labels.
- Labels are one or two words, Title Case or short caps (Stocks, UT, CFD,
  RSP), no punctuation.
- Selection shows with the indicator and the label colour together, never
  colour alone.
- Never mix fixed and scrolling behaviour in one row.
- A tab badge is for a count or an unread marker, never decoration.
- Tabs switch between sections of content. The same data in another
  format (chart against table) is a segmented button, not tabs.

## Known limitations

- Hover and Focus colours are not finalised.
