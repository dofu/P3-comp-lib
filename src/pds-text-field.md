# pds-text-field

## When to use

Use `pds-text-field` for a single labelled input. Values (numbers, prices,
codes) never truncate; the text shrinks through a small size ladder and,
failing that, scrolls horizontally inside the field, but the underlying
value is never cut short.

```html
<pds-text-field label="Email address" placeholder="you@example.com"></pds-text-field>
<pds-text-field label="Amount" error="Enter a value greater than 0"></pds-text-field>
```

## Do

- Set `error` to replace supporting text with a validation message; the
  two never show together.
- Use `multiline` for a real `<textarea>` when the value may span several lines.

## Don't

- Never truncate a typed value with an ellipsis; let it shrink or scroll instead.

## Known limitations

- Only a single generic trailing-icon slot; no built-in password
  show/hide toggle.
