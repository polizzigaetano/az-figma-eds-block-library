import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// accessible names for icon-only social links
const SOCIAL_NAMES = {
  'linked-in': 'LinkedIn',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
};

/**
 * Collects the content of a footer section, without the section wrappers.
 * @param {Element} section A fragment section
 * @returns {Element[]} Its content elements
 */
function getContent(section) {
  const wrappers = section.querySelectorAll(':scope > div');
  const source = wrappers.length ? [...wrappers] : [section];
  return source.flatMap((wrapper) => [...wrapper.children]);
}

/**
 * Builds a column of links: every link in the section becomes one item.
 * @param {Element} section A fragment section
 * @returns {HTMLUListElement} The link column
 */
function buildLinkColumn(section) {
  const list = document.createElement('ul');
  list.className = 'footer-links';
  section.querySelectorAll('a').forEach((a) => {
    a.className = '';
    a.closest('.button-wrapper')?.classList.remove('button-wrapper');
    const li = document.createElement('li');
    li.append(a);
    list.append(li);
  });
  return list;
}

/**
 * Builds the bottom row: social icon links on the left, the approval reference on the right.
 * @param {Element} section A fragment section
 * @returns {HTMLDivElement} The bottom row
 */
function buildBottomRow(section) {
  const row = document.createElement('div');
  row.className = 'footer-bottom';

  const social = document.createElement('ul');
  social.className = 'footer-social';
  section.querySelectorAll('a').forEach((a) => {
    const icon = a.querySelector('.icon');
    if (!icon) return;
    const img = icon.querySelector('img');
    if (img) icon.style.setProperty('--icon-url', `url("${img.src}")`);
    const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.slice(5);
    if (!a.textContent.trim()) a.setAttribute('aria-label', SOCIAL_NAMES[name] || name);
    a.className = '';
    const li = document.createElement('li');
    li.append(a);
    social.append(li);
  });
  if (social.children.length) row.append(social);

  // the approval reference is the text that isn't a social link
  const reference = getContent(section)
    .filter((el) => !el.querySelector('a .icon'))
    .map((el) => el.textContent.trim())
    .filter(Boolean)
    .join(' ');
  if (reference) {
    const p = document.createElement('p');
    p.className = 'footer-reference';
    p.textContent = reference;
    row.append(p);
  }
  return row;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  // sections: 1 = brand (logo + intro), middle = link columns, last = social icons + reference
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const hasBottom = sections.length > 1 && !!sections.at(-1).querySelector('a .icon');
  const brandSection = sections[0];
  const bottomSection = hasBottom ? sections.at(-1) : null;
  const linkSections = sections.slice(1, hasBottom ? -1 : undefined);

  const inner = document.createElement('div');
  inner.className = 'footer-inner';

  const main = document.createElement('div');
  main.className = 'footer-main';

  if (brandSection) {
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    brand.append(...getContent(brandSection));
    main.append(brand);
  }

  linkSections.forEach((section) => main.append(buildLinkColumn(section)));
  inner.append(main);
  if (bottomSection) inner.append(buildBottomRow(bottomSection));

  block.replaceChildren(inner);
}
