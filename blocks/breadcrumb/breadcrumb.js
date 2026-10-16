import { getMetadata } from '../../scripts/aem.js';

const HOME_LABEL = 'Home';

/**
 * Turns a URL segment into a readable label, e.g. "therapeutic-areas" → "Therapeutic Areas".
 * @param {string} segment A URL path segment
 * @returns {string} The label
 */
function toLabel(segment) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}

/**
 * Reads the title of a page, cached for the session.
 * @param {string} path The page path
 * @returns {Promise<string|null>} The page title, or null if the page doesn't exist
 */
async function fetchTitle(path) {
  const key = `breadcrumb-title:${path}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached !== null) return cached || null;
  } catch { /* storage unavailable */ }

  let title = null;
  try {
    const resp = await fetch(path);
    if (resp.ok) {
      const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
      title = doc.querySelector('meta[property="og:title"]')?.content
        || doc.querySelector('title')?.textContent
        || null;
      title = title?.trim() || null;
    }
  } catch { /* keep the fallback label */ }

  try {
    sessionStorage.setItem(key, title || '');
  } catch { /* storage unavailable */ }
  return title;
}

/**
 * Builds the trail from the current URL: Home, each ancestor page, then the current page.
 * @returns {{ label: string, href?: string }[]} The trail items
 */
function getTrail() {
  const segments = window.location.pathname.split('/').filter((s) => s && s !== 'index');
  const items = [{ label: HOME_LABEL, href: '/' }];
  segments.forEach((segment, i) => {
    const href = `/${segments.slice(0, i + 1).join('/')}`;
    items.push({ label: toLabel(segment), href, segment });
  });
  // the current page is not a link and uses its own title
  const current = items[items.length - 1];
  delete current.href;
  current.label = getMetadata('og:title') || document.title || current.label;
  return items;
}

export default function decorate(block) {
  const items = getTrail();

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  const list = document.createElement('ol');
  list.className = 'breadcrumb-list';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'breadcrumb-item';
    if (item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.setAttribute('aria-current', 'page');
      span.textContent = item.label;
      li.append(span);
    }
    list.append(li);
  });

  nav.append(list);
  block.replaceChildren(nav);

  // ancestor titles load in the background so the breadcrumb never delays the page
  items.forEach((item, i) => {
    if (!item.href || !item.segment) return;
    fetchTitle(item.href).then((title) => {
      const link = list.children[i].querySelector('a');
      if (title) {
        link.textContent = title;
      } else {
        // no page at this level: keep the URL-based label, but don't link to a missing page
        const span = document.createElement('span');
        span.className = 'breadcrumb-missing';
        span.textContent = link.textContent;
        link.replaceWith(span);
      }
    });
  });
}
