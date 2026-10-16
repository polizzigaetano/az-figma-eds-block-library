# Footer

Footer block from the oneAZ Design System (Figma: [Footer documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=471-10349)).

COMPONENTS / FOOTER

**Closing block for every page:** brand, purpose, legal and regulatory links, social channels and the approval reference.

## Specs

The specs below are copied word for word from the Figma Footer documentation.

### Breakpoints

| Breakpoint | Width   | Height        |
|------------|---------|---------------|
| Desktop    | 1440 px | 292 px high   |
| Tablet     | 768 px  | 415 px        |
| Mobile     | 375 px  | 636 px        |

Example content (all breakpoints): AstraZeneca logo; "The AstraZeneca portal was created with the intention of proposing a space for digital dialogue between doctors, specialists and the company."; links Privacy Notice, Cookie Notice, Prescribing Information, Important Safety Information, Legal Statement, Site Map, AstraZeneca, Contact Us; LinkedIn, Facebook, YouTube, Instagram and X icons; reference code XX-XXXX-01/2025.

Desktop: brand block and two link columns. Tablet: brand text above two link columns. Mobile: single stack.

### Properties

| Property       | Available values                                                    |
|----------------|---------------------------------------------------------------------|
| Property 1     | Desktop · Tablet · Mobile                                           |
| Intro text     | Free text                                                           |
| Link labels    | Free text; 8 slots in the library example (two columns of four)     |
| Social icons   | LinkedIn · Facebook · YouTube · Instagram · X (show/hide per channel) |
| Reference code | Free text (job code / date, e.g. XX-XXXX-01/2025)                   |

The Footer is built from atoms. Content is local to each market; the structure is fixed.

### Usage

Include every legal and regulatory link your market requires, and always show the approval reference. Keep link labels identical to the page titles they open.

Reference: myastrazeneca.ch lists Cookie policy, Contact, Privacy notice, Terms of use, Report side effects, Report quality complaint, Medical enquiries, an HCP-only statement and "Revision date 05/2026 CH-12812".

### Configure an instance

1. Insert Footer and choose Breakpoint.
2. Edit the intro text.
3. Edit link labels; remove unused ones.
4. Show or hide social icons.
5. Update the reference code to the current approval.

## Design

Figma: [Footer](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=339-2264) (variants Property 1 = Desktop · Tablet · Mobile).

| Breakpoint | Padding | Layout | Gaps |
|------------|---------|--------|------|
| Desktop (1440) | 40px top/bottom, 128px left/right (content 1184px) | one row: brand, links, links, each 300px wide, spread across the row | 48px above the bottom row |
| Tablet (768) | 32px | brand (full width) above two 300px link columns at opposite edges | 45px brand → links, 48px above the bottom row |
| Mobile (375) | 24px top/bottom, 16px left/right | single stack: brand, links, links | 45px between parts, 48px above the bottom row |

- Background #FFFFFF, 1px #F2F2F2 border at the top.
- Brand: AstraZeneca logo 126 × 30px, then the intro text 16px below.
- Intro text and links: Inter Regular 16px / 24px, #4F5555 (color/fg/default); 16px between links.
- Bottom row: social icons on the left (20 × 20px, 16px apart, #4F5555), approval reference on the right (Inter Medium 12px / 18px, #4F5555), aligned to the bottom.

## Implementation

- The block loads the footer document (`/footer`, or the page's `Footer` metadata) and rebuilds it into the oneAZ layout:
  - **Section 1** → brand (logo + intro text).
  - **Middle sections** → link columns, one per section; every link becomes one item.
  - **Last section** (if it contains icon links) → bottom row: icon links become the social icons, the remaining text becomes the approval reference.
- Social links are icon-only, so they get an accessible name from the icon: LinkedIn, Facebook, YouTube, Instagram, X.
- Social icons come from the site's icons (`linked-in`, `facebook`, `youtube`, `instagram`, `x`) and are tinted #4F5555.
- Links have no underline; hover underlines them and keyboard focus shows a 2px #830051 outline (color/stroke/focus). Figma defines no hover or focus state.
- Desktop columns start at the page content edge (1184px content, 128px from the edge at 1440px).

## Authoring

The footer document (`/footer` in Document Authoring), separated into sections with `---`:

```
[AstraZeneca logo image]
The AstraZeneca portal was created with the intention of proposing a space for digital dialogue between doctors, specialists and the company.
---
Privacy Notice              (link)
Cookie Notice               (link)
Prescribing Information     (link)
Important Safety Information (link)
---
Legal Statement             (link)
Site Map                    (link)
AstraZeneca                 (link)
Contact Us                  (link)
---
:linked-in: :facebook: :youtube: :instagram: :x:   (each icon is a link to the channel)
XX-XXXX-01/2025
```

- Content is local to each market; the structure is fixed. Each market's footer document follows this layout.
- Keep link labels identical to the titles of the pages they open.
- Hide a social channel by leaving out its icon link.
- A market can use a different footer document with the page metadata `Footer` (e.g. `/ch/footer`).

## Notes

- The logo in Figma is only available as a PNG (252 × 60px for 126 × 30px). A vector SVG logo from the brand team would be sharper.
- Inter falls back to Arial until the font files are added, so the intro text can wrap onto an extra line (the desktop footer is 315px instead of 292px high in the preview).
