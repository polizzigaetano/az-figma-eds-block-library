# Checkbox & Radio button

Global checkbox and radio button styles from the oneAZ Design System (Figma: [Checkbox & Radio button documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=537-5156)).

COMPONENTS / CHECKBOX & RADIO BUTTON

Checkbox Input and Radio Input atoms, and the Checkbox Form and Radio Form components built from them.

## Specs

The specs below are copied word for word from the Figma Checkbox & Radio button documentation.

### Checkbox Input & Radio Input

| Status                    | Checkbox | Radio |
|---------------------------|----------|-------|
| Status = Unselected         | ☐ | ○ |
| Status = Focused-Unselected | ☐ (focus ring) | ○ (focus ring) |
| Status = Selected           | ☑ | ◉ |
| Status = Focused-Selected   | ☑ (focus ring) | ◉ (focus ring) |

Atom, 20 × 20 px. Type: Checkbox or Radio. Status: Unselected, Focused-Unselected, Selected, Focused-Selected.

### Checkbox Form

| State | Type = Regular | Type = With secondary text | Type = Link |
|-------|----------------|----------------------------|-------------|
| State = Unselected         | Remember me | Remember me / Save my credentials for easier sign-in | Agree to policy |
| State = Focused-Unselected | Remember me | Remember me / Save my credentials for easier sign-in | Agree to policy |
| State = Selected           | Remember me | Remember me / Save my credentials for easier sign-in | Agree to policy |
| State = Focused-Selected   | Remember me | Remember me / Save my credentials for easier sign-in | Agree to policy |

Unselected: white box with a strong border. Selected: brand fill with a check. Focused: focus ring around the box. Type sets the label: Regular, With secondary text, or Link.

### Radio Form

| State | Example |
|-------|---------|
| State = Unselected         | Text example |
| State = Focused-Unselected | Text example |
| State = Selected           | Text example |
| State = Focused-Selected   | Text example |

Unselected: circle with a strong border. Selected: brand border with a brand dot. Focused: focus ring around the circle.

### Properties

| Property               | Available values                                              |
|------------------------|---------------------------------------------------------------|
| Checkbox Input / Type   | Checkbox · Radio                                              |
| Checkbox Input / Status | Unselected · Focused-Unselected · Selected · Focused-Selected |
| Checkbox Form / State   | Unselected · Focused-Unselected · Selected · Focused-Selected |
| Checkbox Form / Type    | Regular · With secondary text · Link                          |
| Radio Form / State      | Unselected · Focused-Unselected · Selected · Focused-Selected |
| Label text              | Free text; With secondary text adds a second line             |

No disabled, error, hover or indeterminate state exists in the file.

### Usage

Checkbox Form and Radio Form both build on the Checkbox Input atom and the internal ".Checkbox&Radio Form" component. Instances in the file use the labels "Remember me", "Save my credentials for easier sign-in", "Agree to policy" and "Text example". The Form component uses the Checkbox Form for its two consent rows.

### Configure an instance

1. Insert Checkbox Form or Radio Form.
2. Choose State.
3. For Checkbox Form, choose Type: Regular, With secondary text or Link.
4. Edit the label text, and the secondary text if present.

## Design

### Checkbox Input & Radio Input

Figma: [Checkbox & Radio Input](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=537-1203) (variants Type × Status).

