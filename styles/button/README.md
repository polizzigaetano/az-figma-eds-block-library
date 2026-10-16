# Button

Global button styles from the oneAZ Design System (Figma: [Button documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=438-4274)).

COMPONENTS / BUTTON

## Specs

The specs below are copied word for word from the Figma Button documentation.

### Anatomy

Container · Action label
Optional left icon · Optional right icon

Left and right icons are optional. Show or hide each independently for With text.

Icons: 20 × 20 px · Gap: 8 px

| Example | |
|---|---|
| Both icons shown | Button text with a left and a right icon |
| Both icons hidden | Button text only |

### Properties & values

| Property     | Available values                              |
|--------------|-----------------------------------------------|
| Size         | Small · Medium · Large                        |
| Priority     | Primary · Secondary · Tertiary · Ghost        |
| Type         | With text · Icon Only                         |
| State        | Default · Focused · Hover · Pressed · Disabled |
| Button Text  | Editable action label                         |
| Icon / Left  | true (shown) · false (hidden)                 |
| Icon / Right | true (shown) · false (hidden)                 |

Icon Only uses one icon, controlled by Icon / Right. Keep its sole icon visible.

### Size & padding

| Size   | Text height | Icon Only  |
|--------|-------------|------------|
| Small  | 34 px       | 34 × 34 px |
| Medium | 42 px       | 42 × 42 px |
| Large  | 54 px       | 54 × 54 px |

With text: 16 px left/right; 0 px top/bottom. Fixed height, vertically centered. Width adapts to label and icons.

Icon Only: 0 px padding; centered icon. Sizing and padding are identical across priorities.

### Priority guidance

Common global UI conventions

Primary: the main action (usually one per action group). Secondary: supporting or alternative actions. Tertiary: low-emphasis, optional actions. Ghost: subtle, text-only actions that blend into surrounding content.

## Values shown in the documentation examples

These come from the example buttons on the documentation page. The Variants section below confirms them against the Button component set.

| Priority  | Background | Border           | Label colour |
|-----------|------------|------------------|--------------|
| Primary   | #D0006F    | none             | #FFFFFF      |
| Secondary | #FFFFFF    | 1px #D0006F      | #D0006F      |
| Tertiary  | #FFFFFF    | 1px #4F5555      | #4F5555      |
| Ghost     | none       | none             | #4F5555      |

- Corner radius: 4px on all sizes.
- Label: Inter Bold 16px with a 24px line height on Medium and Large. Small uses Inter Medium 12px with an 18px line height.

## Variants

### Priority Primary

Figma: Button component set (node 1:213), rows `Priority=Primary`.

| State    | Background | Border       | Label   | Effect |
|----------|------------|--------------|---------|--------|
| Default  | #D0006F (color/primary/default) | none | #FFFFFF (color/fg/on-action) | |
| Hover    | #F4349A (color/primary/hover)   | none | #FFFFFF | |
| Pressed  | #9F0457 (color/primary/pressed) | none | #FFFFFF | |
| Focused  | #D0006F | none | #FFFFFF | focus ring: 2px #F8F8F8 inside, 4px #830051 (color/stroke/focus) outside |
| Disabled | #F2F2F2 (color/disabled) | 1px #D0D2D2 (color/stroke/disabled) | #B0B5B5 (color/fg/disabled) | |

| Size   | Height | Label |
|--------|--------|-------|
| Small  | 34px   | Inter Medium 12px / 18px |
| Medium | 42px   | Inter Bold 16px / 24px |
| Large  | 54px   | Inter Bold 16px / 24px |

All sizes: 16px left/right padding (0 for Icon Only), 4px corner radius (radius/control), 20 × 20px icons, 8px gap.

### Priority Secondary

Figma: Button component set (node 1:213), rows `Priority=Secondary`.

