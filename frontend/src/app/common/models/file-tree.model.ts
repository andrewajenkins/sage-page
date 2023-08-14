import { ContentSection } from './section.model';

export interface NodeType {
  FILE;
  FOLDER;
  SECTION;
}

export interface FileTreeFolder {
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
  sections: ContentSection[];
}
export const dummyNode = {
  name: '',
  parent_id: 0,
  parent_type: '',
  type: '',
  content: [],
  sections: [],
  subNodes: [],
};
export type FileTreeNode = FileTreeFolder | FileTreeFile | ContentSection;
export function isFolder(node: FileTreeNode): node is FileTreeFolder {
  return node && node.type === 'folder';
}
export function isFile(node: FileTreeNode): node is FileTreeFile {
  return node && node.type === 'file';
}
