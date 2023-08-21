import { ContentSection, isSection } from './section.model';

export interface NodeType {
  FILE;
  FOLDER;
  SECTION;
}

export interface FileTreeFolder {
  id?: number;
  name: string;
  parent_id: number;
  type: string;
  subNodes: FileTreeNode[];
  generated?: boolean;
  depth?: number;
  selected?: boolean;
}
export interface FileTreeFile {
  id?: number;
  name: string;
  parent_id: number;
  text: string;
  type: string;
  sections: ContentSection[];
  content: ContentSection[];
  generated?: boolean;
  depth?: number;
  selected?: boolean;
}
export type FileTreeNode = FileTreeFolder | FileTreeFile | ContentSection;
export function isFolder(node: FileTreeNode | undefined): node is FileTreeFolder {
  return !!node && node.type === 'folder';
}
export function isFile(node: FileTreeNode | undefined): node is FileTreeFile {
  return !!node && node.type === 'file';
}
export function isContentNode(node: FileTreeNode | undefined): node is FileTreeFile | ContentSection {
  return isFile(node) || isSection(node);
}
