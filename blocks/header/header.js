import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// desktop layout from 1024px (see figma-breakpoints); tablet and mobile use the menu icon
const isDesktop = window.matchMedia('(width >= 1024px)');

// show the profile menu and the Login button (the Figma component shows both)
const SHOW_PROFILE = true;
const SHOW_LOGIN = true;

const MEGAMENU_COLUMNS = 4;

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
 * Reads the main navigation list (nav document section 2).
 * @param {Element} section The section
 * @returns {object[]} Items: { label, href, type, links: [{ label, href }] }
 */
function readNavItems(section) {
  const list = section?.querySelector('ul');
  if (!list) return [];
  return [...list.children].map((li) => {
    const sub = li.querySelector(':scope > ul');
    const ownLink = [...li.querySelectorAll(':scope > a, :scope > p > a, :scope > strong > a')][0];
    const label = (ownLink?.textContent
      || [...li.childNodes].filter((n) => n !== sub).map((n) => n.textContent).join(' ')).trim();
    const links = sub ? [...sub.querySelectorAll('a')].map((a) => ({ label: a.textContent.trim(), href: a.getAttribute('href') })) : [];
    return {
      label,
      href: ownLink?.getAttribute('href'),
      type: sub ? 'default' : 'simple',
      links,
    };
  }).filter((item) => item.label);
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

function buildMegaMenu(item, id) {
  const panel = el('div', 'header-megamenu');
  panel.id = id;
  panel.hidden = true;
  const inner = el('div', 'header-megamenu-inner');
  const columns = el('div', 'header-megamenu-columns');
  const perColumn = Math.ceil(item.links.length / MEGAMENU_COLUMNS) || 1;
  for (let c = 0; c < MEGAMENU_COLUMNS; c += 1) {
    const links = item.links.slice(c * perColumn, (c + 1) * perColumn);
    if (links.length) {
      const ul = el('ul', 'header-megamenu-column');
      links.forEach(({ label, href }) => {
        const a = el('a', 'header-list-row', label);
        a.href = href || '#';
        if (isCurrent(href)) a.setAttribute('aria-current', 'page');
        ul.append(el('li', '', a));
      });
      columns.append(ul);
    }
  }
  inner.append(columns);
  if (item.href) {
    const all = el('a', 'header-megamenu-all', `View all ${item.label.toLowerCase()}`, icon('arrow-right'));
    all.href = item.href;
    inner.append(all);
  }
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
  if (panel) panel.hidden = !open;
  toggle.closest('.header-item')?.classList.toggle('active', open);
  const chevron = toggle.querySelector('.icon-chevron-down, .icon-chevron-up');
  if (chevron) {
    const name = open ? 'chevron-up' : 'chevron-down';
    chevron.className = `icon icon-${name}`;
    chevron.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
  }
}

/**
 * Tablet/mobile panel: nav items as Dropdown "List item group" rows, then the tools.
 */
function buildMobilePanel(items, tools, id) {
  const panel = el('div', 'header-mobile-panel');
  panel.id = id;
  panel.hidden = true;
  const list = el('ul', 'header-mobile-list');
  items.forEach((item) => {
    const li = el('li', `header-mobile-item ${item.type}`);
    if (item.type === 'default') {
      const groupId = nextId('header-group');
      const button = el('button', 'header-list-row header-group-toggle', el('span', '', item.label), icon('chevron-right'));
      button.type = 'button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', groupId);
      const children = el('ul', 'header-group-children');
      children.id = groupId;
      children.hidden = true;
      [...item.links, ...(item.href ? [{ label: `View all ${item.label.toLowerCase()}`, href: item.href }] : [])]
        .forEach(({ label, href }) => {
          const a = el('a', 'header-list-row', label);
          a.href = href || '#';
          children.append(el('li', '', a));
        });
      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        children.hidden = !open;
        const chevron = button.querySelector('.icon');
        const name = open ? 'chevron-down' : 'chevron-right';
        chevron.className = `icon icon-${name}`;
        chevron.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
      });
      li.append(button, children);
    } else {
      const a = el('a', 'header-list-row', item.label);
      a.href = item.href || '#';
      if (isCurrent(item.href)) a.setAttribute('aria-current', 'page');
      li.append(a);
    }
    list.append(li);
  });
  if (SHOW_PROFILE && tools.profile) {
    tools.profile.items.forEach(({ label, href }) => {
      const a = el('a', 'header-list-row', label);
      a.href = href || '#';
      list.append(el('li', 'header-mobile-item simple', a));
    });
  }
  panel.append(list);

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
  if (extras.children.length) panel.append(extras);
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

  // tablet/mobile menu
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
    mobilePanel.hidden = !open;
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
