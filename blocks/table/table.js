/**
 * Table: Simple or Complex Header, striped rows, Highlight cells, optional sorting,
 * header help tooltips and interactive checkboxes, radios and toggles. See README.md.
 */

// cell markers: [x] / [ ] checkbox, (x) / ( ) radio, [on] / [off] toggle
const MARKER = /^\s*(\[(x| )\]|\((x| )\)|\[(on|off)\])\s*/i;

let tableCounter = 0;

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

function setIcon(span, name) {
  span.className = `icon icon-${name}`;
  span.style.setProperty('--icon-url', `url("${window.hlx?.codeBasePath || ''}/icons/${name}.svg")`);
}

/** Authored cells are plain text or paragraphs; returns the paragraphs as nodes lists. */
function paragraphs(cell) {
  const ps = [...cell.children].filter((c) => c.tagName === 'P');
  return ps.length ? ps.map((p) => [...p.childNodes]) : [[...cell.childNodes]];
}

/** Removes a control marker from the start of the cell and returns it. */
function takeMarker(cell) {
  const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node && !node.textContent.trim()) node = walker.nextNode();
  const match = node?.textContent.match(MARKER);
  if (!match) return null;
  node.textContent = node.textContent.slice(match[0].length);
  const [, , box, radio, toggle] = match;
  if (box !== undefined) return { type: 'checkbox', checked: box.toLowerCase() === 'x' };
  if (radio !== undefined) return { type: 'radio', checked: radio.toLowerCase() === 'x' };
  return { type: 'toggle', checked: toggle.toLowerCase() === 'on' };
}

/** A cell whose whole text is bold is a Highlight cell; the text itself stays regular. */
function takeHighlight(cell) {
  const strongs = [...cell.querySelectorAll('strong, b')];
  const boldText = strongs.map((s) => s.textContent).join('').trim();
  if (!strongs.length || boldText !== cell.textContent.trim()) return false;
  strongs.forEach((s) => s.replaceWith(...s.childNodes));
  return true;
}

function buildControl(marker) {
  const input = document.createElement('input');
  input.type = marker.type === 'radio' ? 'radio' : 'checkbox';
  input.checked = marker.checked;
  if (marker.type === 'toggle') {
    input.className = 'table-toggle';
    input.setAttribute('role', 'switch');
  }
  return input;
}

/**
 * Help tooltip: a 16px help icon button; the text shows on hover and focus.
 * @param {Node[]} nodes Help text
 * @param {string} label Header label
 */
function buildHelp(nodes, label, id) {
  const wrapper = el('span', 'table-help');
  const button = el('button', 'table-help-button', icon('question-circle'));
  button.type = 'button';
  button.setAttribute('aria-label', `About ${label}`);
  const tip = el('span', 'table-tooltip', ...nodes);
  tip.id = id;
  tip.setAttribute('role', 'tooltip');
  button.setAttribute('aria-describedby', id);
  const hide = () => wrapper.classList.remove('open');
  button.addEventListener('click', () => wrapper.classList.toggle('open'));
  button.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  button.addEventListener('blur', hide);
  wrapper.append(button, tip);
  return wrapper;
}

/**
 * Fills a table cell: leading control or icon, label, help and sort controls.
 * @returns {object} { control, label }
 */
function fillCell(target, source, { header, helpId }) {
  const marker = takeMarker(source);
  const paras = paragraphs(source);
  // header cells: the first paragraph is the label, further paragraphs are help text
  const join = (list) => list.flatMap((p, i) => (i ? [document.createElement('br'), ...p] : p));
  const labelNodes = header ? paras[0] : join(paras);
  const helpNodes = header ? join(paras.slice(1)) : [];

  const content = el('div', 'table-cell-content');
  const label = el('span', 'table-label');
  // a leading icon (e.g. :heart:) stays in front of the label
  const lead = labelNodes.find((n) => n.nodeType === 1 && n.classList?.contains('icon'));
  const text = el('span', 'table-label-text', ...labelNodes.filter((n) => n !== lead));
  label.append(text);
  const labelText = text.textContent.trim();

  let control = null;
  if (marker) {
    control = buildControl(marker);
    content.append(control);
  } else if (lead) {
    lead.classList.add('table-icon');
    const img = lead.querySelector('img');
    if (img) lead.style.setProperty('--icon-url', `url("${img.src}")`);
    content.append(lead);
  }
  if (helpNodes.some((n) => n.textContent.trim())) {
    label.append(buildHelp(helpNodes, labelText, helpId));
  }
  if (labelText || label.children.length > 1) content.append(label);
  if (content.children.length) target.append(content);
  return { control, label, labelText };
}

/**
 * Header grid: an empty header cell after a label widens that label (colspan);
 * in Complex Header, an empty second-row cell under a label makes it span both rows.
 */
function buildHeader(rows, columns) {
  const placed = []; // [{ cell, row, col, colSpan, rowSpan }]
  rows.forEach((row, r) => {
    const cells = [...row.children];
    for (let c = 0; c < columns; c += 1) {
      const cell = cells[c];
      const empty = !cell || !cell.textContent.trim();
      const left = placed.findLast((p) => p.row === r && p.col + p.colSpan === c);
      const above = placed.find((p) => p.row === r - 1 && p.col <= c && c < p.col + p.colSpan);
      if (empty && r > 0 && above && above.rowSpan === 1 && above.colSpan === 1) {
        above.rowSpan = 2;
      } else if (empty && left && !(above && above.rowSpan > 1)) {
        left.colSpan += 1;
      } else if (!(above && above.rowSpan > 1 && above.col <= c && c < above.col + above.colSpan)) {
        placed.push({
          cell: cell || document.createElement('div'), row: r, col: c, colSpan: 1, rowSpan: 1,
        });
      }
    }
  });
  return placed;
}

