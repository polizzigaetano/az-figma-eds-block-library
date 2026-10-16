# Header

Header block from the oneAZ Design System (Figma: [Header documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=471-9761)).

COMPONENTS / HEADER

**Primary site navigation:** brand, main sections, search, language and account. Commercial style only.

## Specs

The specs below are copied word for word from the Figma Header documentation.

### Breakpoints

| Breakpoint | Width   | Height                                    |
|------------|---------|-------------------------------------------|
| Desktop    | 1440 px | 98 px high (132 px with disclaimer)       |
| Tablet     | 768 px  | 66 px                                     |
| Mobile     | 375 px  | 66 px                                     |

Tablet and mobile collapse navigation into the menu icon; the Mega-menu mobile panel opens from it.

### Building blocks

| Building block | Values shown |
|----------------|--------------|
| Header nav · Type | Default (chevron) · Active · Simple · Simple Active — e.g. "Products ⌄", "Products ⌃" (active), "News", "News" (active) |
| Language item | Default · Active — e.g. EN \| DE |
| Language selector | 2, 3 or 4 languages — e.g. DE \| EN \| FR \| IT · DE \| EN \| FR · DE \| EN |
| Dropdown (profile) | Item 1 · Item 2 · Item 3 |
| Header disclaimer | Desktop 1440 × 34 · Tablet 768 × 34 · Mobile 375 × 52 — e.g. "This website is intended for healthcare professionals in Switzerland only." |

Default: resting. Active: magenta text with the chevron flipped while its panel is open.

### Properties

| Property                             | Available values                                  |
|--------------------------------------|---------------------------------------------------|
| Breakpoint                           | Desktop · Tablet · Mobile                         |
| Header nav / Type                    | Default (with chevron) · Simple (plain link)      |
| Header nav / Icon                    | Yes · No                                          |
| Header nav / Active                  | No · Yes                                          |
| Language item / State                | Default · Active                                  |
| Language selector / Language no.     | 2 · 3 · 4                                         |
| Disclaimer                           | On/off; Breakpoint Desktop · Tablet · Mobile      |
| Style                                | Commercial only                                   |

Header cell, Header nav, Language item, Language selector and Disclaimer are atoms; Header is the assembled component.

### Examples of usage

- **Not logged in · with disclaimer message:** disclaimer bar ("This website is intended for healthcare professionals in Switzerland only."), utility row (Contact Us | AZ Employee Login | DE | EN | FR | IT), then the main row: AstraZeneca logo, Products ⌄, Therapeutic Areas ⌄, News, search icon and a Login button.
- **Not logged in · nav item active · Mega-menu open:** "Products" active (magenta, chevron flipped) with the Mega-menu panel open below: four columns of "List item example" links (one highlighted) and a "View all products →" link.
- **Logged in · profile dropdown:** the Login button is replaced by a profile icon with a chevron; its dropdown lists Item 1, Item 2, Item 3.

### Usage

Keep three to five top-level items. Use Default items for sections that open a Mega-menu and Simple items for single pages. Show Login for visitors and the profile menu once signed in.

Reference: myastrazeneca.ch uses Our medicines,Therapeutic Areas, Contact us, Login, search and DE · EN · FR · IT.

### Configure an instance

1. Insert Header and choose Breakpoint.
2. Set each Header nav item's Type and edit its label.
3. Choose a Language selector (2–4).
4. Add the Disclaimer if a notice is required.
5. Mark the open item Active and show its Mega-menu below.

## Related

- The header uses a **Dropdown** for its structure (profile menu, and the panels opened by Default nav items). Its specs and component follow.
- The Breadcrumb block is placed directly under the header on pages two or more levels deep (see `blocks/breadcrumb/README.md`).
- The Login button looks like the global Secondary button (`styles/button/README.md`); this will be confirmed against the Header component. The login form will reuse the Checkbox Form "Remember me" row (`styles/checkbox-radio/README.md`).

## Design: building blocks

### Header nav

Figma: [Header nav](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=315-3038) (variants Type × Icon × Active).

| Variant | Label | Icon |
|---------|-------|------|
| Type=Default, Active=No  | Lexia Regular 14px / 16px, #4F5555 (color/fg/default) | `chevron-down`, 20 × 20px, 4px after the label |
| Type=Default, Active=Yes | Lexia Regular 14px / 16px, #D0006F (color/fg/brand) | `chevron-up` (flipped), 20 × 20px |
| Type=Simple, Active=No   | Lexia Regular 14px / 16px, #4F5555 | none |
| Type=Simple, Active=Yes  | Lexia Regular 14px / 16px, #D0006F | none |

- Item: 34px high, 8px top/bottom and 16px left/right padding, 4px between label and chevron.
- Default items open a panel (Mega-menu); Simple items are plain links to a page.
- The chevron takes the label colour (magenta when active).

### Header language

Figma: [Header_Language Item](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=315-3255) (State = Default · Active) and [.Header_Language selector](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=315-3268) (DE | EN | FR | IT).

| State | Label |
|-------|-------|
| Default | Lexia Medium 12px / 16px, #4F5555 (color/fg/default), underlined, upper case (e.g. "DE") |
| Active (current language) | Lexia Medium 12px / 16px, #D0006F (Text-Interaction), underlined |

