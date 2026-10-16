/**
 * Media Container: one image in a dedicated media area, with an optional play indicator
 * (block option `video`, or a link to the video). See README.md.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const link = block.querySelector('a[href]');

  const media = document.createElement(link ? 'a' : 'div');
  media.className = 'media-container-media';
  if (picture) media.append(picture);

  if (link) {
    media.href = link.href;
    const text = link.textContent.trim();
    // the link holds only the image, so it needs its own name
    media.setAttribute('aria-label', text && text !== link.href ? text : 'Play video');
    if (link.target) media.target = link.target;
    block.classList.add('video');
  }

  if (block.classList.contains('video')) {
    const play = document.createElement('span');
    play.className = 'media-container-play';
    play.setAttribute('aria-hidden', 'true');
    media.append(play);
  }

  block.replaceChildren(media);
}
