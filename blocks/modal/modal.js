import { loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Vertical alignment below 768px (Mobile); Horizontal from 768px unless the author chose Vertical
const isWide = window.matchMedia('(width >= 768px)');

const TYPES = ['text-only', 'text-image', 'slot'];

function el(tag, className, ...children) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.append(...children);
  return element;
}

function icon(name) {
  const span = el('span', `icon icon-${name}`);
  span.setAttribute('aria-hidden', 'true');
  span.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
  return span;
}

let idCounter = 0;

/**
 * Slot component: an image carousel with the two arrow controls.
 * @param {Element[]} pictures Images
 * @returns {{ carousel: Element, arrows: Element|null }} The carousel and its arrows
 */
function buildCarousel(pictures) {
  const carousel = el('div', 'modal-carousel');
  const track = el('ul', 'modal-slides');
  pictures.forEach((picture, i) => {
    const slide = el('li', 'modal-slide', picture);
    if (pictures.length > 1) {
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${pictures.length}`);
    }
    slide.hidden = i > 0;
    track.append(slide);
  });
  carousel.append(track);
  if (pictures.length < 2) return { carousel, arrows: null };

  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('aria-label', 'Images');
  const status = el('p', 'modal-carousel-status');
  status.setAttribute('aria-live', 'polite');
  carousel.append(status);

  let current = 0;
  const show = (index) => {
    current = (index + pictures.length) % pictures.length;
    [...track.children].forEach((slide, i) => { slide.hidden = i !== current; });
    status.textContent = `Image ${current + 1} of ${pictures.length}`;
  };

  const arrow = (direction, label, step) => {
    const button = el('button', `modal-arrow modal-arrow-${direction}`, icon(`arrow-${direction}`));
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => show(current + step));
    return button;
  };
  const arrows = el('div', 'modal-arrows', arrow('left', 'Previous image', -1), arrow('right', 'Next image', 1));
  return { carousel, arrows };
}

/**
 * Modal: heading, description, close control, actions; Type = Text Only, Text + Image or
 * Slot component (image carousel). See README.md.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const pictures = [...block.querySelectorAll('picture')];
  const links = [...block.querySelectorAll('a[href]')];
  const description = [...block.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, a') && p.textContent.trim());

  // Type: an option, otherwise from the images (none: Text Only, one: Text + Image, more: Slot)
  if (block.classList.contains('slot-component')) block.classList.add('slot'); // "Slot component"
  let type = TYPES.find((t) => block.classList.contains(t));
  if (!type) {
    if (!pictures.length) type = 'text-only';
    else type = pictures.length === 1 ? 'text-image' : 'slot';
    block.classList.add(type);
  }
  const forcedVertical = block.classList.contains('vertical');

  // header: heading + close
  const header = el('div', 'modal-header');
  if (heading) {
    heading.classList.add('modal-title');
    heading.id = heading.id || `modal-title-${idCounter += 1}`;
    header.append(heading);
  }
  const close = el('button', 'button ghost icon-only modal-close', icon('close'));
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.addEventListener('click', () => block.closest('dialog')?.close());
  header.append(close);

  const text = el('div', 'modal-description', ...description);

  // actions: bold = Primary, italic = Secondary (global buttons); other links = Tertiary link
  const buttons = el('div', 'modal-buttons');
  links.forEach((a) => {
    if (!a.classList.contains('button') || a.classList.contains('ghost')) a.className = 'modal-link';
    buttons.append(a);
  });
  const actions = el('div', 'modal-actions');
  if (buttons.children.length) actions.append(buttons);

  const parts = [];
  if (type === 'text-image' && pictures[0]) {
    parts.push(el('div', 'modal-image', pictures[0]), header, text, actions);
  } else if (type === 'slot' && pictures.length) {
    const { carousel, arrows } = buildCarousel(pictures);
    if (arrows) actions.prepend(arrows);
    parts.push(el('div', 'modal-content', header, text), carousel, actions);
  } else {
    parts.push(el('div', 'modal-content', header, text), actions);
  }
  block.replaceChildren(...parts.filter((part) => part !== actions || actions.children.length));

  const align = () => {
    const vertical = forcedVertical || !isWide.matches;
    block.classList.toggle('vertical', vertical);
    block.classList.toggle('horizontal', !vertical);
  };
  align();
  isWide.addEventListener('change', align);
}

/**
 * Opens a modal page (e.g. /modals/confirm) as a modal dialog over the page.
 * @param {string} url Link to the modal page
 */
export async function openModal(url) {
  const { pathname } = new URL(url, window.location);
  const fragment = await loadFragment(pathname);
  if (!fragment) return;

  const block = fragment.querySelector('.modal');
  const dialog = el('dialog', 'modal-dialog');
  if (block) {
    dialog.append(block);
  } else {
    // a page without the Modal block: show its content as a Text Only modal
    await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
    const fallback = el('div', 'modal text-only block');
    fallback.append(...fragment.querySelectorAll(':scope > .section > *'));
    decorate(fallback);
    dialog.append(fallback);
  }
  const title = dialog.querySelector('.modal-title');
  if (title) dialog.setAttribute('aria-labelledby', title.id);

  // a click on the backdrop (outside the modal) closes it
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialog.remove();
  });

  document.body.append(dialog);
  document.body.classList.add('modal-open');
  dialog.showModal();
}
