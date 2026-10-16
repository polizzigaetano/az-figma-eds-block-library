# Chips

Global chip styles from the oneAZ Design System.

## Functional specs

- A chip is a small, interactive element that represents an attribute, action, or piece of information. Chips can contain text, icons, or both. Use a chip for a short attribute, action, or piece of information.
- This component comes in 2 sizes - small and large, and has 3 states: Light, Dark, and Active. The states can be used as per visual preference.
- Leading and trailing icons are optional. Chip label is mandatory.
- Trailing icon can be used to trigger an action on click such as removing the chip when clicking on a "close" icon.
- Small chip has height of 20px. Large chip has height of 28px.

## Related

- The Card item's optional **Card Chip** (see `blocks/cards/README.md`) is a Large chip over the card image: 28px high, 8px left/right padding, #830051 background, Inter Regular 16px / 24px, #F2F2F2 text.

## Design

Figma: [Chips](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=307-3064) (variants Size × State).

| Size  | Height | Left/right padding | Gap | Icons | Label |
|-------|--------|--------------------|-----|-------|-------|
| Small | 20px | 4px | 4px | 12 × 12px | Inter Regular 12px / 18px |
| Large | 28px | 8px | 8px | 16 × 16px | Inter Regular 16px / 24px |

| State  | Background | Border | Label and icons |
|--------|------------|--------|-----------------|
| Light  | #FFFFFF (color/surface/white) | 1px #B0B5B5 (color/stroke/default) | #4F5555 (color/fg/default) |
| Dark   | #830051 (color/surface/brand 2) | none | #FFFFFF (color/fg/on-action) |
| Active | #D0006F (color/surface/brand 1) | none | #FFFFFF (color/fg/on-action) |

- Shape: fully rounded pill (radius/full).
- Example icons: `info-circle` (leading) and `close` (trailing).

## Implementation

- **Global style** in `styles/styles.css`: `.chip` with size classes `small` / `large` (default Large) and state classes `light` / `dark` / `active` (default Light). Other blocks can reuse it, for example the Card Chip.
- Icons inside a chip are tinted with the label colour through a CSS mask, like button icons.
- The 1px border is inside the pill (as in Figma), so all states have the same size.
- **Chips block** (`blocks/chips/`): turns each row into a chip in a wrapping list with 8px between chips.
  - With the **Removable** option, every chip gets a trailing close button (`close` icon). Clicking it removes the chip for this visit (nothing is saved) and moves keyboard focus to the next chip; if no chips are left, the block is hidden.
  - The close button is announced as "Remove {chip label}".
  - A chip whose label is a link becomes a link; otherwise it's plain text.
- No hover, pressed or focus designs exist in Figma; keyboard focus on a chip's link or close button shows a 2px #830051 outline (color/stroke/focus).
- The gap between chips (8px) isn't defined in Figma.

## Authoring

| Chips (Large, Light, Removable) |
|---------------------------------|
| :info-circle: Chip label |
| Asthma |
| Respiratory |

- One chip per row. The label is required; empty rows are skipped.
- Block options: **Small** or **Large** (default Large); **Light**, **Dark** or **Active** (default Light); **Removable** to add the close icon.
- Leading or trailing icons: add an icon shortcut before or after the label, e.g. `:info-circle: Chip label`.
- Make the label a link to turn the chip into a link.

## Fonts

Labels use Inter (the AstraZeneca font in `fonts/`).
