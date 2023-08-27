import { ContentNode } from '../../../app/common/models/content-node.model';

export const outNestedFolders = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'folder',
        parent_id: '1',
        subNodes: [],
      },
    ],
  },
] as unknown as ContentNode[];

export const outNestedFoldersFile = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'folder',
        parent_id: '1',
        name: 'sub-folder',
        subNodes: [
          {
            feId: '3',
            type: 'file',
            parent_id: '2',
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
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'file',
        parent_id: '1',
        name: 'sub-file',
        sections: [],
        contents: [
          {
            feId: '3',
            type: 'content',
            parent_id: '2',
          },
          {
            feId: '4',
            type: 'content',
            parent_id: '2',
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];

export const outRootFileHeaders = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'file',
        parent_id: '1',
        name: 'sub-file',
        contents: [],
        sections: [
          {
            feId: '3',
            name: 'heading1',
            type: 'heading',
            parent_id: '2',
            sections: [],
            contents: [],
          },
          {
            feId: '4',
            name: 'heading2',
            type: 'heading',
            parent_id: '2',
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
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'file',
        parent_id: '1',
        name: 'sub-file',
        contents: [],
        sections: [
          {
            feId: '3',
            name: 'heading1',
            type: 'heading',
            parent_id: '2',
            sections: [],
            contents: [
              {
                feId: '5',
                type: 'content',
                parent_id: '3',
              },
            ],
          },
          {
            feId: '4',
            name: 'heading2',
            type: 'heading',
            parent_id: '2',
            sections: [],
            contents: [
              {
                feId: '6',
                type: 'content',
                parent_id: '4',
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
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'file',
        parent_id: '1',
        name: 'sub-file',
        sections: [
          {
            feId: '3',
            name: 'heading1',
            type: 'heading',
            parent_id: '2',
            sections: [
              {
                feId: '4',
                name: 'heading2',
                type: 'heading',
                parent_id: '3',
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
    feId: '1',
    type: 'folder',
    name: 'root-folder',
    subNodes: [
      {
        feId: '2',
        type: 'file',
        parent_id: '1',
        name: 'sub-file',
        sections: [
          {
            feId: '3',
            name: 'heading 1',
            type: 'heading',
            parent_id: '2',
            sections: [
              {
                feId: '4',
                name: 'heading 2',
                type: 'heading',
                parent_id: '3',
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as ContentNode[];
