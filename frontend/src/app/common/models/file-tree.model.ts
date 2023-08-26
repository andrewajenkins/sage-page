import { ContentNode, isSection } from './section.model';

export interface FileTreeFolder {
  id: number;
  name: string;
  parent_id: number;
  type: string;
  subNodes: FileTreeNode[];
  generated?: boolean;
  depth?: number;
  selected?: boolean;
  orderId?: number;
}
export interface FileTreeFile {
  id: number;
  name: string;
  parent_id: number;
  text: string;
  type: string;
  sections: ContentNode[];
  contents: ContentNode[];
  generated?: boolean;
  depth?: number;
  selected?: boolean;
  orderId?: number;
}
export type FileTreeNode = FileTreeFolder | FileTreeFile | ContentNode;
export function isFolder(node: FileTreeNode | undefined): node is FileTreeFolder {
  return !!node && node.type === 'folder';
}
export function isFile(node: FileTreeNode | undefined): node is FileTreeFile {
  return !!node && node.type === 'file';
}
export function isContentNode(node: FileTreeNode | undefined): node is FileTreeFile | ContentNode {
  return isFile(node) || isSection(node);
}
