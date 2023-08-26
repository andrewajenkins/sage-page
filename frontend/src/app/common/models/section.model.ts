import { FileTreeNode } from './file-tree.model';

export interface ContentNode {
  editable: boolean;
  id: number;
  name: string;
  parent_id: number;
  type: string;
  selected: boolean;
  contents: ContentNode[]; // section text that goes between the name and subsections
  sections: ContentNode[]; // subsections to be created
  text?: string; // store the raw input strings
  depth?: number;
  focused?: boolean;
  generated?: boolean;
}
export interface ChatLogEntry {
  role: string;
  content: ContentNode[];
  id: number;
}
export function isSection(node: FileTreeNode | undefined): node is ContentNode {
  return (!!node && node.type === 'section') || (!!node && node.type === 'heading');
}
export function isContent(node: FileTreeNode | undefined): node is ContentNode {
  return !!node && (node.type === 'content' || node.type === 'list_item' || node.type === 'text');
}
export const dummySection: ContentNode = {
  id: -1,
  editable: false,
  sections: [],
  name: '',
  parent_id: -1,
  contents: [],
  type: '',
  selected: false,
};
