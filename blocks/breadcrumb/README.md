# Breadcrumb

Breadcrumb block from the oneAZ Design System (Figma: [Breadcrumb documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=471-12328)).

COMPONENTS / BREADCRUMB

Show where the current page sits in the site hierarchy and let people step back up to a parent page.

## Specs

The specs below are copied word for word from the Figma Breadcrumb documentation.

### Breakpoints & states

| Breakpoint | Width   | Height      | Label size |
|------------|---------|-------------|------------|
| Desktop    | 1440 px | 40 px high  | 14 px      |
| Tablet     | 768 px  | 40 px high  | 14 px      |
| Mobile     | 375 px  | 32 px high  | 12 px      |

Example: Home ▸ Breadcrumb label ▸ Breadcrumb label

| Label · Desktop & Tablet | Label · Mobile |
|--------------------------|----------------|
| Default                  | Default        |
| Hover                    | Hover          |
| Active                   | Active         |

**Default:** ancestor page. **Hover:** pointer feedback with an underline in brand magenta. **Active:** the current page, magenta, not a link. Mobile has no hover.

### Properties

| Property           | Available values                                       |
|--------------------|--------------------------------------------------------|
| Breakpoint         | Desktop · Tablet · Mobile                              |
| Label / State      | Default · Hover · Active                               |
| Label / Breakpoint | Desktop & Tablet (14 px) · Mobile (12 px)              |
| Label text         | Free text                                              |
| Separator          | Nav-arrow-right icon between items (not editable)      |
| Items              | Add or remove Label instances to match page depth      |

Built from atoms: the Label is the building block; Breadcrumb assembles Labels and separators. Navigation happens in code.

### Usage

Start with Home and end with the current page. Each label matches the page title it opens. Use it on pages two or more levels deep; skip it on the home page.

Example: Home ▸ Therapeutic Areas ▸ Respiratory & Immunology ▸ Asthma

Illustrative path based on the URL structure of myastrazeneca.ch (startseite → therapiegebiete → ri → asthma). The site's own home page shows only "Home".

### Configure an instance

1. Insert Breadcrumb for the breakpoint.
2. Edit each Label's text.
3. Add or remove Labels to match page depth.
4. Keep the last Label in the Active state and the others Default.

Place it directly under the Header, aligned to the page content edge.

### Behaviour

**Behaviour:** Desktop & Tablet — click or tap a label to go to that page. Mobile, the trail scrolls horizontally when names are too long; tap a label to navigate.

Example: Home ▸ Products ▸ Oncology & Hematology ▸ Gastric Cancer

## Dynamic block

The breadcrumb must be dynamic: the trail is built automatically from the page's place in the site, so authors don't type or maintain the labels.

Decisions (2026-10-16):

- **Labels:** each label is the title of the page it opens. The block looks up each ancestor page's title automatically. If an ancestor page doesn't exist, the label falls back to a tidied-up URL segment (e.g. `therapeutic-areas` → "Therapeutic Areas").
- **Placement:** added automatically under the header on every page two or more levels deep, never on the home page. Authors can turn it off for a page with a page metadata setting.

## Design

### Breadcrumb label

Figma: [Breadcrumb label](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=354-2368) (variants State × Breakpoint).

| State   | Colour                     | Decoration | Element |
|---------|----------------------------|------------|---------|
| Default | #4F5555 (color/fg/default) | none       | link to an ancestor page |
| Hover   | #D0006F (color/fg/brand)   | underline  | link, pointer devices only |
| Active  | #D0006F (color/fg/brand)   | none       | current page, not a link |

| Breakpoint        | Font          | Size / line height |
|-------------------|---------------|--------------------|
| Desktop & Tablet  | Inter Regular | 14px / 16px        |
| Mobile            | Inter Regular | 12px / 16px        |

- Figma also has a Mobile Hover variant, but the specs say "Mobile has no hover", so hover only applies on devices with a mouse or trackpad.

### Breadcrumb bar

Figma: [Breadcrumb](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=354-2382) (variants Breakpoint = Desktop · Tablet · Mobile).

| Breakpoint | Bar height | Side padding | Content width | Gap label ↔ separator | Label |
|------------|-----------|--------------|---------------|-----------------------|-------|
| Desktop (1440) | 40px | 128px | 1184px | 8px | 14px / 16px |
| Tablet (768)   | 40px | 32px  | 704px  | 8px | 14px / 16px |
| Mobile (375)   | 32px | 16px  | 343px  | 2px | 12px / 16px |

- Background #FFFFFF (Background-Supporting-2), 1px border #EBEFEE (color/surface/secondary), full width.
- Separator: `navarrow-right` icon, 20 × 20px, #4F5555 (color/fg/default).
- Desktop content is capped at 1184px and centred, which gives the 128px side padding at 1440px.

## Implementation

- `scripts/scripts.js` (`buildBreadcrumbAutoBlock`) adds the Breadcrumb block at the top of the first section, directly under the header, on pages two or more levels deep (e.g. `/therapeutic-areas/asthma`). It never appears on the home page or on one-level pages.
- `blocks/breadcrumb/breadcrumb.js` builds the trail from the URL:
  - **Home** (links to `/`), then one item per URL level, then the current page.
  - The current page uses its own title, is magenta and is not a link (`aria-current="page"`).
  - Each ancestor label starts as the tidied-up URL segment, then is replaced by that page's title. Titles are read in the background, so the breadcrumb never slows down the page, and they're cached for the session.
  - If a level has no page, its label stays as the tidied-up segment and is shown as text, not as a link to a missing page.
- Markup: `<nav aria-label="Breadcrumb">` with an ordered list. Separators are drawn by CSS, so screen readers don't read them.
- Hover only applies on devices with a mouse or trackpad (`@media (hover: hover)`). Keyboard focus shows a 2px #830051 outline (color/stroke/focus).
- Mobile: a long trail scrolls sideways inside the bar; the page itself doesn't scroll.

## Authoring

- Nothing to author: the breadcrumb appears automatically and follows the page's URL and the titles of its parent pages.
- To hide it on a page, add **Breadcrumb** = `off` to the page's Metadata block.
- To change a label, change the title of the page it links to.

## Fonts

Labels use Inter (the AstraZeneca font in `fonts/`).
