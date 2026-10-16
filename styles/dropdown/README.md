# Dropdown

Global dropdown (list) styles from the oneAZ Design System (Figma: [Dropdown documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=767-18249)).

COMPONENTS / DROPDOWN

The Dropdown page holds the List and List item group components used to build lists of options / dropdowns.

## Specs

The specs below are copied word for word from the Figma Dropdown documentation.

### List

| Lines | Dividers = False | Dividers = True |
|-------|------------------|-----------------|
| One-line   | Subheader; rows: icon + "List item example" | same, with a line between rows |
| Two-line   | Subheader; rows: icon + "List item example" + "Supporting text for this item" | same, with a line between rows |
| Three-line | Subheader; rows: icon + "Overline" + "List item example" + "Supporting text for this item" | same, with a line between rows |

A List has a subheader and rows of list items, with leading icons. Lines sets how much text each row shows; Dividers adds a line between rows.

### List item group

| Expanded = False | Expanded = True |
|------------------|-----------------|
| One row: "List item example" with a right chevron | The row with a down chevron, then three nested rows (icon + "List item example") |

Collapsed, the group shows one row with a right chevron. Expanded, the chevron points down and the nested items appear below, each with a divider.

### Properties

| Property                   | Available values                                                |
|----------------------------|-----------------------------------------------------------------|
| List / Lines               | One-line · Two-line · Three-line                                |
| List / Dividers            | False · True                                                    |
| List item group / Expanded | False · True                                                    |
| Subheader                  | Free text                                                       |
| Rows                       | List item instances; see List item for their states and content |

The page contains no closed field, trigger or open/closed variants. Row states (Hover, Selected and so on) are documented under List item.

### Usage

Related components elsewhere in the file: the Form's Area of Interest select shows a field with a chevron, and the Search bar shows a list of suggestions with a Show more button. Both are documented with their own components.

### Configure an instance

1. Insert List.
2. Choose Lines and Dividers.
3. Edit the subheader.
4. Edit or replace each list item.
5. For nested options insert a List item group and set Expanded.

## Related

- The **Header** uses the Dropdown for its structure, e.g. the profile menu (Item 1 · Item 2 · Item 3); see `blocks/header/README.md`.
- Row states (Hover, Selected, …) come from the **List item** component, to follow.

## Design

### List item group

Figma: [List item group](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=721-92856) (variant Expanded = False · True).

| Part | Design |
|------|--------|
| Row | 8px top/bottom and 16px left/right padding, at least 36px high, 16px between icon and text, 4px corner radius |
| Divider | 1px #E5E6E6 (color/stroke/subtle) under every row, so a row with its divider is 37px |
| Headline | Lexia Regular 16px / 20px, #4F5555 (color/fg/default) |
| Parent row | headline + trailing 20 × 20px chevron: right when collapsed, down when expanded |
| Nested rows (Expanded = True) | indented 16px; each has a leading 20 × 20px icon, then the headline, then a divider |

- Width in Figma: 360px (parent) and 344px (nested rows, after the 16px indent).
- No background on the group itself; row states (Hover, Selected, …) come from the List item component.

### List

Figma: [List](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=767-13107) (variants Lines × Dividers).

| Part | Design |
|------|--------|
| List | 360px wide in Figma, no background or border of its own |
| Subheader | 8px top, 16px left/right, 4px bottom padding (29px high); Inter Medium 14px / 17px, #626A6A (color/fg/muted) |
| Row | same as the List item group row: 8px top/bottom, 16px left/right padding, at least 36px high, 4px corners, 20 × 20px leading icon, 16px between icon and text |
| Overline (Three-line) | Inter Medium 12px / 18px, #626A6A (color/fg/muted) |
| Headline | Lexia Regular 16px / 20px, #4F5555 (color/fg/default) |
| Supporting text (Two-/Three-line) | Inter Regular 14px / 21px, #626A6A (color/fg/muted) |
| Divider (Dividers = True) | 1px #E5E6E6 (color/stroke/subtle) between rows, not after the last row |

| Lines | Row height (without divider) | Text |
|-------|------------------------------|------|
| One-line   | 36px | headline |
| Two-line   | 57px | headline + supporting text |
| Three-line | 75px | overline + headline + supporting text |

- The leading icon is vertically centred on One- and Two-line rows, and aligned to the top on Three-line rows.
- The example icon is a user (person) icon.
