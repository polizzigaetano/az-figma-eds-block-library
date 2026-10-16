# Input field

Global input field and textarea styles from the oneAZ Design System (Figma: [Input field documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=767-17926)).

COMPONENTS / INPUT FIELD

A text field with a label, placeholder and optional supportive text. A textarea version handles longer text.

## Specs

The specs below are copied word for word from the Figma Input field documentation.

### Input field states

| State    | Example |
|----------|---------|
| Default  | Label · "Placeholder" |
| Type in  | Label · "Example text" with a cursor and a clear (×) icon |
| Active   | Label · "Example text" |
| Focused  | Label · "Placeholder" |
| Error    | Label · "Placeholder" · "Supportive text label" below |
| Disabled | Label · "Placeholder" |

Default: gray border with a placeholder. Type in: brand magenta border, cursor and a clear icon. Active: filled, resting border. Focused: a double ring in the focus colour. Error: red border with supportive text. Disabled: gray fill, not editable.

### Textarea states

| State    | Example |
|----------|---------|
| Default  | Label · "Placeholder" · counter 0/100 |
| Type in  | Label · "Example text" with a cursor · counter 12/100 |
| Active   | Label · "Example text" · counter 0/100 |
| Focused  | Label · "Placeholder" · counter 0/100 |
| Error    | Label · "Placeholder" · "Supportive text label" and counter 0/100 below |
| Disabled | Label · "Placeholder" · counter 0/100 |

The textarea has the same six states, a resize handle in the corner and a character counter (0/100, 12/100). In Error the supportive text sits beside the counter.

### Properties

| Property              | Available values                                          |
|-----------------------|-----------------------------------------------------------|
| Input field / State   | Default · Type in · Active · Focused · Error · Disabled   |
| Textarea / Property 1 | Default · Type in · Active · Focused · Error · Disabled   |
| Label                 | Free text                                                 |
| Placeholder / Text    | Free text                                                 |
| Supportive text       | Free text; shown in Error                                 |
| Clear icon            | Shown in Type in (input field)                            |
| Character counter     | Shown in the textarea                                     |

Components: Input field and .Input Textarea (internal).

### Usage

The Form uses the input field for First name, Last name and Email, and the textarea for the request text. The Search bar is a separate component.

### Configure an instance

1. Insert List.
2. Choose Lines and Dividers.
3. Edit the subheader.
4. Edit or replace each list item.
5. For nested options insert a List item group and set Expanded.

> These five steps are identical to the Dropdown documentation's "Configure an instance" and look copied by mistake; they don't describe the input field. They're kept here as they appear in Figma.

## Design

Values from the Figma Input field component ([752:11059](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=752-11059&m=dev)).

| Part            | Value |
|-----------------|-------|
| Layout          | Label above the field, 2px gap; supportive text 2px below the field |
| Label           | Inter Bold 16/24, `color/fg/default` #4F5555 (all states, including Disabled) |
| Field           | 56px tall, 16px padding, 8px gap, 4px corners, 1px inside stroke, `color/surface/input` #FFFFFF |
| Placeholder     | Inter Regular 16/24, `color/graphite/400` #909898 |
| Input text      | Inter Regular 16/24, `color/fg/default` #4F5555 |
| Cursor          | 2px × 24px, `color/stroke/brand` #D0006F |
| Clear icon      | 20px `close`, `color/fg/default` #4F5555, right side |
| Supportive text | Inter Regular 16/24, `color/error/strong` #B91C1C |

| State    | Field |
|----------|-------|
| Default  | Stroke `color/stroke/default` #B0B5B5, placeholder |
| Type in  | Stroke `color/stroke/brand` #D0006F, text, cursor and the clear icon |
| Active   | Stroke #B0B5B5, text |
| Focused  | Stroke #B0B5B5 and a 1px `color/stroke/focus` #830051 ring 2px outside the field (304 × 60px, 6px corners), placeholder |
| Error    | Stroke #B91C1C, supportive text below (108px overall) |
| Disabled | Fill `color/surface/disabled` #E5E6E6, stroke #D0D2D2, placeholder `color/fg/disabled` #B0B5B5 |

The 300px width in Figma is the frame size; the field fills its container.

Hidden layers in the component that the specs don't list aren't built: a left `search` icon, a "kg" suffix, a required star next to the label, and a dropdown panel below the field.

### Textarea

