import { ContentNode } from '../../../app/common/models/content-node.model';

export const inNestedFolders = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'folder',
    parent_id: '1',
  },
] as unknown as ContentNode[];

export const inNestedFoldersFile = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'folder',
    parent_id: '1',
    name: 'sub-folder',
  },
  {
    feId: '3',
    type: 'file',
    parent_id: '2',
    name: 'sub-file',
  },
] as unknown as ContentNode[];
export const inRootFileContent = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'file',
    parent_id: '1',
    name: 'sub-file',
  },
  {
    feId: '3',
    type: 'content',
    name: 'content1',
    parent_id: '2',
  },
  {
    feId: '4',
    type: 'content',
    name: 'content2',
    parent_id: '2',
  },
] as unknown as ContentNode[];

export const inRootFileHeaders = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'file',
    parent_id: '1',
    name: 'sub-file',
  },
  {
    feId: '3',
    name: 'heading1',
    type: 'heading',
    parent_id: '2',
  },
  {
    feId: '4',
    name: 'heading2',
    type: 'heading',
    parent_id: '2',
  },
] as unknown as ContentNode[];

export const inRootFileHeadersContent = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'file',
    parent_id: '1',
    name: 'sub-file',
  },
  {
    feId: '3',
    name: 'heading1',
    type: 'heading',
    parent_id: '2',
  },
  {
    feId: '5',
    type: 'content',
    text: 'content1',
    parent_id: '3',
  },
  {
    feId: '4',
    name: 'heading2',
    type: 'heading',
    parent_id: '2',
  },
  {
    feId: '6',
    type: 'content',
    text: 'content1',
    parent_id: '4',
  },
] as unknown as ContentNode[];

export const inNestedHeaders = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'file',
    parent_id: '1',
    name: 'sub-file',
  },
  {
    feId: '3',
    name: 'heading1',
    type: 'heading',
    parent_id: '2',
  },
  {
    feId: '4',
    name: 'heading2',
    type: 'heading',
    parent_id: '3',
  },
] as unknown as ContentNode[];
export const inUpdatedNestedHeader = [
  {
    feId: '1',
    type: 'folder',
    name: 'root-folder',
  },
  {
    feId: '2',
    type: 'file',
    parent_id: '1',
    name: 'sub-file',
  },
  {
    feId: '3',
    type: 'heading',
    name: 'heading 1',
    text: '# heading 1',
    parent_id: '2',
    generated: true,
  },
  {
    feId: '4',
    type: 'heading',
    name: 'heading 2',
    text: '## heading 2',
    parent_id: '3',
    generated: false,
  },
] as unknown as ContentNode[];
