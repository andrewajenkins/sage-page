import { FileTreeNode } from './file-tree.model';

export interface ContentSection {
  editable: boolean;
  id?: number;
  name: string;
  parent_id: number;
  type: string;
  selected: boolean;
  content: ContentSection[]; // section text that goes between the name and subsections
  sections: ContentSection[]; // subsections to be created
  text?: string; // store the raw input strings
  depth?: number;
  focused?: boolean;
  generated?: boolean;
}
export interface ChatLogEntry {
  role: string;
  content: ContentSection[];
  id: number;
}
export function isSection(node: FileTreeNode | undefined): node is ContentSection {
  return (!!node && node.type === 'section') || (!!node && node.type === 'heading');
}
export function isContent(node: FileTreeNode | undefined): node is ContentSection {
  return !!node && (node.type === 'content' || node.type === 'list_item' || node.type === 'text');
}
export const dummySection: ContentSection = {
  editable: false,
  sections: [],
  name: '',
  parent_id: -1,
  content: [],
  type: '',
  selected: false,
};
