import { ContentSection, isSection } from './section.model';
import { Token } from '../parsers/file-tree-builder.service';

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
  text: string;
  textType: Token;
  type: string;
  sections: ContentSection[];
  content: ContentSection[];
}
export type FileTreeNode = FileTreeFolder | FileTreeFile | ContentSection;
export function isFolder(
  node: FileTreeNode | undefined
): node is FileTreeFolder {
  return !!node && node.type === 'folder';
}
export function isFile(node: FileTreeNode | undefined): node is FileTreeFile {
  return !!node && node.type === 'file';
}
export function isContentNode(
  node: FileTreeNode | undefined
): node is FileTreeFile | ContentSection {
  return isFile(node) || isSection(node);
}