| Status | Checkbox | Radio |
|--------|----------|-------|
| Unselected | 20 × 20px, white (#FFFFFF), 1px #4F5555 border (color/stroke/strong), 4px corners | 20 × 20px circle, white, 1px #4F5555 border |
| Selected | #D0006F fill and border (color/surface/brand 1), white 16 × 16px check icon | white, 1px #D0006F border, 10px #D0006F dot in the centre |
| Focused (both) | 1px #830051 ring (color/stroke/focus), 24 × 24px, 6px corners | 1px #830051 ring, 24 × 24px circle |

The focus ring sits 1px outside the control, so it measures 24 × 24px around the 20 × 20px box.

### Checkbox Form

Figma: [Checkbox Form](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=537-1873) (variants State × Type).

| Type | Row height | Label | Second line |
|------|-----------|-------|-------------|
| Regular | 24px | Inter Medium 16px / 24px, #4F5555 (color/fg/default) | none |
| With secondary text | 48px | Inter Medium 16px / 24px, #4F5555 | Inter Regular 16px / 24px, #4F5555 |
| Link | 24px | Inter Regular 16px / 24px, #D0006F (color/fg/brand), underlined | none |

- Control and text are 12px apart.
- The 20px checkbox sits in a 24px-high slot (2px above and below), so it lines up with the first line of text. With secondary text, it stays aligned to the first line.
- The four States (Unselected, Focused-Unselected, Selected, Focused-Selected) are the Checkbox Input states; the label doesn't change.

#### Login form: "Remember me"

Figma: [.Checkbox&Radio Form](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=537-1267), the internal component behind both Form components.

This configuration is the one used in the **login form**: a Checkbox Form of Type = With secondary text.

| Part | Value |
|------|-------|
| Control | Checkbox Input, 20 × 20px, in a 20 × 24px slot (2px above and below) |
| Label | "Remember me", Inter Medium 16px / 24px, #4F5555 |
| Secondary text | "Save my credentials for easier sign-in", Inter Regular 16px / 24px, #4F5555 |
| Gap | 12px between control and text |
| Size | 316 × 48px |

```html
<label class="checkbox-form">
  <input type="checkbox" name="remember">
  <span class="checkbox-form-content">
    <span class="checkbox-form-label">Remember me</span>
    <span class="checkbox-form-secondary">Save my credentials for easier sign-in</span>
  </span>
</label>
```

### Radio Form

Figma: [Radio Form](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=537-2235) (variant State).

- One type only: a 24px row with the 20px radio, 12px gap, label in Inter Medium 16px / 24px, #4F5555 (color/fg/default).
- The four States are the Radio Input states; the label doesn't change.
- Same layout as the Checkbox Form's Regular type (both use the internal ".Checkbox&Radio Form" component).

## Implementation

- Defined globally in `styles/styles.css`, so every native `<input type="checkbox">` and `<input type="radio">` on the site uses this design (forms, blocks, and so on).
- The browser's own drawing is turned off (`appearance: none`) and replaced:
  - Checkbox: a white `check` icon (from `icons/check.svg`) drawn on the brand fill.
  - Radio: the 10px brand dot drawn with a radial gradient.
- Focused uses `:focus-visible`, so the ring shows for keyboard users and not on every mouse click.
- They are real form controls, so keyboard (Space to toggle, arrow keys between radios), screen readers and form submission work as usual.
- In Windows High Contrast (forced colors) mode, the system's own checkbox and radio are shown so they stay visible.
- No disabled, error, hover or indeterminate styles, because the design doesn't define them.

- Checkbox Form is a shared class set (`.checkbox-form`), so forms and blocks get the design by using this markup:

```html
<!-- Type = Regular -->
<label class="checkbox-form">
  <input type="checkbox" name="remember">
  <span class="checkbox-form-content">
    <span class="checkbox-form-label">Remember me</span>
  </span>
</label>

<!-- Type = With secondary text -->
<label class="checkbox-form">
  <input type="checkbox" name="remember">
  <span class="checkbox-form-content">
    <span class="checkbox-form-label">Remember me</span>
    <span class="checkbox-form-secondary">Save my credentials for easier sign-in</span>
  </span>
</label>

<!-- Type = Link: the label holds the link, so the checkbox is still named "Agree to policy" -->
<span class="checkbox-form">
  <input type="checkbox" id="policy" name="policy">
  <label for="policy" class="checkbox-form-content"><a href="/policy">Agree to policy</a></label>
</span>
```

- Clicking the label text toggles the checkbox (Regular and With secondary text). With Link, clicking the link opens it and clicking the box toggles it.
- Radio Form uses `.radio-form` with the same structure. Radios that belong together share a `name` and sit in a `<fieldset>` with a `<legend>` that names the question:

```html
<fieldset>
  <legend>Choose an option</legend>
  <label class="radio-form">
    <input type="radio" name="example" value="a">
    <span class="radio-form-content"><span class="radio-form-label">Text example</span></span>
  </label>
  <label class="radio-form">
    <input type="radio" name="example" value="b">
    <span class="radio-form-content"><span class="radio-form-label">Text example</span></span>
  </label>
</fieldset>
```

- The `<fieldset>` and `<legend>` aren't part of this design; style them in the form that uses them.

## Authoring

Checkboxes and radio buttons appear in forms and blocks, not in page text. Each one needs a label; the Checkbox Form and Radio Form markup above provides it.
