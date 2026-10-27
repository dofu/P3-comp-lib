# Reference screens

The screens Claude should match when it builds a known tab or flow. Each
one is pulled from the design file in Figma, not from the shipped app, and
each carries its provenance so you can tell whether it is still current.

## Is this the latest?

Every entry in `references.json` records the Figma file, the node, the
file's version and last-modified time at the moment it was pulled, and the
last time we re-checked. A reference is marked **stale** when the Figma
file has changed since the pull; the design system team re-pulls it. Read
the table below before you trust a screen, and ask if the pulled date
looks old for a tab that is changing.

| Screen | Figma source | Pulled | File changed since pull | Exemplar HTML |
|---|---|---|---|---|
| (none yet) | | | | |

The table is regenerated from `references.json` by the design system
team's check script; do not edit it by hand.

## Folder layout

```
examples/
  references.json          - one record per screen (source, version, dates, status)
  <screen>/reference.png   - render of the Figma frame at the time of the pull
  <screen>/index.html      - the same screen built from this library (when done)
```

## How Claude should use these

- Building Home, Watchlist, Markets, Trade, Community or Me: open the
  matching folder first and match the layout, order and copy of
  `index.html`. If only `reference.png` exists, match what it shows.
- The shipped POEMS app is not a reference. These files are.
- A stale reference is still better than none; say in your answer that
  the reference was stale.
