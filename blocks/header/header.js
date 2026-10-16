import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// nav in the header from 768px (Desktop & Tablet Mega-menu); mobile uses the menu icon
const isDesktop = window.matchMedia('(width >= 768px)');

// show the profile menu and the Login button (the Figma component shows both)
const SHOW_PROFILE = true;
const SHOW_LOGIN = true;

// Mega-menu: cascading columns (area → indication → product …)
const MEGAMENU_COLUMNS = 4;
// pointer rest before a hovered row reveals its sub-items, so moving across rows doesn't flicker
const HOVER_DELAY = 150;

let idCounter = 0;
const nextId = (prefix) => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/**
 * Creates an element with a class and optional children.
 * @param {string} tag Tag name
 * @param {string} className Class name
 * @param {...(Node|string)} children Children
 * @returns {HTMLElement} The element
 */
function el(tag, className, ...children) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.append(...children);
  return element;
}

/**
 * Builds a mask-tinted icon (takes the text colour).
 * @param {string} name Icon name in /icons
 * @returns {HTMLSpanElement} The icon
 */
function icon(name) {
  const span = el('span', `icon icon-${name}`);
  span.setAttribute('aria-hidden', 'true');
  span.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
  return span;
}

/**
 * Lets authored icons (span.icon > img) be tinted through a CSS mask.
 * @param {Element} root Container
 */
function tintIcons(root) {
  root.querySelectorAll('.icon').forEach((span) => {
    const img = span.querySelector('img');
    if (img) span.style.setProperty('--icon-url', `url("${img.src}")`);
  });
}

const iconName = (link) => [...(link.querySelector('.icon')?.classList || [])]
  .find((c) => c.startsWith('icon-'))?.slice(5);

/**
 * Reads one list item and its nested list, recursively.
 * @param {Element} li The list item
 * @returns {object} { label, href, children, bold }
 */
function readNode(li) {
  const sub = li.querySelector(':scope > ul');
  const ownLink = li.querySelector(':scope > a, :scope > p > a, :scope > strong > a, :scope > p > strong > a');
  const label = (ownLink?.textContent
    || [...li.childNodes].filter((n) => n !== sub).map((n) => n.textContent).join(' ')).trim();
  return {
    label,
    href: ownLink?.getAttribute('href'),
    bold: !!ownLink?.closest('strong'),
    children: sub ? [...sub.children].map(readNode).filter((node) => node.label) : [],
  };
}

/**
 * Reads the main navigation list (nav document section 2).
 * A nav item with a nested list opens a Mega-menu; deeper lists are its cascading levels.
 * A bold link last in the first level is the Link button ("View all …").
 * @param {Element} section The section
 * @returns {object[]} Items: { label, href, type, children, all }
 */
function readNavItems(section) {
  const list = section?.querySelector('ul');
  if (!list) return [];
  return [...list.children].map(readNode).filter((item) => item.label).map((item) => {
    const last = item.children.at(-1);
    let all = null;
    if (last?.bold && last.href && !last.children.length) {
      all = { label: last.label, href: last.href };
      item.children.pop();
    } else if (item.href && item.children.length) {
      all = { label: `View all ${item.label.toLowerCase()}`, href: item.href };
    }
    return { ...item, type: item.children.length ? 'default' : 'simple', all };
  });
}

/**
 * Reads the tools section (nav document section 3).
 * @param {Element} section The section
 * @returns {object} { utility, languages, search, profile, login }
 */
