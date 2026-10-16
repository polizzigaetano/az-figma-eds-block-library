# Teaser

Teaser block from the oneAZ Design System (Figma: [Teaser / Home Hero](https://www.figma.com/design/CAuVIZz6eBwyImzrhLmoWK/OneAZ-Design-System-Pilot?node-id=124-2112)).

## Breakpoints

| Layout  | Design width | Applies from                          |
|---------|--------------|---------------------------------------|
| Mobile  | 375px        | default, up to 767px                  |
| Tablet  | 768px        | 768px to 1023px                       |
| Desktop | 1440px       | 1024px and up, capped at 1440px wide  |

## Variants

### Home Hero

#### Functional specs

- A home hero is a banner that introduces the homepage’s main message and next action.
- Use it at the top of the homepage to highlight key content.
- Available in Small, Medium, and Large sizes, with desktop and mobile layouts. For tablet, use the same component as Desktop and adjust width accordingly.
- Contains a background image, dark overlay, headline, supporting text, and primary button.
- Choose the size and device layout, replace the image and text, and update the button label to match the action. Button is optional, and if being used, use only primary button. Adjust size of button as per need.

#### Specs

- **Title:** text-6xl/font-normal for desktop and tablets, text-4xl/font-normal for mobile.
- **Subheading:** text-lg/font-normal.
- **Button:** Large, Primary button.
- Title, subheading and button are separated by 16px (spacing/4).

| Size   | Desktop and tablet height | Mobile height |
|--------|---------------------------|---------------|
| Large  | 480px                     | 480px         |
| Medium | 390px                     | 390px         |
| Small  | 270px                     | 350px         |

Heights are minimums. The banner grows if the content needs more room.

#### Blocked content

- Use blocked content component when content needs to be blocked to those without access/those not logged in.
- Component contains a dark overlay on top of which rests a title (H4), body (text-base/font-normal), and a primary button (adjust size as per need).
- Title, body, and button are separated by 16px (spacing/4).
- **Design only for now:** the overlay is shown when the author adds the `blocked` option. There is no login or access check yet.

### Text+Image

#### Functional specs

- Combines an image, heading, supporting text, and button to introduce content and offer a next step.
- Offers three screen layouts, with the image on either side for desktop and tablet, and above the text for mobile.
- The image, heading, body text, and button label are editable; nested controls adjust button style and icons or show a play icon for videos.
- Blocked Content shows an overlay with a registration message and Login button.
- Left and Right control the image position, not text alignment; there is no Mobile Right variant.
- **Design only for now:** the video play icon is visual only. Clicking it doesn't play a video yet.

## Authoring

| Teaser (Home Hero, Large) |
|---------------------------|
| background image          |
| title (H1), subheading, **bold link** for the button |

- Block options: `home-hero` (default variant), size `small`, `medium` or `large` (default `large`), and `blocked`.
- With `blocked`, add a last row with the blocked content: an H4 title, body text and a link for the button.
- Buttons use the global button styles (see `styles/button/README.md`).
  - **Home Hero** and **Blocked Content**: every link that sits alone in a paragraph is shown as a Large Primary button (54px).
  - **Text+Image**: Medium buttons (42px) in any priority. Use a bold link for Primary, italic for Secondary, bold italic for Tertiary, and an underlined or unformatted link for Ghost. Icons can go inside the link text, e.g. `:chevron-up: Button text`.

## Fonts

Headings use Lexia and body text uses Inter (the AstraZeneca fonts in `fonts/`, see `styles/fonts.css`).
