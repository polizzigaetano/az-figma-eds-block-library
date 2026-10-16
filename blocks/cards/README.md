# Cards

Cards block from the oneAZ Design System: a **Cards Container** that holds **Card items**. Card items have variants.

The block is dynamic: its cards come from site pages selected by page tags, ordered from the newest page to the oldest.

This block replaces the starter template's Cards block (decision 2026-10-16).

Figma: [Usage examples and documentation](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=768-13638)

## Usage examples and documentation

The text below is copied word for word from the Figma "Usage examples and documentation" page.

### Primary teaser card

One primary button per card, maximum — the single action that matters most to the patient, HCP, or caregiver in that moment. Everything else defers to it. In healthcare UI this matters even more: users are often making decisions under stress or time pressure, so a clear hierarchy reduces the chance of clicking the wrong thing.

Example cards (image, heading "The most inspiring heading", subheading "A subheading that addresses the what, the why we should care and hopefully some social proof.", one action): Primary button · Secondary button · Tertiary button · Link.

#### 1. Primary button

**Appearance:** solid fill, high contrast.
**Use case:** the one action the card exists to drive usually something time-sensitive, safety-relevant, or the intended conversion point.

**Examples:**

- Appointment card → "Confirm appointment" / "Book now"
- Medication reminder card → "Mark as taken"
- Telehealth card → "Join video visit"
- HCP portal card → "Prescribe" / "Send referral"
- Clinical trial card → "Check eligibility"

**Do:** reserve for the action with real consequence (booking, confirming, taking medication, joining a visit).

**Don't:** use primary styling for a "Learn more" or anything non-committal that undersells what primary should mean, and overselling it elsewhere trains users to click without reading.

#### 2. Secondary button

**Appearance:** outlined or lightly filled, lower contrast than primary.
**Use case:** a real, valid alternative path not the card's main action, but still consequential.

**Examples:**

- Appointment card → "Confirm" (primary) + "Reschedule" (secondary)
- Medication card → "Mark as taken" (primary) + "Log a side effect" (secondary)
- Telehealth card → "Join video visit" (primary) + "Message my care team" (secondary)
- HCP resource card → "Prescribe" (primary) + "View full prescribing information" (secondary)

**Do:** use it for actions patients or HCPs genuinely need close at hand, like rescheduling or reporting a symptom.

**Don't:** bury a safety-relevant action (like reporting a side effect or adverse event) as tertiary or a plain link if it has clinical weight, it deserves at least secondary treatment, even if it isn't the card's main action.

#### 3. Tertiary button

**Appearance:** minimal, often text-only.
**Use case:** low-commitment, reversible, or housekeeping actions.

**Examples:**

- Appointment card → "Add to calendar," "Cancel"
- Notification/reminder card → "Snooze," "Dismiss"
- Patient portal card → "Hide this reminder"

**Do:** use for genuinely low-stakes housekeeping.

**Don't:** use tertiary styling for anything that could delay care or be safety-relevant (e.g. never make "Report a symptom" tertiary just because it's optional optional and low-stakes are not the same thing in a medical context).

#### 4. Link style

**Appearance:** plain text, no button container.
**Use case:** navigating to more information without taking an action.

**Examples:**

- Medication card → "View dosage instructions," "Read full prescribing information"
- Clinical trial card → "View study details"
- HCP resource card → "Download clinical data sheet"
- Appointment card → "Directions to clinic"

**Do:** use for reference material package inserts, study protocols, directions where the user is reading, not acting.

**Don't:** use a link for anything that changes a patient

> The Figma text ends here ("…changes a patient"); the rest of the sentence is missing in the source.

### Article list and Teaser list example card

Scenario where the card has no CTA button, and no body text, only an image and a long title.

Example: a container of three cards, each with an image, a long title (e.g. "Advanced Cardiac Risk Stratification and Preventive Intervention Strategy for Patients with Atherosclerotic Cardiovascular Disease") and a "Link text" link.

### Teaser card with two buttons