function readTools(section) {
  const tools = {
    utility: [], languages: [], search: null, profile: null, login: null,
  };
  if (!section) return tools;

  // profile: an icon link or icon text followed by a list of menu items
  section.querySelectorAll('li').forEach((li) => {
    const sub = li.querySelector(':scope > ul');
    if (sub && li.querySelector('.icon') && !tools.profile) {
      tools.profile = {
        label: li.textContent.replace(sub.textContent, '').trim() || 'Profile',
        items: [...sub.querySelectorAll('a')].map((a) => ({ label: a.textContent.trim(), href: a.getAttribute('href') })),
      };
      li.remove();
    }
  });

  section.querySelectorAll('a').forEach((a) => {
    const text = a.textContent.trim();
    const name = iconName(a);
    if (name === 'search') {
      tools.search = { href: a.getAttribute('href') || '/search', label: 'Search' };
    } else if (a.classList.contains('button') || a.closest('strong')) {
      tools.login = { href: a.getAttribute('href'), label: text || 'Login' };
    } else if (/^[A-Za-z]{2}$/.test(text)) {
      tools.languages.push({ label: text.toUpperCase(), href: a.getAttribute('href') });
    } else if (text) {
      tools.utility.push({ label: text, href: a.getAttribute('href') });
    }
  });

  // a :search: icon written without a link still links to /search
  if (!tools.search && section.querySelector('.icon-search')) tools.search = { href: '/search', label: 'Search' };
  return tools;
}

/**
 * Whether a link points to the current page or one of its parents.
 * @param {string} href Link
 * @returns {boolean} True when current
 */
function isCurrent(href) {
  if (!href) return false;
  try {
    const { pathname } = new URL(href, window.location);
    const here = window.location.pathname;
    return pathname === here || (pathname !== '/' && here.startsWith(`${pathname.replace(/\/$/, '')}/`));
  } catch {
    return false;
  }
}

/**
 * The rows to open so the current page's row is shown (when a panel opens).
 * @param {object[]} nodes Rows of one level
 * @returns {number[]|null} Index of the open row per level, or null when the page isn't here
 */
function currentPath(nodes) {
  for (let i = 0; i < nodes.length; i += 1) {
    const node = nodes[i];
    if (node.children.length) {
      const below = currentPath(node.children);
      if (below) return [i, ...below];
    } else if (isCurrent(node.href)) {
      return [];
    }
  }
  return null;
}

/**
 * The language currently shown: the first URL segment if it's a language code, else <html lang>.
 * @param {object[]} languages Language links
 * @returns {string} Upper-case code
 */
function currentLanguage(languages) {
  const first = window.location.pathname.split('/').filter(Boolean)[0]?.toUpperCase();
  if (languages.some((l) => l.label === first)) return first;
  return (document.documentElement.lang || '').slice(0, 2).toUpperCase();
}

function buildLanguageSelector(languages) {
  const current = currentLanguage(languages);
  const list = el('ul', 'header-languages');
  list.setAttribute('aria-label', 'Language');
  languages.forEach(({ label, href }) => {
    const a = el('a', '', label);
    a.href = href || '#';
    a.lang = label.toLowerCase();
    if (label === current) a.setAttribute('aria-current', 'true');
    list.append(el('li', '', a));
  });
  return list;
}

/**
 * A Mega-menu link row (a destination).
 * @param {object} node { label, href }
 * @returns {HTMLAnchorElement} The row
 */
function linkRow(node) {
  const a = el('a', 'header-list-row', node.label);
  a.href = node.href || '#';
  if (isCurrent(node.href)) a.setAttribute('aria-current', 'page');
  return a;
}

function buildLinkButton(all) {
  const a = el('a', 'header-megamenu-all', all.label, icon('arrow-right'));
  a.href = all.href;
  return a;
}

/**
 * Desktop & Tablet Mega-menu: cascading columns. Column 1 lists the item's rows; choosing a row
 * with sub-items (click, Enter, or resting the pointer on it) shows them in the next column.
 * @param {object} item Nav item
 * @param {string} id Panel id
 * @returns {HTMLElement} The panel, with reset() to call when it opens
 */
