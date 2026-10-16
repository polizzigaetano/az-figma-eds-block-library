# Media Container

Media Container block from the oneAZ Design System (Figma: [Media container](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=928-325&m=dev)).

## Specs

The specs below are copied word for word from the oneAZ Design System.

A container for imagery with an optional play indicator. Use it to place media in desktop, tablet, and mobile page layouts. Use it to place imagery in a dedicated media area within a page.

Breakpoint offers Desktop and Tablet, or Mobile layouts.

The exposed nested Image Placeholder offers Image type: Orange, Mixed, Blue, Login, or Email. Its Video control shows or hides the play indicator.

Choose the matching breakpoint and review the image crop, especially in the narrower Mobile layout.

### Properties

| Property                          | Available values                       |
|-----------------------------------|----------------------------------------|
| Breakpoint                        | Desktop and Tablet · Mobile            |
| Image Placeholder / Image type    | Orange · Mixed · Blue · Login · Email  |
| Image Placeholder / Video         | Shows or hides the play indicator      |

The properties table is a summary of the specs above; it adds nothing new.

## Design

Values from the Figma component (928:325).

| Breakpoint                            | Frame        | Image area |
|---------------------------------------|--------------|------------|
| Desktop and Tablet (`928:323`)        | 1440px wide  | Full width up to 1180px, 600px tall, centred |
| Mobile (`928:324`)                    | 375px wide   | 343 × 375px (full width minus 16px each side) |

| Part           | Value |
|----------------|-------|
| Image          | Fills the area, no corners, cropped to fit |
| Play indicator | 84 × 62px, `#00000080` (50% black), 4px corners, centred on the image |
| Play triangle  | 29 × 38.5px, #EFEFEF, 31px from the badge's left edge (3.5px right of centre, optical centring) |

- **Image type** (Orange, Mixed, Blue, Login, Email) only swaps the sample picture in Figma; there's no other visual difference, so it isn't a block option. Authors add their own image.
- The play indicator is the same as the Teaser's (Text+Image).

## Implementation

- Mobile: 375px tall, 16px side padding. From 768px (tablet and desktop): 600px tall, 32px side padding (the site's tablet padding), and at most 1180px wide.
- The image is cropped from its centre (`object-fit: cover`) to fill the area, so the same image works for both shapes. Keep the main subject near the centre, especially for the narrower Mobile crop.
- The play indicator is decorative (hidden from screen readers) and doesn't block clicks.
- With a video link, the whole media area becomes that link, named after the link text (or "Play video"), with a visible focus ring. Without a link, the `video` option shows the indicator as design only, like the Teaser.
- The block spans the full section width, so it ignores the section's own padding and width (`.media-container-wrapper`).

## Authoring

| Media Container |
|-----------------|
| image           |
| link to the video (optional) |

- Add one image with alt text that describes it.
- **Video:** add the `video` option (`Media Container (video)`) to show the play indicator, or add a second row with a link to the video. With a link, clicking the image opens the video, and the link text names it for screen readers ("Play the product video").
- **Design only for now:** the video isn't played inside the block; a link opens the video page.
- Test page: `/content/media-container` (image, `video`, and a video link).
