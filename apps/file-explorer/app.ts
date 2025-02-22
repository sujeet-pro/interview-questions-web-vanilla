import { getTree } from "./data";
import { renderFolderContent } from "./render";

// Write your app code here. init is called when the app is loaded.
export function init(rootElem: HTMLDivElement) {
  rootElem.classList.add('p-4')
  getTree().then(folder => {
    const [treeNodes] = renderFolderContent(folder);
    rootElem.innerHTML = ``
    rootElem.appendChild(treeNodes);
  });
  
}