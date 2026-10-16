# Title (H1–H6)

Global heading styles from the oneAZ Design System (Figma: [Title / Font Styles (H1 to H6)](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=208-75)).

Typography for different heading styles to be used for titles.

## Specs

| Heading | Font          | Font size | Line height (Figma "Auto") | Paragraph spacing |
|---------|---------------|-----------|----------------------------|-------------------|
| H1      | Lexia Regular | 60px      | 76px                       | 0                 |
| H2      | Lexia Bold    | 48px      | 56px                       | 56px              |
| H3      | Lexia Bold    | 36px      | 42px                       | 32px              |
| H4      | Lexia Regular | 24px      | 31px                       | 24px              |
| H5      | Lexia Regular | 20px      | 25px                       | 24px              |
| H6      | Lexia Bold    | 14px      | 17px                       | 18px              |

- Colour: #3C4242 (Text-Body-1) for all headings.
- Paragraph spacing is the space after the heading.
- The same sizes apply on desktop, tablet and mobile. The Figma Title foundation has no separate mobile sizes.

## Implementation

- Defined globally in `styles/styles.css` (`:root` variables `--heading-*` and the `h1`–`h6` rules), so every page and block uses them by default.
- Variables per level: `--heading-font-size-*`, `--heading-line-height-*`, `--heading-font-weight-*`, `--heading-spacing-*` with suffixes `xxl` (H1), `xl` (H2), `l` (H3), `m` (H4), `s` (H5), `xs` (H6), plus `--heading-color` and `--heading-font-family`.
- Space before a heading is unchanged from the project default (0.8em). Figma doesn't specify it.
- Components with their own heading design (Teaser, Accordion) override these styles inside the block.

## Authoring

Use the heading levels in the document (Heading 1 to Heading 6). No block is needed.

## Fonts

Headings use Lexia, falling back to Georgia until the Lexia font files are added to the project.
