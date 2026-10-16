# Mega-menu

The header's Mega-menu from the oneAZ Design System (Figma: [Mega-menu specs](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=471-8749&m=dev)). It's built inside the header block (`blocks/header/`).

COMPONENTS / MEGA-MENU

Reveal a large set of grouped destinations from one header item. Use a link when there is only a single destination.

## Specs

The specs below are copied word for word from the Figma Mega-menu documentation.

### Breakpoints & states

- **Desktop** · Mega-menu_Desktop&Tablet_v1 · 1440 px shown: four columns of ten "List item example" rows separated by vertical lines, one row Hovered, and a "View all products →" link below.
- **Tablet** · Mega-menu_Desktop&Tablet_v1 · 768 px shown: the same four columns, narrower, with labels wrapping onto two lines.
- **Mobile · without sub-categories (default)**: a panel with the AstraZeneca logo and a close (×) button, then a single list of ten rows (one Hovered) and "View all products →".
- **Mobile · with sub-categories**: the same panel; every row has a chevron (›) on the right.
- **Mobile · sub-category open**: a "← Back" button, a "Sub-category title", then the sub-category's rows (one Hovered).
- **List item · Default** and **List item · Hovered**.

Default: resting. Hovered: pointer feedback with a filled row, not only a text-colour change. Mobile has no hover; the pressed row uses the same fill.

### Properties

| Property            | Available values |
|---------------------|------------------|
| Component           | Mega-menu_Desktop&Tablet_v1 · Mega-menu_Mobile_v1 · Mega-menu_Column_v1 ·  List-items_v1 |
| List item / State   | Default · Hovered |
| List item text      | Free text |
| Link button         | Free text (e.g. “View all products”); optional |
| Mobile style        | Without sub-categories · With sub-categories (adds chevrons, Back button and sub-category title) |
| Columns (desktop)   | Column instances inside the panel; 10 list items per column in the library example |

Fully customisable. Each Mega-menu column is its own instance, so groups can be reordered or removed. State is visual; wire behaviour in code.

### Usage

Group destinations by what users already call them (therapy area, product family). Put the “see everything” destination in the link button, not in the list. Keep labels to one line.

Example: three columns — "Cardiovascular, Renal & Metabolism" (selected), "Respiratory & Immunology", "Oncology & Hematology" | "Heart Failure", "Chronic Kidney Disease (CKD)", "Type 2 diabetes" (selected), "Amyloidosis" | "Forxiga® (Dapagliflozin)", "Xigduo® (Dapagliflozin/Metformin HCI)" — and "View all Medicines →".

Pattern from myastrazeneca.ch: Our medicines → area → indication → product, plus “View all Medicines”.

### Configure an instance

1. Insert Mega-menu for the breakpoint (Desktop & Tablet or Mobile).
2. Edit the text in each List item.
3. Remove or add Columns to match the number of groups.
4. Edit or hide the Link button.
5. On mobile choose the style with or without sub-categories.

Place it directly under the Header with the matching nav item set to Active.

## Design

Values from Mega-menu_Desktop&Tablet_v1 ([155:9122](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=155-9122&m=dev)) and Mega-menu_Mobile_v1 (from the spec page; its instances are drawn at 53% scale, values below are full size).

### Desktop & Tablet

| Part | Value |
|------|-------|
| Panel | Full width under the header, `color/graphite/50` #F2F2F2, 40px padding, 24px between the columns and the Link button |
| Columns | Up to four, equal width; 16px right padding and a 1px #B0B5B5 line on the right (none after the last) |
| List item · Default | Lexia Regular 16/20, `color/fg/default` #4F5555, 8px / 16px padding, 4px corners (36px tall on one line) |
| List item · Hovered | Fill `color/surface/hover` #D0D2D2, text `color/fg/title` #830051 |
| Link button | Inter Bold 16/24, `color/fg/link-hover` #D0006F, underlined, 20px `arrow-right` 4px after; 16px left padding |
| Tablet (768) | Same panel; labels wrap onto two lines in the narrower columns |

### Mobile

| Part | Value |
|------|-------|
| Panel | #F2F2F2, 16px padding top and bottom, 16px between its parts |
| Top row | AstraZeneca logo and close (×), 16px left/right padding, 1px #B0B5B5 line below |
| List item | Lexia Regular 16/20, #4F5555, 8px / 16px padding, full width; Hovered/pressed: #D0D2D2 fill, #830051 text |
| With sub-categories | 20px `chevron-right` at the row's right end |
| Back button | Small Tertiary button (34px, white, 1px #4F5555 border, 4px corners, Inter Medium 12/18), 20px `arrow-left`, 16px from the left |
| Sub-category title | Inter SemiBold 16/24, #830051, 16px left/right and 8px bottom padding, 1px #B0B5B5 line below |
| Link button | As on desktop, 16px from the left, after the list |

## Implementation

Built in the header block (`blocks/header/header.js` and `header.css`).

- **Desktop & Tablet (from 768px):** cascading columns, as in the usage example (area → indication → product). Column 1 shows the nav item's rows. A row with sub-items opens them in the next column (click, Enter/Space, or resting the mouse on it for 150ms); it stays highlighted (`aria-expanded="true"`) while its level is shown. Resting on a destination closes deeper levels opened from another row. Up to four columns; the columns keep their place, so column 2 always appears in the second position.
- Rows with sub-items are buttons; destinations are links. The current page's row is highlighted (`aria-current`), and when a panel opens, the path to the current page is opened for you.
- Each time a panel opens it starts again from column 1 (or the current page's path).
- **Mobile (below 768px):** Mobile style *with sub-categories*. The menu icon opens the panel with the nav items (Default items have a chevron), the profile links, the utility links, languages and Login. Choosing a row with sub-items replaces the list with that level: Back, the sub-category title (the row's label), its rows and, on the nav item's level, the Link button. Back returns one level and puts focus back on the row you came from; a new level puts focus on Back.
- A nav item whose rows have no sub-items shows a single column (desktop) or plain rows (mobile), i.e. Mobile style *without sub-categories*.
- Hovered uses the row fill on desktop; on mobile the pressed row uses the same fill.

## Authoring

In the nav document's navigation list (see `blocks/header/README.md`), nest lists under a nav item:

```
- Products
  - Cardiovascular, Renal & Metabolism       column 1 (text with a nested list)
    - Heart Failure                          column 2
      - Forxiga® (Dapagliflozin)             column 3 (links)
      - Xigduo® (Dapagliflozin/Metformin HCI)
    - Amyloidosis                            a link: a destination in column 2
  - Respiratory & Immunology
    - Asthma
  - Oncology & Hematology                    a link: a destination in column 1
  - **View all Medicines**                   bold link, last: the Link button (optional)
```

- A row with a nested list opens the next level; it isn't a link itself. Put the area's own page in its list, or use the Link button for the overview.
- Without a bold last link, a linked nav item (e.g. `Products` linked to `/products`) gets "View all products →"; an unlinked one has no Link button.
- Up to four levels (columns) under a nav item; keep labels to one line.

## Related

- `blocks/header/README.md`: the header and how the nav document is authored.
- `styles/dropdown/README.md`: the List item rows the header reuses.