function compareCells(a, b) {
  const x = a?.textContent.trim() || '';
  const y = b?.textContent.trim() || '';
  return x.localeCompare(y, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Table block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  tableCounter += 1;
  const id = `table-${tableCounter}`;
  const rows = [...block.children];
  if (!rows.length) return;
  const complex = block.classList.contains('complex') || block.classList.contains('complex-header');
  const sortable = block.classList.contains('sortable');
  const headerCount = Math.min(complex ? 2 : 1, rows.length);
  const columns = Math.max(...rows.map((r) => r.children.length));

  const table = el('table');
  const thead = el('thead');
  const tbody = el('tbody');
  const columnLabels = [];
  const headerControls = [];

  // header
  const headerRows = rows.slice(0, headerCount).map(() => el('tr'));
  buildHeader(rows.slice(0, headerCount), columns).forEach((p, i) => {
    const th = el('th');
    th.scope = p.colSpan > 1 ? 'colgroup' : 'col';
    if (p.colSpan > 1) th.colSpan = p.colSpan;
    if (p.rowSpan > 1) th.rowSpan = p.rowSpan;
    const { control, label, labelText } = fillCell(th, p.cell, { header: true, helpId: `${id}-help-${i}` });
    const bottom = p.row + p.rowSpan === headerCount;
    if (bottom && p.colSpan === 1) {
      columnLabels[p.col] = labelText;
      if (control) headerControls.push({ control, col: p.col });
      if (sortable && labelText) {
        const sort = el('button', 'table-sort', icon('sort'));
        sort.type = 'button';
        sort.dataset.col = p.col;
        sort.setAttribute('aria-label', `Sort by ${labelText}`);
        label.append(sort);
      }
    }
    if (control) control.setAttribute('aria-label', labelText ? `${labelText}: all rows` : 'All rows');
    headerRows[p.row].append(th);
  });
  thead.append(...headerRows);

  // body: striped by CSS; bold cells are Highlight
  rows.slice(headerCount).forEach((row, r) => {
    const tr = el('tr');
    const cells = [...row.children];
    const rowLabel = cells[0]?.textContent.replace(MARKER, '').trim();
    for (let c = 0; c < columns; c += 1) {
      const td = el('td');
      const source = cells[c] || document.createElement('div');
      if (takeHighlight(source)) td.classList.add('highlight');
      const { control, labelText } = fillCell(td, source, { header: false });
      if (control) {
        control.dataset.col = c;
        if (control.type === 'radio') control.name = `${id}-col-${c}`;
        if (labelText) {
          // the control and its text form one label
          const content = td.querySelector('.table-cell-content');
          const wrap = el('label', 'table-control', ...content.childNodes);
          content.append(wrap);
        } else {
          control.setAttribute('aria-label', [rowLabel || `Row ${r + 1}`, columnLabels[c]].filter(Boolean).join(', '));
        }
      }
      tr.append(td);
    }
    tbody.append(tr);
  });

  // a header checkbox or toggle switches its whole column
  headerControls.filter(({ control }) => control.type === 'checkbox').forEach(({ control, col }) => {
    const isSwitch = control.getAttribute('role') === 'switch';
    const column = () => [...tbody.querySelectorAll(`input[type="checkbox"][data-col="${col}"]`)];
    control.addEventListener('change', () => {
      column().forEach((input) => { input.checked = control.checked; });
    });
    tbody.addEventListener('change', (e) => {
      if (Number(e.target.dataset?.col) !== col || e.target.type !== 'checkbox') return;
      const inputs = column();
      control.checked = inputs.every((i) => i.checked);
      // a switch is on or off; a checkbox shows "some" (mixed) too
      if (!isSwitch) control.indeterminate = !control.checked && inputs.some((i) => i.checked);
    });
  });

  // sorting: ascending, descending, back to the authored order
  if (sortable) {
    const original = [...tbody.rows];
    thead.addEventListener('click', (e) => {
      const button = e.target.closest('.table-sort');
      if (!button) return;
      const col = Number(button.dataset.col);
      const th = button.closest('th');
      const order = { none: 'ascending', ascending: 'descending', descending: 'none' }[th.getAttribute('aria-sort') || 'none'];
      thead.querySelectorAll('th[aria-sort]').forEach((h) => {
        h.removeAttribute('aria-sort');
        setIcon(h.querySelector('.table-sort .icon'), 'sort');
      });
      let sorted = original;
      if (order !== 'none') {
        th.setAttribute('aria-sort', order);
        setIcon(button.querySelector('.icon'), order === 'ascending' ? 'chevron-up' : 'chevron-down');
        sorted = [...original].sort((a, b) => compareCells(a.cells[col], b.cells[col]));
        if (order === 'descending') sorted.reverse();
      }
      tbody.append(...sorted);
    });
  }

  table.append(thead, tbody);
  table.style.setProperty('--table-columns', columns);

  // the table scrolls sideways when it's wider than the screen (Mobile: a clipped view)
  const scroller = el('div', 'table-scroll', table);
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  const heading = block.closest('.section')?.querySelector('h1, h2, h3, h4, h5, h6');
  scroller.setAttribute('aria-label', heading?.textContent.trim() || 'Table');
  block.replaceChildren(scroller);
}
