const SIZES = ['small', 'large'];
const STATES = ['light', 'dark', 'active'];

/**
 * Builds the trailing close icon in the same way the page's icons are decorated.
 * @returns {HTMLSpanElement} The icon
 */
function buildCloseIcon() {
  const icon = document.createElement('span');
  icon.className = 'icon icon-close';
  icon.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/close.svg")`);
  return icon;
}

/**
 * Removes a chip and moves keyboard focus to the next chip (or the previous one).
 * @param {HTMLLIElement} chip The chip to remove
 */
function removeChip(chip) {
  const list = chip.parentElement;
  const sibling = chip.nextElementSibling || chip.previousElementSibling;
  chip.remove();
  const target = sibling?.querySelector('a, button');
  if (target) {
    target.focus();
  } else if (list) {
    list.closest('.chips')?.setAttribute('hidden', '');
  }
}

export default function decorate(block) {
  // defaults: Large, Light
  const size = SIZES.find((s) => block.classList.contains(s)) || 'large';
  const state = STATES.find((s) => block.classList.contains(s)) || 'light';
  const removable = block.classList.contains('removable');

  const list = document.createElement('ul');
  list.className = 'chips-list';

  [...block.children].forEach((row) => {
    const cell = row.firstElementChild;
    if (!cell || !cell.textContent.trim()) return; // the chip label is mandatory

    const chip = document.createElement('li');
    chip.className = `chip ${size} ${state}`;

    // label: the authored text, with optional leading/trailing :icons: and an optional link
    const link = cell.querySelector('a');
    const content = link || document.createElement('span');
    if (!link) {
      content.className = 'chip-label';
      const source = cell.querySelector('p') || cell;
      content.append(...source.childNodes);
    } else {
      link.className = '';
    }
    content.querySelectorAll('.icon').forEach((icon) => {
      const img = icon.querySelector('img');
      if (img) icon.style.setProperty('--icon-url', `url("${img.src}")`);
    });
    chip.append(content);

    if (removable) {
      const label = content.textContent.trim();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip-remove';
      button.setAttribute('aria-label', `Remove ${label}`);
      button.append(buildCloseIcon());
      button.addEventListener('click', () => removeChip(chip));
      chip.append(button);
    }

    list.append(chip);
  });

  block.replaceChildren(list);
}
