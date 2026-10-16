# Body (text)

Global body text styles from the oneAZ Design System (Figma: [Body (Text) / Font Styles](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=210-303)).

Typography definition for different body text styles.

## Specs

| Style                 | Font          | Font size | Line height | Fill color                 |
|-----------------------|---------------|-----------|-------------|----------------------------|
| text-base/font-normal | Inter Regular | 16px      | 150% (24px) | color/fg/default (#4F5555) |
| text-lg/font-normal   | Inter Regular | 18px      | 150% (27px) | color/fg/default (#4F5555) |
| text-xs/font-normal   | Inter Regular | 12px      | 150% (18px) | color/fg/default (#4F5555) |

- text-base is the default for all body text.
- The same sizes apply on desktop, tablet and mobile. The Figma Body foundation has no separate mobile sizes.

## Implementation

- Defined globally in `styles/styles.css`:
  - `--body-font-family` (Inter), `--body-color`, `--body-font-weight` and `--body-line-height` on `:root`, applied to `body`.
  - Sizes: `--body-font-size-l` (text-lg, 18px), `--body-font-size-m` (text-base, 16px), `--body-font-size-xs` (text-xs, 12px).
  - `--body-font-size-s` (14px, the design system's text-sm token) is kept for the navigation and code samples. It isn't part of the Body foundation.
- Replaces the starter template's Roboto body text, its 22px / 18px sizes and its separate desktop sizes.
- Components with their own text design (Teaser, Accordion) set their sizes inside the block.

## Authoring

- Normal paragraphs use text-base automatically.
- For a whole section in text-lg or text-xs, add a Section Metadata block to the section with **Style** set to `text-large` or `text-small`.

## Fonts

Body text uses Inter (the AstraZeneca font in `fonts/`, see `styles/fonts.css`). Inter Medium (500) and SemiBold (600) aren't in the font set yet, so they show as Regular and Bold.
