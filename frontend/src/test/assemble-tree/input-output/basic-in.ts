import { FileTreeNode } from '../../../app/common/models/file-tree.model';

export const inNestedFolders = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
  },
  {
    id: 2,
    type: 'folder',
    parent_id: 1,
  },
] as unknown as FileTreeNode[];

export const inNestedFoldersFile = [
  {
    id: 1,
    type: 'folder',
    name: 'root-folder',
  },
  {
    id: 2,
    type: 'folder',
    parent_id: 1,
    name: 'sub-folder',
  },
  {
    id: 3,
    type: 'file',
    parent_id: 2,
    name: 'sub-file',
  },
] as unknown as FileTreeNode[];
export const inRootFileContent = [
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
  },
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
] as unknown as FileTreeNode[];

export const inRootFileHeaders = [
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
] as unknown as FileTreeNode[];

export const inNestedHeaders = [
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
    parent_id: 3,
    depth: 2,
  },
] as unknown as FileTreeNode[];

export const inRootFileHeadersContent = [
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
  {
    id: 5,
    type: 'content1',
    parent_id: 3,
  },
  {
    id: 6,
    type: 'content2',
    parent_id: 4,
  },
] as unknown as FileTreeNode[];