function buildMegaMenu(item, id) {
  const panel = el('div', 'header-megamenu');
  panel.id = id;
  panel.hidden = true;
  const inner = el('div', 'header-megamenu-inner');
  const columns = el('div', 'header-megamenu-columns');
  let path = [];
  let hoverTimer;

  const levelNodes = (level) => {
    let nodes = item.children;
    for (let l = 0; l < level; l += 1) nodes = nodes[path[l]]?.children || [];
    return nodes;
  };

  // shows the rows of a deeper level and hides the levels below it
  let render;
  const showLevel = (column, level, index) => {
    path = index === undefined ? path.slice(0, level) : [...path.slice(0, level), index];
    column.querySelectorAll('.header-list-parent').forEach((b) => {
      b.setAttribute('aria-expanded', String(Number(b.dataset.index) === index));
    });
    render(level + 1);
  };

  // pointer rest (mouse only) before a row changes the levels shown
  const onRest = (row, action) => {
    row.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(action, HOVER_DELAY);
    });
    row.addEventListener('pointerleave', () => clearTimeout(hoverTimer));
  };

  const buildColumn = (level, nodes) => {
    const column = el('ul', 'header-megamenu-column');
    nodes.forEach((node, index) => {
      let row;
      if (node.children.length && level < MEGAMENU_COLUMNS - 1) {
        row = el('button', 'header-list-row header-list-parent', node.label);
        row.type = 'button';
        row.dataset.index = index;
        row.setAttribute('aria-expanded', String(path[level] === index));
        const select = () => {
          if (path[level] !== index) showLevel(column, level, index);
        };
        row.addEventListener('click', select);
        onRest(row, select);
      } else {
        row = linkRow(node);
        // resting on a destination closes deeper levels opened from another row
        onRest(row, () => {
          if (path.length > level) showLevel(column, level);
        });
      }
      column.append(el('li', '', row));
    });
    return column;
  };

  // rebuilds the columns from `from` onwards; earlier columns (and the focused row) stay
  render = (from) => {
    [...columns.children].slice(from).forEach((column) => column.remove());
    for (let level = from; level < MEGAMENU_COLUMNS; level += 1) {
      const nodes = levelNodes(level);
      if (!nodes.length) break;
      columns.append(buildColumn(level, nodes));
    }
  };

  panel.reset = () => {
    path = currentPath(item.children) || [];
    render(0);
  };

  inner.append(columns);
  if (item.all) inner.append(buildLinkButton(item.all));
  panel.append(inner);
  return panel;
}

function buildProfile(profile) {
  const wrapper = el('div', 'header-profile');
  const id = nextId('header-profile');
  const button = el('button', 'header-icon-button header-profile-button', icon('user-circle'), icon('chevron-down'));
  button.type = 'button';
  button.setAttribute('aria-label', profile.label);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);
  const menu = el('ul', 'header-dropdown');
  menu.id = id;
  menu.hidden = true;
  profile.items.forEach(({ label, href }) => {
    const a = el('a', 'header-list-row', label);
    a.href = href || '#';
    menu.append(el('li', '', a));
  });
  wrapper.append(button, menu);
  return wrapper;
}

/**
 * Closes every open panel (Mega-menus and profile dropdown) except the one given.
 * @param {Element} nav The nav
 * @param {Element} [except] The toggle to keep open
 */
function closeAll(nav, except) {
  nav.querySelectorAll('.header-sections [aria-expanded="true"], .header-profile-button[aria-expanded="true"]').forEach((toggle) => {
    if (toggle === except) return;
    toggle.setAttribute('aria-expanded', 'false');
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));
    if (panel) panel.hidden = true;
    toggle.closest('.header-item')?.classList.remove('active');
  });
}

function togglePanel(nav, toggle) {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  closeAll(nav, toggle);
  toggle.setAttribute('aria-expanded', String(open));
  const panel = document.getElementById(toggle.getAttribute('aria-controls'));
  if (panel) {
    if (open) panel.reset?.();
    panel.hidden = !open;
  }
  toggle.closest('.header-item')?.classList.toggle('active', open);
  const chevron = toggle.querySelector('.icon-chevron-down, .icon-chevron-up');
  if (chevron) {
    const name = open ? 'chevron-up' : 'chevron-down';
    chevron.className = `icon icon-${name}`;
    chevron.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
  }
}

/**
 * Mobile panel (Mega-menu_Mobile): the nav items, then the tools. Rows with sub-items have a
 * chevron and open their level in place, with a Back button and the sub-category title.
 */
