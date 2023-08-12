import { ContentSection } from '../../main-content/bot-window/bot-window.component';

export interface NodeType {
  FILE;
  FOLDER;
}

export interface FileTreeFolder extends Object {
  id?: number;
  name: string;
  parent_id: number;
  parent_type: string;
  type: string;
  subNodes: FileTreeNode[];
}

export interface FileTreeFile {
  id?: number;
  name: string;
  parent_id: number;
  parent_type: string;
  type: string;
  content: ContentSection[];
}

export const dummyNode = {
  name: '',
  parent_id: 0,
  parent_type: '',
  type: '',
  content: [],
  subNodes: [],
};
export type FileTreeNode = FileTreeFolder | FileTreeFile;

export function isFolder(node: FileTreeNode): node is FileTreeFolder {
  return node && node.type === 'folder';
}

export function isFile(node: FileTreeNode): node is FileTreeFile {
  return node && node.type === 'file';
}
