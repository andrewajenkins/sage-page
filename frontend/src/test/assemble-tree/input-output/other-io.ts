import { ContentNode } from '../../../app/common/models/file-tree.model';

export const inSiblingHeaders = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
  },
  {
    id: 2,
    type: 'file',
    parent_id: 1,
    name: 'sub-file',
    depth: 0,
  },
  {
    id: 3,
    name: 'heading1',
    type: 'heading',
    parent_id: 2,
    depth: 1,
  },
  {
    id: 4,
    name: 'heading2',
    type: 'heading',
    parent_id: 2,
    depth: 1,
  },
] as unknown as ContentNode[];
