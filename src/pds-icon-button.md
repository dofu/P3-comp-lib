# pds-icon-button

## When to use

An action that is only an icon: back and close in a top app bar, search or
notifications in a toolbar. 48 x 48 touch target, 24px icon from `icons/`.

```html
<pds-top-app-bar title="Link CPF account">
  <pds-icon-button slot="leading" icon="arrow_left" label="Back"></pds-icon-button>
  <pds-icon-button slot="trailing" icon="close" label="Close"></pds-icon-button>
</pds-top-app-bar>
```

## Do

- Always set `label`; it is the button's only name for screen readers.
- Use it for the back and close actions instead of wrapping `pds-icon` in
  your own 48px box.

## Don't

- Never put text next to the icon; that is a `pds-button` with an icon slot.
- Never use it for the one main action of a screen; that is `pds-button`.

## Known limitations

- One size (48px). No filled or outlined variant.
