import { type File, type Folder, iconMap } from './data';

export function renderFolderContent(folder: Folder) {
  const content = document.createDocumentFragment();
  const ul = document.createElement('ul');
  content.appendChild(ul);

  let totalSize = 0;
  for (const fileOrFolder of folder.children) {
    const li = document.createElement('li');

    if (fileOrFolder.type === 'file') {
      const [content, size] = renderFileContent(fileOrFolder);
      totalSize += size;
      li.appendChild(content);
    } else if (fileOrFolder.type === 'folder') {
      const [content, size] = renderFolderContent(fileOrFolder);
      totalSize += size;
      li.appendChild(content);
    }
    ul.appendChild(li);
  }

  const summaryContent = renderFolderSummary(folder.name, totalSize);
  const folderFrag = renderAccordion(summaryContent, content);
  return [folderFrag, totalSize] as const;
}

function renderFileContent(file: File) {
  const docFrag = document.createDocumentFragment();
  const fileIcon = document.createElement('span');
  fileIcon.classList.add('icon-file');
  fileIcon.textContent = iconMap.file;
  docFrag.appendChild(fileIcon);
  // File Name
  const fileName = document.createElement('span');
  fileName.textContent = file.name;
  docFrag.appendChild(fileName);
  // File Size
  const fileSize = document.createElement('span');
  fileSize.textContent = `(${convertBytes(file.size)})`;
  docFrag.appendChild(fileSize);

  return [docFrag, file.size] as const;
}

function renderFolderSummary(folderName: string, folderSize: number) {
  const docFrag = document.createDocumentFragment();
  // Open Folder Icon
  const openFolderIcon = document.createElement('span');
  openFolderIcon.classList.add('icon-folder-open');
  openFolderIcon.textContent = iconMap.folderOpen;
  docFrag.appendChild(openFolderIcon);
  // Closed Folder Icon
  const closedFolderIcon = document.createElement('span');
  closedFolderIcon.classList.add('icon-folder-closed');
  closedFolderIcon.textContent = iconMap.folderClosed;
  docFrag.appendChild(closedFolderIcon);
  // Folder Name
  const folderNameEl = document.createElement('span');
  folderNameEl.textContent = folderName;
  docFrag.appendChild(folderNameEl);
  // Folder Size
  const folderSizeEl = document.createElement('span');
  folderSizeEl.textContent = `(${convertBytes(folderSize)})`;
  docFrag.appendChild(folderSizeEl);

  return docFrag;
}

function renderAccordion(
  summayFrag: DocumentFragment,
  contentFrag: DocumentFragment,
) {
  const details = document.createElement('details');

  const summary = document.createElement('summary');
  summary.appendChild(summayFrag);

  details.appendChild(summary);
  details.appendChild(contentFrag);

  return details;
}

function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return '0 Byte';
  }

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