- Selector: the items in a row, 16px high. Each item except the last has 8px right padding and a 1px #4F5555 line on its right (the "|" separator); the next item starts 8px after the line.
- 2, 3 or 4 languages.

### Header disclaimer

Figma: [Header_Disclaimer](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=315-3171) (Breakpoint = Desktop · Tablet · Mobile).

| Breakpoint | Size | Padding | Text |
|------------|------|---------|------|
| Desktop | 1440 × 34px | 8px top/bottom; text area up to 1180px, centred | one line |
| Tablet  | 768 × 34px  | 8px top/bottom | one line |
| Mobile  | 375 × 52px  | 8px top/bottom, 16px left/right | wraps onto two lines |

- Background #EFEDEC (color/theme); text Inter Regular 12px / 18px, #4F5555 (color/fg/default), centred.
- Example: "This website is intended for UK Healthcare Professionals only. Other UK residents please visit astrazeneca.co.uk"

## Design: assembled header

Figma: [Header](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=339-436) (Breakpoint = Desktop · Tablet · Mobile) and [Example of usage](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=339-1879).

| Row | Desktop (1440) | Tablet (768) | Mobile (375) |
|-----|----------------|--------------|--------------|
| Disclaimer (optional) | 34px | 34px | 52px |
| Utility row: Contact us \| AZ Employee Login, language selector (right-aligned) | 32px, 8px top/bottom, 128px left/right | hidden | hidden |
| Main row: logo, nav, controls | 66px (12px padding, 42px content, 1px #B0B5B5 top/bottom lines), 128px left/right | 66px, 32px left/right | 66px, 16px left/right |

- Logo: AstraZeneca, 126 × 30px, links to the home page.
- Nav: centred on the page; Header nav items (see building blocks).
- Controls (12px apart): search icon button (28 × 28px, 20px icon), profile icon button (`user-circle` + chevron, 52 × 28px), Login button (global Secondary, Medium 42px). Tablet/mobile: search + menu icon (`bars`).
- Utility links: "Contact us" Lexia Medium 12px / 16px, "AZ Employee Login" Lexia Regular 12px / 16px, both underlined, #4F5555, separated by a 1px line; then the language selector 16px after.

### Mega-menu (from the usage example)

- Full-width panel directly under the header, background #F2F2F2, 40px padding, content up to 1360px.
- Up to four columns separated by 1px #B0B5B5 lines; each column has rows (Lexia Regular 16px / 20px, #4F5555, 8px / 16px padding, 4px corners).
- Row hover (highlighted in the example): background #D0D2D2 (color/surface/hover), text #830051 (color/fg/title). The current page's row uses the same look.
- 24px below the columns: "View all {section} →" link, Inter Bold 16px / 24px, #D0006F, underlined, `arrow-right` icon, 16px left padding.

### Profile dropdown (from the usage example)

- 120px wide, background #F2F2F2, shadow 0 4px 6px -1px rgb(0 0 0 / 10%), right-aligned under the profile button, flush with the bottom of the header.
- Rows: Lexia Regular 16px / 20px, centred, 8px / 16px padding, 1px #B0B5B5 line between rows.

## Implementation

- `blocks/header/header.js` loads the nav document (`/nav`, or the page's `Nav` metadata) and builds the header from it (see Authoring).
- Desktop layout from 1024px; below that, the nav, utility row, profile and Login move into the menu panel opened by the menu icon (see `figma-breakpoints`).
- **Default** nav items are buttons that open their Mega-menu (`aria-expanded`); the label turns magenta and the chevron flips (`chevron-up`) while open. Only one panel is open at a time; Escape or a click outside closes it.
- **Simple** nav items are links; the item for the current page (or its section) is shown Active.
- Mega-menu links are spread over up to four columns in order.
- The profile button opens the Dropdown with the profile links.
- Language selector: the current language (first URL segment such as `/de/`, otherwise the page language) is shown Active.
- The header reserves 66px (tablet/mobile) or 98px (desktop) so the page doesn't jump while it loads; a disclaimer adds its own height.
- `SHOW_PROFILE` and `SHOW_LOGIN` at the top of `header.js` switch the profile menu and the Login button; both are on, as in the Figma component. The usage examples show Login when logged out and the profile when logged in, which can be wired to a sign-in state once one exists.
- **Tablet/mobile menu panel:** not designed in Figma. It's built from the Dropdown: each Default item is a List item group row (tap to expand its links, chevron right → down), Simple items and profile links are rows, then the utility links, languages and the Login button.

## Authoring

The nav document (`/nav` in Document Authoring), separated into sections with `---`:

```
[AstraZeneca logo image, linked to /]
---
- Products                       (a link to /products adds "View all products →")
  - List item example            (links: the Mega-menu)
  - …
- Therapeutic Areas
  - Respiratory & Immunology
  - …
- News                           (a plain link: Simple item)
---
Contact us                       (link)
AZ Employee Login                (link)
DE  EN  FR  IT                   (links; two letters = language selector)
:search:                         (linked to the search page, default /search)
- :user-circle: Profile          (the profile menu)
  - Item 1 / Item 2 / Item 3     (links)
**Login**                        (bold link = Login button)
---
This website is intended for UK Healthcare Professionals only. … (optional disclaimer)
```

- Keep three to five top-level items.
- A market can use its own nav document with the page metadata `Nav` (e.g. `/ch/nav`).
