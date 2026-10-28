# Foundations

Typography, spacing and radius, as tokens. `tokens/tokens.css` loads the
three files here, so a page that loads tokens.css has all of them. If you
inline tokens.css (an artifact page), inline these three too.

## Typography

Fifteen text styles from one family and two weights, Regular and
Medium; nothing heavier than 500. Sizes run from 11 to 57 px. These are
the V2 Typeface styles designers apply today, read from the design file.

| Class / token | Weight | Size / line | Tracking |
|---|---|---|---|
| `pds-type-display-large` | 400 | 57 / 64 | -0.25 |
| `pds-type-display-medium` | 400 | 45 / 52 | 0 |
| `pds-type-display-small` | 400 | 36 / 44 | 0 |
| `pds-type-headline-large` | 400 | 32 / 40 | 0 |
| `pds-type-headline-medium` | 400 | 28 / 36 | 0 |
| `pds-type-headline-small` | 400 | 24 / 32 | 0 |
| `pds-type-title-large` | 400 | 22 / 28 | 0 |
| `pds-type-title-medium` | 500 | 16 / 24 | 0.15 |
| `pds-type-title-small` | 500 | 14 / 20 | 0.1 |
| `pds-type-body-large` | 400 | 16 / 24 | 0.5 |
| `pds-type-body-medium` | 400 | 14 / 20 | 0.25 |
| `pds-type-body-small` | 400 | 12 / 16 | 0.4 |
| `pds-type-label-large` | 500 | 14 / 20 | 0.1 |
| `pds-type-label-medium` | 500 | 12 / 16 | 0.5 |
| `pds-type-label-small` | 500 | 11 / 16 | 0.5 |

Rules:

- Hand-built text takes one of these classes, or the matching tokens in
  your CSS. Never a size outside the scale, and never a size below 11 px.
- Body copy is Body Medium (14) or Body Large (16). Label Small (11) is
  for badges only; Label Medium (12) for the bottom bar and captions.
- Screen titles are Title Large (22); a figure that leads a screen
  (a net asset value) is Headline Small (24) or larger.
- Financial values use tabular figures: `font-variant-numeric: tabular-nums`.
- The components already use these tokens with built-in fallbacks.

Open in the design system: a V2.1 resize of Title Large and Title Medium
and a decision on the number of weights. Until those land, this scale is
what ships.

## Spacing

One 4 px scale; the token number is the multiple of 4.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--pds-space-0` | 0 | | `--pds-space-8` | 32 px |
| `--pds-space-1` | 4 px | | `--pds-space-10` | 40 px |
| `--pds-space-2` | 8 px | | `--pds-space-12` | 48 px |
| `--pds-space-3` | 12 px | | `--pds-space-16` | 64 px |
| `--pds-space-4` | 16 px | | `--pds-space-20` | 80 px |
| `--pds-space-5` | 20 px | | `--pds-space-24` | 96 px |
| `--pds-space-6` | 24 px | | `--pds-space-32` | 128 px |

Derived: `--pds-gutter` (16 px, the side margin of every screen),
`--pds-content-width` (343 px inside a 375 px frame), `--pds-target`
(48 px, the minimum touch target).

Rules:

- Every margin, padding and gap is a token. 16 px between a screen's
  edge and its content; 8 px between items in a row; 24 px between
  sections.
- Anything tappable clears 48 by 48 px, with padding or hit area if the
  visible shape is smaller.

## Radius

| Token | Value | Used by |
|---|---|---|
| `--pds-radius-none` | 0 | tables, dividers, full-bleed surfaces |
| `--pds-radius-xs` | 2 px | tags |
| `--pds-radius-sm` | 4 px | menus, snackbars, checkboxes, tooltips |
| `--pds-radius-md` | 8 px | chips, the inset CTA |
| `--pds-radius-lg` | 12 px | cards, panels |
| `--pds-radius-xl` | 16 px | dialogs, side sheets, large containers |
| `--pds-radius-2xl` | 24 px | hero surfaces |
| `--pds-radius-3xl` | 32 px | full-screen sheets |
| `--pds-radius-full` | pill | buttons, badges, switches, the search bar |

Rules:

- Chips are rounded rectangles (8 px) and buttons are pills. That
  difference is deliberate: a filter surface and an action surface look
  different.
- Hand-built containers use `--pds-radius-lg` or `--pds-radius-xl`;
  never a value off the scale.
