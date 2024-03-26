type File = {
  id: string;
  name: string;
  type: "file";
};
type Folder = {
  id: string;
  name: string;
  type: "folder";
  children: (Folder | File)[];
};

export const data: Folder = {
  id: "1",
  name: "/",
  type: "folder",
  children: [
    {
      id: "2",
      name: "package.json",
      type: "file",
    },
    {
      id: "3",
      name: "src",
      type: "folder",
      children: [
        {
          id: "4",
          name: "index.js",
          type: "file",
        },
      ],
    },
  ],
};
