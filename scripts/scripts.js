import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  buildBlock,
  getMetadata,
} from './aem.js';

if (window.trustedTypes && window.trustedTypes.createPolicy) {
  const innerTT = window.trustedTypes.createPolicy('tt-inner', {
    createHTML: (s) => s, // avoid stack overflow
  });

  window.trustedTypes.createPolicy('default', {
    createHTML: (input, type, sink) => {
      let processedInput = input;
      if (/srcdoc\s*=/i.test(processedInput)) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('iframe[srcdoc]').forEach((el) => el.removeAttribute('srcdoc'));
        processedInput = doc.body.innerHTML;
      }
      if (sink.includes('createContextualFragment') || sink.includes('Document write')) {
        const doc = new DOMParser().parseFromString(innerTT.createHTML(processedInput), 'text/html');
        doc.querySelectorAll('script').forEach((el) => el.remove());
        processedInput = doc.body.innerHTML;
      }
      return processedInput;
    },
    createScriptURL: (input) => input,
    createScript: (input) => input,
  });
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Turns `/widgets/...` links into widget blocks.
 * @param {Element} main The container element
 */
function buildWidgetAutoBlocks(main) {
  const widgetLinks = [...main.querySelectorAll('a[href*="/widgets/"]')];
  widgetLinks.forEach((link) => {
    if (link.closest('.widget')) return;
    const newLink = link.cloneNode(true);
    const widgetBlock = buildBlock('widget', { elems: [newLink] });
    const p = link.closest('p');
    if (
      p
      && p.querySelectorAll('a').length === 1
      && p.querySelector('a') === link
      && p.textContent.trim() === link.textContent.trim()
    ) {
      p.replaceWith(widgetBlock);
    } else {
      link.replaceWith(widgetBlock);
    }
  });
}

/**
 * Adds the dynamic breadcrumb at the top of the page (directly under the header)
 * on pages two or more levels deep. Turn it off per page with metadata "Breadcrumb: off".
 * @param {Element} main The container element
 */
function buildBreadcrumbAutoBlock(main) {
  const depth = window.location.pathname.split('/').filter((s) => s && s !== 'index').length;
  const setting = getMetadata('breadcrumb').toLowerCase();
  if (depth < 2 || ['off', 'false', 'no', 'hidden'].includes(setting)) return;
  if (main.querySelector('.breadcrumb')) return;
  const firstSection = main.querySelector(':scope > div');
  if (!firstSection) return;
  firstSection.prepend(buildBlock('breadcrumb', ''));
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }
    buildWidgetAutoBlocks(main);
    buildBreadcrumbAutoBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks (icons don't count as images)
    const images = [...a.querySelectorAll('img')].filter((img) => !img.closest('.icon'));
    const icons = [...a.querySelectorAll('.icon')];
    if (images.length || p.textContent.trim() !== text) return;
    if (!text && !icons.length) return;

    // skip URL display links
    try {
      if (text && new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    const u = a.closest('u') || a.querySelector('u');
    if (!strong && !em && !u) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    // icons are tinted with the label colour through a CSS mask
    icons.forEach((icon) => {
      const img = icon.querySelector('img');
      if (img) icon.style.setProperty('--icon-url', `url("${img.src}")`);
    });
    if (!text) {
      // Icon Only: the link needs an accessible name
      a.classList.add('icon-only');
      if (!a.getAttribute('aria-label')) {
        const name = [...icons[0].classList].find((c) => c.startsWith('icon-'));
        a.setAttribute('aria-label', a.title || (name ? name.slice(5).replace(/-/g, ' ') : 'button'));
      }
    }
    if (strong && em) { // bold italic: Priority Tertiary
      a.classList.add('tertiary');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else if (em) {
      a.classList.add('secondary');
      em.replaceWith(a);
    } else { // underline: Priority Ghost
      a.classList.add('ghost');
      if (u.contains(a)) u.replaceWith(a);
      else u.replaceWith(...u.childNodes);
    }
  });
}

/**
 * Adds the character counter (0/100) to oneAZ textareas with a maxlength,
 * in a bottom row next to the supportive text.
 * @param {Element} control The .input-field-control holding the textarea
 */
function decorateTextareaCounter(control) {
  const textarea = control.querySelector('textarea');
  const field = control.closest('.input-field');
  if (textarea.maxLength < 1 || !field || field.querySelector('.input-field-counter')) return;
  const bottom = document.createElement('div');
  bottom.className = 'input-field-bottom';
  const supportive = field.querySelector('.input-field-supportive');
  if (supportive) bottom.append(supportive);
  const counter = document.createElement('span');
  counter.className = 'input-field-counter';
  counter.id = `${textarea.id || textarea.name || 'textarea'}-counter`;
  bottom.append(counter);
  control.after(bottom);
  const describedBy = textarea.getAttribute('aria-describedby');
  textarea.setAttribute('aria-describedby', describedBy ? `${describedBy} ${counter.id}` : counter.id);
  const update = () => { counter.textContent = `${textarea.value.length}/${textarea.maxLength}`; };
  textarea.addEventListener('input', update);
  update();
}

/**
 * Adds the Clear icon (shown in Type in) to oneAZ input fields
 * and the character counter to textareas.
 * Blocks that build forms call this on their own markup.
 * @param {Element} container The element holding .input-field elements
 */
export function decorateInputFields(container) {
  container.querySelectorAll('.input-field-control').forEach((control) => {
    if (control.querySelector('textarea')) {
      decorateTextareaCounter(control);
      return;
    }
    const input = control.querySelector('input');
    if (!input || control.querySelector('.input-field-clear')) return;
    input.placeholder = input.placeholder || ' '; // :placeholder-shown drives Focused vs Type in
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'input-field-clear';
    clear.setAttribute('aria-label', 'Clear');
    // keep focus in the field, so Type in (and the icon) stays while clicking
    clear.addEventListener('mousedown', (e) => e.preventDefault());
    clear.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.focus();
    });
    control.append(clear);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateInputFields(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
/**
 * Links to a modal page (a path containing /modals/) open it as a modal dialog.
 * @param {Element} element The container to listen on
 */
function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');
    if (origin?.href && new URL(origin.href).pathname.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

async function loadLazy(doc) {
  autolinkModals(doc);
  loadHeader(doc.querySelector('body > header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('body > footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  import('./consent-check.js');
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