**Scenario 1.** The teaser card has two buttons. One CTA button and a Link button.

**Scenario 2.** The CTA button and the link button have longer labels. In this case the behavior of the buttons will not overlap, but will position themselves one on top of the other.

Examples: a card with the title in brand magenta, a Primary button "Advanced Cardiac Risk" and a link "Intervention Strategy" side by side (Scenario 1), and a narrower card where they stack (Scenario 2).

### Personalized example card

Scenario where the card is personalized based on a custom scenario

Example: a card with an image, a label "Event" above the title, a long title and an "Intervention Strategy" link.

### Different sized buttons

Scenario where the card has buttons with different sizes. Note: the link button has the same size for "Large" and "Medium" (not aware of this is intended or not)

Examples: Large, Medium and Small cards, each with a Primary button and a "Link text" link.

## Design

### Cards Container

Figma: [Cards Container](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=772-14572) (variants Mobile = False · True).

| Variant | Frame | Padding | Cards area | Layout | Gap |
|---------|-------|---------|------------|--------|-----|
| Mobile=False (desktop, 1440) | 1440px | 20px top/bottom, 16px left/right | max 1180px, centred | one row, cards share the width equally (3 cards → 382.67px each) | 16px |
| Mobile=True | 391px | 20px top/bottom, 16px left/right | full width (359px) | one column, cards stacked | 16px |

- No background on the container itself.
- The Figma example shows three cards per container on both variants.
- The Mobile=True frame is 391px wide (359px cards + 2 × 16px), not the usual 375px; the 16px side padding is what carries over to a 375px screen (343px cards).
- No Tablet variant of the container is defined in Figma yet.

### Card item

Figma: [Card](https://www.figma.com/design/bPHhjDPGtrBR97OfQdj2tj/OneAZ-Design-System-Pilot?node-id=124-2286) (variants Breakpoint = Desktop · Tablet · Mobile). The cards inside the Cards Container use the same values.

| Breakpoint | Card width in Figma | Image height | Content padding |
|------------|---------------------|--------------|-----------------|
| Desktop    | 527px | 220px | 24px |
| Tablet     | 527px | 220px | 24px |
| Mobile     | 375px | 188px | 24px top/bottom, 16px left/right |

Desktop and Tablet are identical. In a container the card takes the width of its column.

- Card: background #EBEFEE (color/surface/secondary), corner radius 8px, content clipped to the corners.
- Image: full card width, at the top.
- Content: 16px between the text group and the controls; 16px between tag, title and body.
- Title: Lexia Regular 24px / 31px, #D0006F (color/fg/brand).
- Body: Inter Regular 18px / 27px, #4F5555 (color/fg/default).
- Controls: one row, the button at the start and the link at the end, wrapping onto a new line when they don't fit, 16px gap. Default button: Medium Primary (42px), optional left/right icons.

#### Optional parts (hidden by default in Figma)

| Part | Where | Design |
|------|-------|--------|
| Card Tag (e.g. "Event") | above the title | Inter Bold 18px / 23px, #4F5555 (color/fg/default) |
| Card Chip (e.g. "Chip label") | over the image, 16px from the top and left edges | pill (fully rounded), 28px high, 8px left/right padding, background #830051 (color/surface/brand 2), Inter Regular 16px / 24px, #F2F2F2 (color/fg/on-inverse) |
| Link | in the controls row, after the button | plain text link: Inter Bold 16px / 24px, #4F5555, underlined, optional left/right 20px icons with a 4px gap, no button container |
| Blocked Content | covers the whole card | the same Blocked Content overlay as the Teaser: dark overlay, title "Blocked Content", text "Don't have an account? Register here", Large Primary "Login" button |

- The **Link** is a plain underlined text link, which is different from the global Ghost button (Ghost has padding, a 42px height and a hover background, and no underline). The card's "Link style" uses this Link design.

## Notes for implementation

- The "Link style" action is the Card item's **Link** (plain underlined text, see above), not the global Ghost button.
- The documentation describes Tertiary as "minimal, often text-only", while the global Button component's Tertiary has a grey border. The Card item design will confirm which one applies.

## Dynamic block

Decisions (2026-10-16):

- **Selection:** authors pick one or more **Tags** and an optional **Count** (default 3). A card is shown for each page that has at least one of the tags.
- **Order:** newest first by the page's **Publication Date** (page metadata, set by authors to the page's creation date). Pages without one use their last-modified date. The page creation date itself isn't recorded by Document Authoring or the index, so it can't be read automatically.
- **Page index:** set up in the site configuration (`/query-index.json`, applied 2026-10-16). Only **published** pages appear in it.

