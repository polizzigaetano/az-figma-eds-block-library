import { createOptimizedPicture, readBlockConfig, toClassName } from '../../scripts/aem.js';

const INDEX_PATH = '/query-index.json';
const DEFAULT_COUNT = 3;
const DEFAULT_LINK_TEXT = 'Read more';
const CONFIG_KEYS = ['tags', 'count', 'link-text', 'button-text', 'index'];

const indexes = new Map();

/**
 * Loads every entry of a page index once per page view.
 * @param {string} indexPath Index URL (default /query-index.json)
 * @returns {Promise<object[]>} Index entries
 */
function loadIndex(indexPath = INDEX_PATH) {
  if (!indexes.has(indexPath)) {
    indexes.set(indexPath, (async () => {
      const entries = [];
      const limit = 500;
      let offset = 0;
      let total = Infinity;
      while (offset < total) {
        // eslint-disable-next-line no-await-in-loop
        const resp = await fetch(`${indexPath}?offset=${offset}&limit=${limit}`);
        if (!resp.ok) break;
        // eslint-disable-next-line no-await-in-loop
        const json = await resp.json();
        entries.push(...(json.data || []));
        total = json.total ?? entries.length;
        offset += limit;
        if (!json.data?.length) break;
      }
      return entries;
    })().catch(() => []));
  }
  return indexes.get(indexPath);
}

/**
 * Reads a list value from the index (stored as a JSON array or comma-separated text).
 * @param {string} value Raw value
 * @returns {string[]} Lower-cased items
 */
function toList(value) {
  if (!value) return [];
  let list = value;
  if (typeof value === 'string') {
    try {
      list = value.trim().startsWith('[') ? JSON.parse(value) : value.split(',');
    } catch {
      list = value.split(',');
    }
  }
  return list.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
}

/**
 * Newest first: Publication Date if set, otherwise the last-modified date.
 * @param {object} entry Index entry
 * @returns {number} Timestamp in milliseconds
 */
function getSortDate(entry) {
  const published = Date.parse(entry.date || '');
  if (!Number.isNaN(published)) return published;
  const modified = Number(entry.lastModified);
  return Number.isNaN(modified) ? 0 : modified * 1000;
}

/**
 * Builds one Card item.
 * @param {object} data Card content
 * @returns {HTMLLIElement} The card
 */
function buildCard({
  href, image, tag, title, description, actions,
}) {
  const li = document.createElement('li');
  li.className = 'cards-card';

  if (image) {
    const media = document.createElement('div');
    media.className = 'cards-card-image';
    media.append(image);
    li.append(media);
  }

  const body = document.createElement('div');
  body.className = 'cards-card-body';
  const text = document.createElement('div');
  text.className = 'cards-card-text';
  if (tag) {
    const tagEl = document.createElement('p');
    tagEl.className = 'cards-card-tag';
    tagEl.textContent = tag;
    text.append(tagEl);
  }
  if (title) {
    const heading = document.createElement('h3');
    heading.className = 'cards-card-title';
    heading.textContent = title;
    text.append(heading);
  }
  if (description) {
    const p = document.createElement('p');
    p.className = 'cards-card-description';
    p.textContent = description;
    text.append(p);
  }
  body.append(text);

  const controls = document.createElement('div');
  controls.className = 'cards-card-controls';
  (actions || []).forEach(({ label, kind }) => {
    if (!label || !href) return;
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    a.className = kind === 'link' ? 'cards-card-link' : `button ${kind}`;
    controls.append(a);
  });
  if (controls.children.length) body.append(controls);
  li.append(body);
  return li;
}

/**
 * Dynamic mode: newest pages matching the tags.
 */
async function renderFromIndex(list, config) {
  const tags = toList(config.tags);
  const count = Number.parseInt(config.count, 10) || DEFAULT_COUNT;
  const actions = [];
  if (config['button-text']) actions.push({ label: config['button-text'], kind: 'primary' });
  actions.push({ label: config['link-text'] || DEFAULT_LINK_TEXT, kind: 'link' });

  const current = window.location.pathname.replace(/\/index$/, '/') || '/';
  const entries = (await loadIndex(config.index || INDEX_PATH))
    .filter((entry) => entry.path && entry.path !== current && entry.title)
    .filter((entry) => !tags.length || toList(entry.tags).some((t) => tags.includes(t)))
    .sort((a, b) => getSortDate(b) - getSortDate(a))
    .slice(0, count);

  entries.forEach((entry) => {
    let image;
    if (entry.image && !entry.image.includes('default-meta-image')) {
      const src = new URL(entry.image, window.location.origin);
      // decorative: the card title right below already names the page
      image = createOptimizedPicture(`${src.pathname}${src.search}`, '', false, [{ width: '750' }]);
    }
    list.append(buildCard({
      href: entry.path,
      image,
      tag: entry.category,
      title: entry.title,
      description: entry.description,
      actions,
    }));
  });

  if (!entries.length) list.closest('.cards').classList.add('cards-empty');
}

/**
 * Authored mode: each row is a card (image cell + content cell).
 */
function renderAuthored(list, rows) {
  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-card';
    [...row.children].forEach((cell) => {
      if (cell.children.length === 1 && cell.querySelector('picture')) {
        cell.className = 'cards-card-image';
        const img = cell.querySelector('img');
        img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
      } else {
        cell.className = 'cards-card-body';
        const text = document.createElement('div');
        text.className = 'cards-card-text';
        const controls = document.createElement('div');
        controls.className = 'cards-card-controls';
        [...cell.children].forEach((el) => {
          if (el.classList.contains('button-wrapper')) {
            controls.append(...el.childNodes);
          } else if (el.matches('p') && el.children.length === 1 && el.querySelector('a') && el.textContent.trim() === el.querySelector('a').textContent.trim()) {
            const a = el.querySelector('a');
            a.className = 'cards-card-link';
            controls.append(a);
          } else {
            text.append(el);
          }
        });
        cell.replaceChildren(text);
        if (controls.children.length) cell.append(controls);
      }
      li.append(cell);
    });
    list.append(li);
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  // an empty block, or one with only setting rows, lists pages from the index
  const isConfig = rows.every((row) => CONFIG_KEYS.includes(
    toClassName(row.children[0]?.textContent || ''),
  ));

  const list = document.createElement('ul');
  list.className = 'cards-list';

  if (isConfig) {
    const config = readBlockConfig(block);
    block.replaceChildren(list);
    // the index loads in the background so the cards never hold up the rest of the page
    renderFromIndex(list, config);
  } else {
    renderAuthored(list, rows);
    block.replaceChildren(list);
  }
}