Values from the Figma Input Textarea component ([767:12761](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=767-12761&m=dev)). Label, text, placeholder, cursor, supportive text and the state colours are the same as the input field.

| Part          | Value |
|---------------|-------|
| Layout        | Label, field and bottom row stacked with no gaps (24 + 153 + 24 = 201px) |
| Field         | 153px tall, 16px padding, text from the top, 4px corners, 1px inside stroke |
| Resize handle | 20px `resize` icon in the field's bottom-right corner, #4F5555 (Disabled #B0B5B5) |
| Bottom row    | Supportive text on the left (Error only), counter on the right, 8px gap |
| Counter       | Inter Regular 16/24, `color/fg/placeholder` #767F7F (Disabled `color/fg/disabled` #B0B5B5) |

| State    | Field |
|----------|-------|
| Default  | Stroke #B0B5B5, placeholder |
| Type in  | Stroke #D0006F, text and cursor (no clear icon) |
| Active   | Stroke #B0B5B5, text |
| Focused  | Stroke #D0006F **and** the 1px #830051 ring 2px outside (6px corners), placeholder. Unlike the input field, the stroke turns brand too. |
| Error    | Stroke #B91C1C, supportive text and counter below |
| Disabled | Fill #E5E6E6, stroke #D0D2D2, placeholder, handle and counter #B0B5B5 |

The Figma Focused and Active frames show 12/100 with a placeholder; the built counter always shows the real count.

## Implementation

- Global styles in `styles/styles.css` (`.input-field`), so any form or block gets the design by using this markup:

```html
<div class="input-field">
  <label class="input-field-label" for="email">Email</label>
  <div class="input-field-control">
    <input type="email" id="email" name="email" placeholder="Placeholder" aria-describedby="email-error">
  </div>
  <p class="input-field-supportive" id="email-error">Enter a valid email address</p>
</div>
```

- `decorateInputFields(container)` in `scripts/scripts.js` adds the clear button to each `.input-field-control` that holds an `<input>`. It runs on the page's main content; a block that builds a form after that imports it from `/scripts/scripts.js` and calls it on its own markup.
- States come from the field itself, so no state classes are needed:

| State    | When |
|----------|------|
| Default  | Empty, not selected |
| Focused  | Selected and empty (`:placeholder-shown`) |
| Type in  | Selected with text; also while the clear button has focus |
| Active   | Has text, not selected |
| Error    | `aria-invalid="true"` on the input, or the browser's own check fails after the user edits (`:user-invalid`, for example `required` or `type="email"`). Error wins over Type in. |
| Disabled | `disabled` on the input |

- Focused and Type in need a placeholder to tell an empty field from a filled one, so the script adds a blank one when none is set.
- The supportive text only shows in Error; link it to the input with `aria-describedby` so screen readers read it.
- Clear button: named "Clear", empties the field and puts focus back in it. With a mouse the field keeps focus; with a keyboard, Tab from the field reaches it (Enter or Space clears).
- The cursor uses the brand colour (`caret-color`); browsers draw it at their own width.
- Spacing between fields is up to the form that uses them.

### Textarea

- Same markup with a `<textarea>` in the control. Add `maxlength` to get the counter:

```html
<div class="input-field">
  <label class="input-field-label" for="request">Your request</label>
  <div class="input-field-control">
    <textarea id="request" name="request" placeholder="Placeholder" maxlength="100" aria-describedby="request-error"></textarea>
  </div>
  <p class="input-field-supportive" id="request-error">Tell us a little more</p>
</div>
```

- `decorateInputFields` builds the bottom row (`.input-field-bottom`): it moves the supportive text in and adds the counter (`.input-field-counter`, "0/100"), which updates as the user types. The counter is added to the textarea's `aria-describedby`, so screen readers read it with the field. Without `maxlength` there's no counter.
- The field (not the textarea) resizes vertically, so the handle sits in the field's corner as in Figma; it can't be made smaller than 153px. Chrome, Edge and Safari draw the Figma `resize` icon; Firefox shows its own handle.
- Focused (selected and empty) shows the brand stroke and the ring; Type in (selected with text) shows the brand stroke only. Error and Disabled work as for the input field.

## Authoring

Input fields appear in forms and blocks (for example the login form), not in page text, so authors don't add them directly. Blocks that need a field use the markup above.

## Related

- The **Form** (and the login form) uses these fields; see also `styles/checkbox-radio/README.md` for the "Remember me" checkbox.
- The **Search bar** is a separate component.