Index properties read by the block:

| Property | From the page's metadata | Used for |
|----------|--------------------------|----------|
| `title` | Title (`og:title`) | card title |
| `description` | Description | card body |
| `image` | Image (`og:image`) | card image |
| `tags` | Tags (`article:tag`) | filtering |
| `category` | Category | Card Tag above the title (e.g. "Event") |
| `date` | Publication Date (`publication-date`) | newest-first order |
| `lastModified` | (automatic) | order fallback |

## Layout

| Screen | Columns | Card |
|--------|---------|------|
| Mobile (< 768px) | 1 | 188px image, 24px / 16px padding |
| Tablet (768–1023px) | 2 | 220px image, 24px padding |
| Desktop (≥ 1024px) | 3 | 220px image, 24px padding |

- Container: 20px top/bottom and 16px left/right padding, cards area up to 1180px, 16px between cards.
- More cards than columns wrap onto new rows. Cards in a row have equal height and their controls line up at the bottom.
- Figma has no Tablet container, so tablet uses two columns (three would make cards about 224px wide).

## Authoring

### Dynamic cards (from page tags)

| Cards | |
|-------|--|
| Tags | Respiratory, Asthma |
| Count | 3 |
| Button text | Book now |
| Link text | View study details |

- **Tags**: one or more tags, separated by commas (not case-sensitive). Leave it out to list the newest pages of the whole site.
- **Count**: how many cards (default 3).
- **Button text** (optional): adds a Medium Primary button that opens the page. Following the usage guidance, use it only for a real action, not "Learn more".
- **Link text** (optional, default "Read more"): the Link-style text link that opens the page.
- **Index** (optional): a different index, e.g. `/news/query-index.json`.
- The page the container is on is never listed in it.
- A container with no matching pages is hidden.

Each listed page needs this in its Metadata block:

| Metadata | Example |
|----------|---------|
| Title | Asthma |
| Description | A subheading that addresses the what… |
| Image | (an image) |
| Tags | Respiratory, Asthma |
| Publication Date | 2026-10-10 |
| Category (optional) | Event |

After a page is published, it appears in the index and in matching containers.

### Authored cards

A Cards block whose rows aren't settings shows hand-written cards: each row is one card, with the image in the first cell and the text in the second (heading, body, then a button or link on its own line). Buttons follow the global button rules (bold = Primary, italic = Secondary, bold italic = Tertiary, underlined = Ghost); an unformatted link on its own line becomes the card's Link.

## Implementation

- `blocks/cards/cards.js` reads the settings rows (`Tags`, `Count`, `Button text`, `Link text`, `Index`). If every row is a setting, it lists pages from the index; otherwise it renders authored cards.
- The index is loaded in the background (all pages of it, 500 entries at a time), so the cards never hold up the rest of the page.
- Card images use optimised `<picture>` sources and have empty alt text, since the card title already names the page.
- Buttons use the global button styles (`styles/button/README.md`); the Link style is defined in the block.

## Not yet implemented

- **Card Chip** and **Blocked Content** (designed, hidden by default in Figma): no page metadata has been chosen for them yet.
- Button icons and Tertiary/Ghost buttons in dynamic cards (authored cards support them).

## Fonts

Titles use Lexia and other text uses Inter (the AstraZeneca fonts in `fonts/`).
