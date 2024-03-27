export type File = {
  name: string;
  type: 'file';
  size: number;
};
export type Folder = {
  name: string;
  type: 'folder';
  children: (Folder | File)[];
};

const baseUrl = import.meta.env.BASE_URL;

export async function getTree(): Promise<Folder> {
  const res = await fetch(`${baseUrl}/file-tree.json`);
  const data = await res.json();
  return data;
}

export const iconMap = {
  file: '📄',
  folderClosed: '📁',
  folderOpen: '📂',
};
