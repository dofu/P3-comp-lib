# pds-menu / pds-menu-item

## When to use

Use a menu for a short list of actions or choices anchored to a trigger,
such as an icon button. For a persistent list of content, use `pds-list`
instead.

```html
<pds-menu>
  <button slot="trigger">Options</button>
  <pds-menu-item value="edit">Edit</pds-menu-item>
  <pds-menu-item value="duplicate">Duplicate</pds-menu-item>
  <pds-menu-item value="delete" disabled>Delete</pds-menu-item>
</pds-menu>
```

```js
menu.addEventListener("select", (event) => {
  console.log(event.detail.value);
});
```

## Do

- Keep menu item labels to a single line.
- Put destructive actions last, and consider `disabled` over hiding an
  item outright when an action is temporarily unavailable.

## Don't

- Don't nest another `pds-menu` directly inside a `pds-menu-item`'s
  default slot; use the `trailing` slot to hint at a submenu instead.

## Rules from the design system documentation

- Labels are sentence case and action-first, one line at the menu's
  width.
- Ten or more items, or a multi-step task, is a bottom sheet on mobile,
  not a menu.
- The trailing arrow appears only on an item that opens a nested menu,
  never as decoration.
- Dividers group related actions.
- A selected item is still selected the next time the menu opens.
- The menu anchors to the control that opened it, closes on an outside tap
  or Esc without changing the selection, and opens above the trigger when
  there is no room below.

## Known limitations

- Submenus (an item that opens a nested panel) are not implemented.
- The panel does not yet reposition itself to stay inside the viewport.
