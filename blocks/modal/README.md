# Modal

Modal block from the oneAZ Design System (Figma: [Modal](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=661-2592&m=dev)).

COMPONENTS / MODAL

## Specs

The specs below are copied word for word from the oneAZ Design System.

A modal is a secondary window that appears on top of the main content, requiring user interaction. Use for focused content with related actions, a heading, supporting text, and a close control.

Type offers Text Only, Text + Image, and Slot component; Alignment offers Horizontal and Vertical, with all six combinations present.

User Vertical alignment for Mobile and similar small breakpoints.

Edit heading and description text directly; exposed Image Placeholder properties configure the nested image component, while nested action controls let you change labels and show or hide actions. Arrows toggles both arrow controls in Slot component variants only; button and link states belong to nested components, not the modal.

### Properties

| Property                  | Available values                                   |
|---------------------------|----------------------------------------------------|
| Type                      | Text Only · Text + Image · Slot component          |
| Alignment                 | Horizontal · Vertical (all six combinations exist) |
| Heading, description      | Free text                                          |
| Image Placeholder         | Exposed properties of the nested image component   |
| Actions                   | Labels editable; each action can be shown or hidden |
| Arrows                    | Shows or hides both arrow controls (Slot component only) |

The properties table is a summary of the specs above; it adds nothing new.

## Design

Values from the Figma Modal component set (624:6090).

| Variant (Type, Alignment) | Width | Height in Figma |
|---------------------------|-------|-----------------|
| Text Only, Horizontal | 568px | 212px |
| Text Only, Vertical | 380px | 322px |
| Slot component, Horizontal | 568px | 436px |
| Slot component, Vertical | 380px | 576px |
| Text + Image, Horizontal | 568px | 296px |
| Text + Image, Vertical | 380px | 508px |

| Part | Value |
|------|-------|
| Card | `color/surface/white` #FFFFFF, 24px padding, 24px between parts, 12px corners, 1px #B0B5B5 stroke (inside) |
| Header | Heading Lexia Regular 24/31, `color/fg/title` #830051; close button 42 × 42px with a 20px `close` icon (#4F5555), 24px after the heading |
| Description | Inter Regular 16/24, `color/fg/default` #4F5555, 8px below the header |
| Buttons | Global Medium buttons (42px), 10px apart: Primary, Secondary; Tertiary is a Link (Inter Bold 16/24, #4F5555, underlined) |
| Horizontal actions | In a row, left-aligned |
| Vertical actions | Stacked, full width; the Link is centred |
| Slot component | Image 200px tall, full width; two `.Carousel / Arrows` controls: 40px circles, 2px #D0006F stroke, 20px `arrow-left` / `arrow-right` in #D0006F. Horizontal: arrows on the right of the buttons, 12px apart. Vertical: arrows above the buttons at either edge, 24px gap |
| Text + Image, Horizontal | Image 190 × 248px on the left, 24px gap; beside it heading, description and the buttons right-aligned at the bottom (Secondary, then Primary on the right) |
| Text + Image, Vertical | Heading, then a 180px image, description and stacked buttons, 24px apart |

- Overlay and placement aren't in the design: the modal is centred over a #3F4444 75% overlay (the Teaser overlay colour).
- With the AstraZeneca fonts loaded, five variants match the Figma heights exactly (212, 322, 436, 576, 508px). Text + Image Horizontal is 316px instead of 296px: "A short modal heading" needs 248px but the heading area is 240px, so it wraps (in Figma the text runs past its box).

## Implementation

- **Opening:** a link to a modal page (any path containing `/modals/`, e.g. `/modals/hcp-confirm`) opens that page as a modal instead of navigating. `scripts/scripts.js` listens for those clicks and calls `openModal(url)` in `modal.js`.
- `openModal` loads the page as a fragment, puts its Modal block in a native `<dialog>` and shows it over the page. A page without a Modal block is shown as a Text Only modal.
- **Closing:** the close button, Escape, or a click on the overlay. Focus starts on the close button and returns to the link afterwards; the page behind doesn't scroll while it's open. The dialog is named by the modal heading.
- **Type** comes from the block option (`text-only`, `text-image`, `slot`) or, without one, from the images: none → Text Only, one → Text + Image, two or more → Slot component.
- **Alignment:** Vertical below 768px (Mobile), as the specs say. From 768px Horizontal, unless the author adds the `vertical` option.
- **Slot component:** an image carousel. Arrows show the previous / next image (it wraps around) and are only shown with two or more images ("Arrows" off with one). Screen readers hear "Image 2 of 3" when it changes.
- **Actions:** the global button styles (see `styles/button/README.md`): bold link = Primary, italic link = Secondary, a plain or underlined link = the Tertiary Link. Each action is just a link; add or remove links to show or hide actions.
- Button and link states (hover, pressed, focus) come from those components, not the modal.

## Authoring

Create the modal as its own page in a `modals` folder (e.g. `/modals/hcp-confirm`) with a Modal block:

| Modal (Text + Image) |
|----------------------|
| image (optional; two or more for the Slot component) |
| **heading** (H2) and description text |
| **Primary link**, *Secondary link*, Tertiary link (each optional) |

- Options: `Text Only`, `Text + Image`, `Slot component` (or leave it to the images), and `vertical` to use Vertical alignment on tablet and desktop too.
- Rows can be in any order; images, heading, text and links are picked up wherever they are.
- To open it, link to the modal page from any page, e.g. "[Learn more](/modals/hcp-confirm)".
- Modal pages are normal pages: don't link to them from navigation where visitors would expect a page.
- Test pages: `/content/modal` (all six variants and links that open `/content/modals/text-only`, `/content/modals/text-image` and `/content/modals/slot`).
