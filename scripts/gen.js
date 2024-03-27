import fs from "node:fs";

function generateFilesAndFoldersList(pathPrefix, folderName) {
  const folderPath = pathPrefix ? `${pathPrefix}/${folderName}` : folderName;

  const filesAndFoldersList = {
    name: folderName,
    path: folderPath,
    type: "folder",
    children: [],
  };

  const items = fs.readdirSync(folderPath);

  for (const item of items) {
    const itemPath = `${folderPath}/${item}`;
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      filesAndFoldersList.children.push(
        generateFilesAndFoldersList(folderPath, item),
      );
    } else {
      filesAndFoldersList.children.push({
        name: item,
        type: "file",
        size: stats.size,
      });
    }
  }

  return filesAndFoldersList;
}

const filesAndFoldersList = generateFilesAndFoldersList("", "node_modules");
const jsonStructure = JSON.stringify(filesAndFoldersList, null, 2);

fs.writeFileSync("public/file-tree.json", jsonStructure);
