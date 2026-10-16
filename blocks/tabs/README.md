# Tabs

Tabs block from the oneAZ Design System (Figma: [Tabs](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=78-3882&m=dev); tab item states and the mobile example are on the [Tabs page](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=528-6310&m=dev)).

COMPONENTS / TABS

## Specs

The specs below are copied word for word from the oneAZ Design System.

Groups up to six text tabs in a horizontal row to label related content sections.

Each tab can be shown or hidden independently, and its label is editable.

Nested tab items offer default, hover, and selected appearances; the first starts selected with colored text and an underline. For mobile, use the same Tabs component and allow horizontal scrolling when tabs go beyond the viewport. See below for example:

> The example (from the Figma Tabs page): two 375px mobile screens with the header, the tabs right under it ("Navigation Item 1" selected, "Navigation Item 2", "Item 3" …) and a Home Hero below. In the second screen the row is scrolled sideways, so the first tab is cut off on the left and further items show on the right.

### Properties

| Property            | Available values                                   |
|---------------------|----------------------------------------------------|
| Tabs                | Up to six, in a horizontal row                     |
| Tab (each)          | Shown or hidden; label editable                    |
| Tab item / State    | Default · Hover · Selected                         |
| Initial state       | The first tab is selected (coloured text and an underline) |
| Mobile              | Same component; scrolls horizontally when the tabs are wider than the screen |

The properties table is a summary of the specs above; it adds nothing new.

## Design

Values from Tabs (78:3882) and tab item (22:345).

| Part | Value |
|------|-------|
| Tabs | Up to six tab items side by side, no gaps; no background or line under the row |
| Tab item | 37px tall, 16px left/right padding, Lexia Regular 14/18 (`Body/Lexia-14`) |
| State = Default | `color/fg/default` #4F5555 |
| State = Hover | `color/fg/link-hover` #D0006F text, no underline |
| State = Selected | #D0006F text and a 1px #D0006F underline |
| Mobile | The same tabs; the row runs past the screen edge and scrolls sideways |

## Implementation

- Each tab shows one part of the page: the sections after the Tabs block whose Section Metadata has a **Tab** label. Selecting a tab shows its sections and hides the others' (decision 2026-10-16: tabs switch page sections, so a tab can hold any blocks, e.g. a Home Hero as in the Figma example).
- Consecutive sections with the same label form one tab. The tabs end at the first section without a Tab label, which (like everything after it) is always shown. Up to six tabs; a seventh label ends the tabs.
- The first tab starts selected, unless the address points at a tab: `#navigation-item-2` (the label in lower case with dashes) opens that tab, and selecting a tab updates the address, so a tab can be linked and shared.
- Accessible tabs: a `tablist` of `tab` buttons (`aria-selected`), each section a `tabpanel` named by its tab. Arrow Left / Right move to the previous / next tab (and show it), Home / End to the first / last; Tab moves into the content. Focus shows a 2px #830051 ring inside the tab.
- The row scrolls sideways (no visible scrollbar) when the tabs are wider than the screen; the selected tab is scrolled into view. The first label lines up with the page content (the tab's 16px padding sits just outside the content edge).
- Tab labels stay on one line.

## Authoring

Put a **Tabs** block where the tabs should appear, then the tab sections right after it:

| Tabs |
|------|
| Product information *(optional: a name for the tab row, read by screen readers)* |

Then, for each tab, one or more sections ending with:

| Section Metadata |  |
|------------------|--|
| Tab | Navigation Item 1 |

- Each tab's label is its Section Metadata **Tab** value; give several sections the same label to put them in one tab.
- To hide a tab, remove its sections (or their Tab label); to add one, add a section with a new label (up to six).
- Keep labels short.
- Test page: `/content/tabs` (six tabs: a Home Hero in the first, two sections in the second, and a section after the tabs that's always shown).
