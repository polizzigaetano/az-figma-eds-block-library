const VARIANTS = ['home-hero', 'text-image'];
const SIZES = ['small', 'medium', 'large'];

/**
 * Collects the authored content of a row, wrapping loose text in paragraphs.
 * @param {Element} row A block row
 * @returns {Element[]} The row's content elements
 */
function getRowContent(row) {
  const elements = [];
  [...row.children].forEach((cell) => {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        elements.push(node);
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        elements.push(p);
      }
    });
  });
  return elements;
}

const PRIORITIES = ['primary', 'secondary', 'tertiary', 'ghost'];

/**
 * Uses the global buttons (styles/button/README.md) for links that sit alone in a paragraph.
 * Formatted links are already buttons; an unformatted link becomes a ghost button here.
 * @param {Element} container The content wrapper
 * @param {object} options `primaryOnly` shows every button as primary, `size` adds a size class
 */
function decorateTeaserButtons(container, { primaryOnly = false, size } = {}) {
  container.querySelectorAll('a[href]').forEach((a) => {
    const p = a.closest('p');
    if (!p || p.textContent.trim() !== a.textContent.trim()) return;
    // image links stay links; icons don't count as images
    if ([...a.querySelectorAll('img')].some((img) => !img.closest('.icon'))) return;

    if (!a.classList.contains('button')) {
      p.className = 'button-wrapper';
      a.classList.add('button', 'ghost');
      if (p.firstElementChild !== a) p.replaceChildren(a);
      a.querySelectorAll('.icon img').forEach((img) => {
        img.closest('.icon').style.setProperty('--icon-url', `url("${img.src}")`);
      });
      if (!a.textContent.trim()) {
        a.classList.add('icon-only');
        const name = [...(a.querySelector('.icon')?.classList || [])].find((c) => c.startsWith('icon-'));
        if (!a.getAttribute('aria-label') && name) a.setAttribute('aria-label', name.slice(5).replace(/-/g, ' '));
      }
    }

    if (primaryOnly) {
      a.classList.remove(...PRIORITIES);
      a.classList.add('primary');
    }
    if (size) a.classList.add(size);
  });
}

export default function decorate(block) {
  if (!VARIANTS.some((variant) => block.classList.contains(variant))) {
    block.classList.add('home-hero');
  }
  const isHomeHero = block.classList.contains('home-hero');
  if (isHomeHero && !SIZES.some((size) => block.classList.contains(size))) {
    block.classList.add('large');
  }

  const rows = [...block.children];

  // the first picture anywhere in the block is the teaser image
  const picture = block.querySelector('picture');
  if (picture) {
    const pictureParent = picture.parentElement;
    picture.remove();
    if (pictureParent.tagName === 'P' && !pictureParent.textContent.trim()) {
      pictureParent.remove();
    }
  }

  const contentRows = rows.map(getRowContent).filter((elements) => elements.length);

  // with the "blocked" option, the last row holds the blocked content message
  const isBlocked = block.classList.contains('blocked') && contentRows.length > 1;
  const blockedElements = isBlocked ? contentRows.pop() : [];

  const content = document.createElement('div');
  content.className = 'teaser-content';
  content.append(...contentRows.flat());
  // Home Hero: only Large Primary buttons; Text+Image: any priority, Medium
  decorateTeaserButtons(content, { primaryOnly: isHomeHero, size: isHomeHero ? 'large' : undefined });

  block.replaceChildren();

  if (picture) {
    const media = document.createElement('div');
    media.className = 'teaser-media';
    media.append(picture);
    block.append(media);
  } else {
    block.classList.add('no-image');
  }

  block.append(content);

  if (isBlocked) {
    const blocked = document.createElement('div');
    blocked.className = 'teaser-blocked';
    blocked.append(...blockedElements);
    // Figma Blocked Content: Large Primary "Login" button
    decorateTeaserButtons(blocked, { primaryOnly: true, size: 'large' });
    content.inert = true;
    block.append(blocked);
  } else {
    block.classList.remove('blocked');
  }
}
