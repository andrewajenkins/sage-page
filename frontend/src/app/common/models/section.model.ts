import { FileTreeNode } from './file-tree.model';

export const enum ContentSectionType {
  STRING = 'CONTENT_TYPE_STRING',
  CODE = 'CONTENT_TYPE_CODE',
  NONE = 'CONTENT_TYPE_NONE',
}
export interface ContentSection {
  editable: boolean;
  id?: number;
  name: string;
  parent_id: number;
  parent_type: string;
  type: string;
  contentType: ContentSectionType;
  selected: boolean;
  content: ContentSection[]; // section text that goes between the name and subsections
  sections: ContentSection[]; // subsections to be created
  path?: string[];
  text?: string; // store the raw input strings
  textType: number;
  bulletedText?: boolean;
  depth?: number;
  focused?: boolean;
  generated?: boolean;
  lexType?: string;
  lexDepth?: number;
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
  parent_type: '',
  content: [],
  type: '',
  contentType: ContentSectionType.NONE,
  selected: false,
  textType: 0,
};
