// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.classList.add('flex', 'items-center', 'justify-center', 'h-full')

  rootElem.innerHTML = `
  <div class="">
      <label for="input-confusing">Confusing Input label</label>
      <button
        popovertarget="confusing-info-content"
        id="confusing-info-btn"
        type="button"
        class=""
      >
        🤔
      </button>
      <div
        anchor="confusing-info-btn"
        class="absolute -translate-x-1/2 -translate-y-[calc(100%+10px)]"
        popover="auto"
        id="confusing-info-content"
      >
        Information about the field
      </div>
      <input type="text" id="input-confusing" />
  </div>
  `

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
}