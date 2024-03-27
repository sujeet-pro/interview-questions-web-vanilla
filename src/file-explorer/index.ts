import { getTree } from './data';
import { renderFolderContent } from './render';

getTree().then(folder => {
  const [treeNodes] = renderFolderContent(folder);
  document.getElementById('app')!.appendChild(treeNodes);
});
