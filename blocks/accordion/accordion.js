/*
 * Accordion Block
 * Each row is an item: the first cell is the title, the second cell is the body.
 */

export default function decorate(block) {
  const expanded = block.classList.contains('expanded');

  [...block.children].forEach((row) => {
    const [label, body] = row.children;
    if (!label || !label.textContent.trim()) {
      row.remove();
      return;
    }

    // the whole header row is the toggle, not just the arrow
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    const header = document.createElement('span');
    header.className = 'accordion-item-header';
    header.append(...label.childNodes);
    summary.append(header);

    const content = document.createElement('div');
    content.className = 'accordion-item-body';
    const text = document.createElement('div');
    text.className = 'accordion-item-text';
    if (body) text.append(...body.childNodes);
    content.append(text);

    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.open = expanded;
    details.append(summary, content);
    row.replaceWith(details);
  });
}
