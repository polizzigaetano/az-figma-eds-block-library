# Table

Table block from the oneAZ Design System (Figma: [Table](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=829-12227&m=dev) and [Table / Cell](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=829-12120&m=dev)).

COMPONENTS / TABLE

## Specs

The specs below are copied word for word from the oneAZ Design System.

A table displays related data in rows and columns. Use it to compare information or find specific values. Use rows and columns to compare related data or look up individual values.

Choose Simple Header or Complex Header and Desktop, Tablet, or Mobile; all six combinations are available.

Edit labels directly; select nested cells to configure icons, checkboxes, radios, toggles, empty content, styling, and input states. These controls are not exposed on the table.

Use Simple Header for individual column labels and Complex Header for grouped labels; match the breakpoint to your layout.

Mobile variants show a clipped view of a wider table rather than reflowing columns.

### Properties

| Property      | Available values                                        |
|---------------|---------------------------------------------------------|
| Header        | Simple Header · Complex Header                          |
| Breakpoint    | Desktop · Tablet · Mobile (all six combinations exist)  |
| Labels        | Free text                                               |
| Nested cells  | Icons, checkboxes, radios, toggles, empty content, styling and input states (set per cell, not on the table) |

The properties table is a summary of the specs above; it adds nothing new.

## Design: Table / Cell

Figma: [Table / Cell](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=829-12120&m=dev) (Type × Position, 20 variants).

| Property | Values |
|----------|--------|
| Type     | Icon · Checkbox · Radio · Toggle · Empty |
| Position | Header · Cell Light · Cell Dark · Highlight |

| Position   | Background | Label | Height (one line) |
|------------|------------|-------|-------------------|
| Header     | `color/surface/secondary` #EBEFEE | Lexia Bold 14/17, #4F5555 | 48px (52px with a checkbox or radio) |
| Cell Light | `color/surface/white` #FFFFFF | Inter Regular 14/21, #4F5555 | 53px |
| Cell Dark  | `color/surface/primary` #F9FBFA | Inter Regular 14/21, #4F5555 | 53px |
| Highlight  | `color/surface/highlight` #F1DAE6 | Inter Regular 14/21, #4F5555 | 53px |

- Every cell: 16px padding, 1px #B0B5B5 border, content in a row with 12px gaps, vertically centred.
- Content: a leading element, then the label with a 16px help icon (`question-circle`) and a 16px sort icon (`sort`), 4px apart.
- Leading element by Type:
  - **Icon**: a 16px icon (e.g. `heart`), #4F5555.
  - **Checkbox** / **Radio**: the global 20px Checkbox & Radio Input (`styles/checkbox-radio/README.md`), shown selected.
  - **Toggle**: a 28 × 16px pill, `color/surface/brand 1` #D0006F fill with a 1px #D0006F border and a 12px white knob on the right (on). Only the on state is shown.
  - **Empty**: no content, 48px tall.

## Design: Table

Figma: [Table](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=829-12227&m=dev) (Type = Simple Header · Complex Header × Breakpoint = Desktop · Tablet · Mobile).

| Breakpoint | Table |
|------------|-------|
| Desktop | 1180px wide, 4 equal columns |
| Tablet  | 768px wide, the same columns, narrower |
| Mobile  | The 768px tablet table inside the 375px frame, clipped on the right (a sideways-scrolling view, not reflowed) |

- Cells share their 1px #B0B5B5 lines (they overlap by 1px), so rows step 52px and the header row is 48px; Simple Header Desktop is 464px tall with eight rows.
- Body rows alternate Cell Light (#FFFFFF, first row) and Cell Dark (#F9FBFA); the example has one Highlight cell (#F1DAE6).
- **Complex Header:** two header rows (95px). The first column's header spans both rows; each group label spans two sub-column labels below it.
- In the full tables the cells show labels only (the cell's icon, help and sort layers are hidden).

## Implementation

- `blocks/table/table.js` builds a real `<table>` (header cells are `<th>` with `scope`, spans with `colspan`/`rowspan`), so screen readers can move by row and column.
- Columns share the width equally (`table-layout: fixed`). From 768px the table fills the content width (up to 1180px) and only scrolls with many columns (under 120px each). Below 768px each column is at least 192px (the tablet table's column), so a 4-column table is 768px wide and scrolls sideways inside the page, as in the Figma Mobile variants. The scroll area can be focused and scrolled with the keyboard and is named after the section heading.
- **Rows** are striped automatically (white, then #F9FBFA), also after sorting.
- **Highlight:** a body cell whose whole text is bold gets the Highlight fill; the text itself is shown regular, as in Figma.
- **Sorting** (`sortable` option): each column header gets the 16px `sort` button ("Sort by …"). Clicking sorts ascending (`chevron-up`), then descending (`chevron-down`), then back to the authored order; numbers sort as numbers. The header has `aria-sort`.
- **Help tooltip:** a header cell with a second paragraph gets the 16px `question-circle` button ("About …"); the text shows below it on hover, keyboard focus or click, and Escape hides it. The tooltip isn't in Figma: #3F4444 with white Inter 12/18 text, 4px corners.
- **Controls** are real form controls, named for screen readers from the row's first cell and the column header (e.g. "Forxiga, Compare"), or from their own text:
  - `[x]` / `[ ]`: checkbox (the global Checkbox & Radio Input).
  - `(x)` / `( )`: radio; the radios of one column are one group (one choice per column).
  - `[on]` / `[off]`: toggle (`role="switch"`). On: 28 × 16px, #D0006F with a white 12px knob on the right (Figma). Off isn't in Figma: white with a 1px #4F5555 border and a #4F5555 knob on the left, like the unselected checkbox.
  - A checkbox or toggle in a column header switches the whole column ("Compare: all rows"); a header checkbox shows a mixed state when only some rows are ticked.
- **Icons:** an icon at the start of a cell (e.g. `:heart:`) is shown as the 16px leading icon, #4F5555.
- Empty cells stay empty (Type = Empty).

## Authoring

| Table (sortable) |  |  |  |
|------------------|--|--|--|
| Product<br>*(2nd paragraph: help text)* | Dose (mg) | [ ] Compare | [off] Alerts |
| :heart: Forxiga | 10 | [ ] | [on] |
| **Xigduo** *(bold: Highlight)* | 850 | [x] | [off] |

- The first row is the header. Options: `complex` (or `Complex Header`) for two header rows, `sortable` for sort buttons.
- **Complex Header:** in the first row, leave the cells after a group label empty to make it span them; in the second row, leave the cell under a label empty to make that label span both rows:

| Table (complex) |  |  |  |  |
|-----------------|--|--|--|--|
| Product | Group A |  | Group B |  |
|  | Sub 1 | Sub 2 | Sub 3 | Sub 4 |
| … | … | … | … | … |

- Header help: put the help text in a second paragraph of the header cell.
- Use Simple Header for individual column labels and Complex Header for grouped labels.
- Test page: `/content/table` (Simple, Complex, and a sortable table with help, icons and controls).