| State    | Background | Border       | Label   | Effect |
|----------|------------|--------------|---------|--------|
| Default  | #FFFFFF (color/secondary/default) | 1px #D0006F | #D0006F (color/fg/brand) | |
| Hover    | #F2F2F2 (color/secondary/hover)   | 1px #D0006F | #D0006F | |
| Pressed  | #E5E6E6 (color/secondary/pressed) | 1px #D0006F | #D0006F | |
| Focused  | #FFFFFF | 1px #D0006F | #D0006F | same focus ring as Primary |
| Disabled | #F2F2F2 (color/disabled) | 1px #D0D2D2 (color/stroke/disabled) | #B0B5B5 (color/fg/disabled) | same as Primary |

Sizes, padding, radius, icons and label type are identical to Primary.

### Priority Tertiary

Figma: Button component set (node 1:213), rows `Priority=Tertiary`.

| State    | Background | Border       | Label   | Effect |
|----------|------------|--------------|---------|--------|
| Default  | #FFFFFF (color/tertiary/default) | 1px #4F5555 (color/stroke/strong) | #4F5555 (color/fg/default) | |
| Hover    | #F2F2F2 (color/tertiary/hover)   | 1px #4F5555 | #4F5555 | |
| Pressed  | #E5E6E6 (color/tertiary/pressed) | 1px #4F5555 | #4F5555 | |
| Focused  | #FFFFFF | 1px #4F5555 | #4F5555 | same focus ring as Primary |
| Disabled | #F2F2F2 (color/disabled) | 1px #D0D2D2 (color/stroke/disabled) | #B0B5B5 (color/fg/disabled) | same as Primary |

Sizes, padding, radius, icons and label type are identical to Primary.

### Priority Ghost

Figma: Button component set (node 1:213), rows `Priority=Ghost`.

| State    | Background | Border | Label   | Effect |
|----------|------------|--------|---------|--------|
| Default  | transparent | none | #4F5555 (color/fg/default) | |
| Hover    | #F2F2F2 (color/tertiary/hover)   | none | #4F5555 | |
| Pressed  | #E5E6E6 (color/tertiary/pressed) | none | #4F5555 | |
| Focused  | transparent | none | #4F5555 | same focus ring as Primary |
| Disabled | transparent | none | #B0B5B5 (color/fg/disabled) | unlike the other priorities, no fill and no border |

Sizes, padding, radius, icons and label type are identical to Primary.

## Implementation

- Defined globally in `styles/styles.css` (section `/* buttons */`), so buttons look the same on every page and in every block.
- Each button reads `--button-*` variables. A size class (`small`, `large`) changes the size variables, and a priority class (`primary`, …) sets the colour variables for default, hover and pressed. Focused and Disabled are shared by all priorities.
- `scripts/scripts.js` (`decorateButtons`) turns authored links into buttons:
  - Links containing icons are turned into buttons too. Each icon is tinted with the label colour through a CSS mask.
  - A link containing only an icon gets the `icon-only` class (a square button with no padding) and an accessible name from the icon name, for example "chevron up".
- Default size is Medium. Blocks can add the `small` or `large` class to their buttons.
- Disabled is shown for `aria-disabled="true"` links and disabled `<button>` elements.
- Blocks use these global buttons and only choose the size or priority. For example, the Teaser block makes Home Hero and Blocked Content buttons Large Primary.

## Authoring

| Button | How to write it in the document |
|--------|---------------------------------|
| Primary | A link on its own line, in **bold** |
| Secondary | A link on its own line, in *italic* |
| Tertiary | A link on its own line, in ***bold italic*** |
| Ghost | A link on its own line, <u>underlined</u> (the underline isn't shown on the button) |
| With icons | Add icons inside the link text, e.g. `:chevron-up: Button text :chevron-up:` |
| Icon Only | A formatted link (bold, italic, bold italic or underlined) whose text is only an icon, e.g. `:chevron-up:` |

- Links without formatting, or inside a sentence, stay normal text links.
- Inside the Teaser block, an unformatted link on its own line is also shown as a Ghost button (block-specific rule).
