/**
 * Tabs: up to six text tabs; each shows one part of the page (the sections after the block
 * whose Section Metadata has a "Tab" label) and hides the others. See README.md.
 */

const MAX_TABS = 6;

let tabsCounter = 0;

const toId = (text) => text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/**
 * The tab label of a section: Section Metadata "Tab" (data-tab), or a section-metadata
 * block still in the section.
 * @param {Element} section A page section
 * @returns {string} The label, or an empty string
 */
function tabLabel(section) {
  if (section.dataset.tab) return section.dataset.tab.trim();
  const row = [...section.querySelectorAll('.section-metadata > div')]
    .find((r) => r.children[0]?.textContent.trim().toLowerCase() === 'tab');
  return row?.children[1]?.textContent.trim() || '';
}

/**
 * Tabs block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  tabsCounter += 1;
  const id = `tabs-${tabsCounter}`;
  const own = block.closest('.section');

  // the sections that follow, as long as they carry a tab label; one label can span sections
  const panels = [];
  let next = own?.nextElementSibling;
  while (next?.classList.contains('section')) {
    const label = tabLabel(next);
    if (!label) break;
    let panel = panels.find((p) => p.label === label);
    if (!panel) {
      if (panels.length === MAX_TABS) break;
      panel = { label, sections: [] };
      panels.push(panel);
    }
    panel.sections.push(next);
    next = next.nextElementSibling;
  }

  const list = document.createElement('div');
  list.className = 'tabs-list';
  list.setAttribute('role', 'tablist');
  const name = block.textContent.trim();
  if (name) list.setAttribute('aria-label', name);

  const tabs = panels.map((panel, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-tab';
    tab.id = `${id}-tab-${i}`;
    tab.textContent = panel.label;
    tab.setAttribute('role', 'tab');
    panel.slug = toId(panel.label) || `tab-${i + 1}`;
    panel.sections.forEach((section, s) => {
      section.classList.add('tabs-panel');
      section.setAttribute('role', 'tabpanel');
      section.setAttribute('aria-labelledby', tab.id);
      if (!section.id) section.id = `${id}-panel-${i}${s ? `-${s}` : ''}`;
    });
    tab.setAttribute('aria-controls', panel.sections.map((section) => section.id).join(' '));
    list.append(tab);
    return tab;
  });

  const select = (index, { focus = false, updateHash = false } = {}) => {
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].sections.forEach((section) => { section.hidden = !selected; });
    });
    const tab = tabs[index];
    // keep the selected tab in view when the row scrolls (mobile)
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (focus) tab.focus();
    if (updateHash) window.history.replaceState(null, '', `#${panels[index].slug}`);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i, { updateHash: true }));
    // arrow keys move between tabs (and show them), Home / End jump to the first / last
    tab.addEventListener('keydown', (e) => {
      const keys = {
        ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1,
      };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select((keys[e.key] + tabs.length) % tabs.length, { focus: true, updateHash: true });
    });
  });

  block.replaceChildren(list);
  if (!tabs.length) return;

  // the first tab starts selected, unless the address points at another (e.g. #overview)
  const fromHash = panels.findIndex((p) => p.slug === window.location.hash.slice(1));
  select(fromHash > -1 ? fromHash : 0);
}
