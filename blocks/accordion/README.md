# Accordion

Accordion block from the oneAZ Design System.

## Breakpoints

| Layout  | Design width | Applies from                          |
|---------|--------------|---------------------------------------|
| Mobile  | 375px        | default, up to 767px                  |
| Tablet  | 768px        | 768px to 1023px                       |
| Desktop | 1440px       | 1024px and up, capped at 1440px wide  |

## Functional specs

- A collapsible UI pattern used to hide and reveal related content, helping save space.
- Variants: Expanded = Yes or No; Breakpoint = Desktop or Mobile.
- Use Desktop breakpoint for Tablets as well; adjust width as per need.
- Title of Accordion can be edited as needed. Replace body text with relevant text.
- When collapsed, entire accordion should be clickable, not just the arrow on the right. When expanded, entire header section of the accordion should be clickable, not just the arrow.

## Authoring

| Accordion |  |
|-----------|--|
| title     | body text |
| title     | body text |

- Each row is one item: the title goes in the first cell and the body text in the second.
- Items start collapsed. Add the `expanded` option (Accordion (Expanded)) to start with every item open.
- Clicking anywhere on the header row (title, padding or arrow) opens or closes the item, and the header works with the keyboard (Tab, then Enter or Space).
- Stacked items share one border.

## Design notes

- Title: Lexia Bold 36px with a 46px line height on desktop and tablet (a collapsed item is 106px tall, matching Figma), Lexia Regular 24/31 on mobile, colour #830051.
- Body: Inter 16/24, colour #4F5555. Paragraphs are 10px apart.
- Header padding: 40px top, 20px bottom, 16px left and right. Body padding: 20px top and bottom. Content is capped at 1180px.
- Border: 1px #E5E6E6 on white.
- Headings use Lexia and body text uses Inter, falling back to Georgia and Arial until the font files are added to the project.