function buildMobilePanel(items, tools, id) {
  const panel = el('div', 'header-mobile-panel');
  panel.id = id;
  panel.hidden = true;
  const view = el('div', 'header-mobile-view');
  panel.append(view);
  let stack = []; // the rows opened, from the nav item down
  let returnLabel = null; // re-focus the row we came back from

  // a row: drills down when it has sub-items, otherwise a link
  const mobileRow = (node, depth) => {
    if (node.children.length) {
      const button = el('button', 'header-list-row header-list-parent', el('span', '', node.label), icon('chevron-right'));
      button.type = 'button';
      button.addEventListener('click', () => {
        stack = [...stack.slice(0, depth), node];
        // eslint-disable-next-line no-use-before-define
        render();
        view.querySelector('.header-mobile-back')?.focus();
      });
      return button;
    }
    return linkRow(node);
  };

  const buildRoot = () => {
    const list = el('ul', 'header-mobile-list');
    items.forEach((item) => list.append(el('li', '', mobileRow(item, 0))));
    if (SHOW_PROFILE && tools.profile) {
      tools.profile.items.forEach((node) => list.append(el('li', '', linkRow(node))));
    }
    const fragment = [list];
    const extras = el('div', 'header-mobile-extras');
    if (tools.utility.length) {
      const utility = el('ul', 'header-utility-links');
      tools.utility.forEach(({ label, href }) => {
        const a = el('a', '', label);
        a.href = href || '#';
        utility.append(el('li', '', a));
      });
      extras.append(utility);
    }
    if (tools.languages.length) extras.append(buildLanguageSelector(tools.languages));
    if (SHOW_LOGIN && tools.login) {
      const login = el('a', 'button secondary', tools.login.label);
      login.href = tools.login.href || '#';
      extras.append(login);
    }
    if (extras.children.length) fragment.push(extras);
    return fragment;
  };

  const buildLevel = () => {
    const node = stack.at(-1);
    const back = el('button', 'button tertiary small header-mobile-back', icon('arrow-left'), 'Back');
    back.type = 'button';
    back.addEventListener('click', () => {
      returnLabel = node.label;
      stack = stack.slice(0, -1);
      // eslint-disable-next-line no-use-before-define
      render();
    });
    const title = el('p', 'header-mobile-title', node.label);
    title.id = nextId('header-mobile-title');
    const list = el('ul', 'header-mobile-list');
    list.setAttribute('aria-labelledby', title.id);
    node.children.forEach((child) => list.append(el('li', '', mobileRow(child, stack.length))));
    const column = el('div', 'header-mobile-column', title, list);
    const fragment = [el('div', 'header-mobile-back-row', back), column];
    if (stack.length === 1 && node.all) fragment.push(el('div', 'header-mobile-all', buildLinkButton(node.all)));
    return fragment;
  };

  const render = () => {
    view.replaceChildren(...(stack.length ? buildLevel() : buildRoot()));
    if (returnLabel) {
      [...view.querySelectorAll('.header-list-parent')].find((b) => b.textContent.trim() === returnLabel)?.focus();
      returnLabel = null;
    }
  };

  panel.reset = () => {
    stack = [];
    render();
  };
  panel.reset();
  return panel;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  // nav document: 1 = brand, 2 = navigation, 3 = tools, 4 (optional) = disclaimer
  const sections = [...fragment.querySelectorAll(':scope > .section')];
  const [brandSection, navSection, toolsSection, disclaimerSection] = sections;
  tintIcons(fragment);
  const items = readNavItems(navSection);
  const tools = readTools(toolsSection);

  const nav = el('nav', 'header-nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main');

  // disclaimer
  const disclaimerText = disclaimerSection?.textContent.trim();
  if (disclaimerText) {
    const disclaimer = el('div', 'header-disclaimer');
    const inner = el('div', 'header-disclaimer-inner');
    inner.append(...[...disclaimerSection.querySelectorAll('p')].map((p) => p.cloneNode(true)));
    if (!inner.children.length) inner.append(el('p', '', disclaimerText));
    disclaimer.append(inner);
    nav.append(disclaimer);
    block.closest('header')?.classList.add('has-disclaimer');
  }

  // utility row (desktop): contact links | languages
  if (tools.utility.length || tools.languages.length) {
    const utility = el('div', 'header-utility');
    const inner = el('div', 'header-utility-inner');
    if (tools.utility.length) {
      const links = el('ul', 'header-utility-links');
      tools.utility.forEach(({ label, href }) => {
        const a = el('a', '', label);
        a.href = href || '#';
        links.append(el('li', '', a));
      });
      inner.append(links);
    }
    if (tools.languages.length) inner.append(buildLanguageSelector(tools.languages));
    utility.append(inner);
    nav.append(utility);
  }

  // main row
  const main = el('div', 'header-main');
  const mainInner = el('div', 'header-main-inner');

  const brand = el('div', 'header-brand');
  const brandLink = brandSection?.querySelector('a') || el('a');
  const logo = brandSection?.querySelector('picture, img');
  brandLink.className = '';
  brandLink.href = brandLink.getAttribute('href') || '/';
  if (logo && !brandLink.contains(logo)) brandLink.replaceChildren(logo);
  if (!brandLink.textContent.trim() && !logo) brandLink.textContent = 'Home';
  if (logo) brandLink.setAttribute('aria-label', logo.querySelector?.('img')?.alt || logo.alt || 'Home');
  brand.append(brandLink);

  const sectionsList = el('ul', 'header-sections');
  items.forEach((item) => {
    const li = el('li', `header-item ${item.type}`);
    if (item.type === 'default') {
      const panelId = nextId('header-megamenu');
      const button = el('button', 'header-item-label', item.label, icon('chevron-down'));
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', panelId);
      button.addEventListener('click', () => togglePanel(nav, button));
      li.append(button);
      main.append(buildMegaMenu(item, panelId));
    } else {
      const a = el('a', 'header-item-label', item.label);
      a.href = item.href || '#';
      if (isCurrent(item.href)) {
        a.setAttribute('aria-current', 'page');
        li.classList.add('active');
      }
      li.append(a);
    }
    sectionsList.append(li);
  });

  const controls = el('div', 'header-controls');
  if (tools.search) {
    const search = el('a', 'header-icon-button header-search', icon('search'));
    search.href = tools.search.href;
    search.setAttribute('aria-label', tools.search.label);
    controls.append(search);
  }
  if (SHOW_PROFILE && tools.profile) {
    const profile = buildProfile(tools.profile);
    profile.querySelector('button').addEventListener('click', (e) => togglePanel(nav, e.currentTarget));
    controls.append(profile);
  }
  if (SHOW_LOGIN && tools.login) {
    const login = el('a', 'button secondary header-login', tools.login.label);
    login.href = tools.login.href || '#';
    controls.append(login);
  }

  // mobile menu
  const mobileId = nextId('header-mobile');
  const menuButton = el('button', 'header-icon-button header-menu-toggle', icon('bars'));
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', mobileId);
  controls.append(menuButton);
  const mobilePanel = buildMobilePanel(items, tools, mobileId);
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuButton.replaceChildren(icon(open ? 'close' : 'bars'));
    if (open) mobilePanel.reset();
    mobilePanel.hidden = !open;
    nav.classList.toggle('header-menu-open', open);
  });

  mainInner.append(brand, sectionsList, controls);
  main.prepend(mainInner);
  main.append(mobilePanel);
  nav.append(main);

  // close panels on Escape, outside click and when switching layout
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = nav.querySelector('.header-sections [aria-expanded="true"], .header-profile-button[aria-expanded="true"]');
    if (open) {
      closeAll(nav);
      open.focus();
    } else if (menuButton.getAttribute('aria-expanded') === 'true') {
      menuButton.click();
      menuButton.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll(nav);
  });
  isDesktop.addEventListener('change', () => {
    closeAll(nav);
    if (menuButton.getAttribute('aria-expanded') === 'true') menuButton.click();
  });

  block.replaceChildren(nav);
}
