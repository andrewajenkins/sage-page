import { ContentNode } from '../../../app/common/models/content-node.model';

export const outNestedFolders = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'folder',
        parent_id: 1,
        subNodes: [],
      },
    ],
  },
] as unknown as ContentNode[];

export const outNestedFoldersFile = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'folder',
        parent_id: 1,
        name: 'sub-folder',
        subNodes: [
          {
            id: 3,
            type: 'file',
            parent_id: 2,
            name: 'sub-file',
            contents: [],
            sections: [],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outRootFileContent = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'file',
        parent_id: 1,
        name: 'sub-file',
        sections: [],
        contents: [
          {
            id: 3,
            type: 'content1',
            parent_id: 2,
          },
          {
            id: 4,
            type: 'content2',
            parent_id: 2,
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outRootFileHeaders = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'file',
        parent_id: 1,
        name: 'sub-file',
        depth: 0,
        contents: [],
        sections: [
          {
            id: 3,
            name: 'heading1',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [],
            contents: [],
          },
          {
            id: 4,
            name: 'heading2',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [],
            contents: [],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outRootFileHeadersContent = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'file',
        parent_id: 1,
        name: 'sub-file',
        depth: 0,
        contents: [],
        sections: [
          {
            id: 3,
            name: 'heading1',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [],
            contents: [
              {
                id: 5,
                type: 'content1',
                parent_id: 3,
              },
            ],
          },
          {
            id: 4,
            name: 'heading2',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [],
            contents: [
              {
                id: 6,
                type: 'content2',
                parent_id: 4,
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outNestedHeaders = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'file',
        parent_id: 1,
        name: 'sub-file',
        depth: 0,
        sections: [
          {
            id: 3,
            name: 'heading1',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [
              {
                id: 4,
                name: 'heading2',
                type: 'heading',
                parent_id: 3,
                depth: 2,
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outUpdatedNestedHeader = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        id: 2,
        type: 'file',
        parent_id: 1,
        name: 'sub-file',
        depth: 0,
        sections: [
          {
            id: 3,
            name: 'heading 1',
            type: 'heading',
            parent_id: 2,
            depth: 1,
            sections: [
              {
                id: 4,
                name: 'heading 2',
                type: 'heading',
                parent_id: 3,
                depth: 2,
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];
