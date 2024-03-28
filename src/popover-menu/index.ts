const pairs = [...document.querySelectorAll('*[anchor]')].map(anchored => [
  anchored as HTMLElement,
  document.getElementById(anchored.getAttribute('anchor')!)! as HTMLElement,
]);

function updateAnchorPosition(anchored: HTMLElement, anchor: HTMLElement) {
  const bounds = anchor.getBoundingClientRect();
  console.table(bounds.toJSON());
  anchored.style.top = `${bounds.y + window.scrollY}px`;
  anchored.style.left = `${bounds.x + window.screenX + bounds.width / 2}px`;
}

function updateAnchors() {
  for (const [anchored, anchor] of pairs) {
    updateAnchorPosition(anchored, anchor);
  }
}

window.addEventListener('resize', updateAnchors);
window.addEventListener('DOMContentLoaded', updateAnchors);
