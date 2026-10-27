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
| Trade ticket (recurring order) | [Trade - Counter Details - Stocks · 🚧 Recurring Order (23/2/26) · Trade Ticket/Buy](https://www.figma.com/design/dARit1smv40LvsvhF16cah/?node-id=14861-5906) | 2026-10-27 | unverified: pulled without a file version; re-pull with the token to track changes | pending |
| | *From a work-in-progress page dated 23 Feb 2026. Buy and Sell use green and grey here, not the library's orange primary; check before copying colours.* | | | |
| Counter detail (Quotes tab) | [Trade - Counter Details - Stocks · ✅ Trade Ticket - SGX Risk Check (27/04/26) · Counter Detail/EQ/Quotes](https://www.figma.com/design/dARit1smv40LvsvhF16cah/?node-id=18993-209041) | 2026-10-27 | unverified: pulled without a file version; re-pull with the token to track changes | pending |
| | *Page approved (✅) on 27 Apr 2026, section still marked in progress. Buy, Short and Sell use green, orange and red here.* | | | |
| Trade ticket (Buy, limit order) | [Trade - Counter Details - Stocks · ✅ Trade Ticket - SGX Risk Check (27/04/26) · Trade Ticket/Buy](https://www.figma.com/design/dARit1smv40LvsvhF16cah/?node-id=18993-208878) | 2026-10-27 | unverified: pulled without a file version; re-pull with the token to track changes | pending |
| | *Same approved page. Buy is green and Review buy order is a green primary; the library's orange primary is not used on trade tickets.* | | | |
| Trade ticket: price outside allowed range (dialog) | [Trade - Counter Details - Stocks · ✅ Trade Ticket - SGX Risk Check (27/04/26) · Trade Ticket/Buy](https://www.figma.com/design/dARit1smv40LvsvhF16cah/?node-id=18993-210973) | 2026-10-27 | unverified: pulled without a file version; re-pull with the token to track changes | pending |
| | *Same approved page. The SGX risk-check dialog over the dimmed ticket: title, two paragraphs, one Okay action.* | | | |
| Trade ticket: review order (bottom sheet) | [Trade - Counter Details - Stocks · ✅ Trade Ticket - SGX Risk Check (27/04/26) · Trade Ticket/Buy](https://www.figma.com/design/dARit1smv40LvsvhF16cah/?node-id=18993-211939) | 2026-10-27 | unverified: pulled without a file version; re-pull with the token to track changes | pending |
| | *Same approved page. Review Order bottom sheet with the High buy price flag and a green Confirm buy order.* | | | |

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
