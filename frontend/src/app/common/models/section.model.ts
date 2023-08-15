import { FileTreeNode } from './file-tree.model';

export const enum ContentSectionType {
  STRING = 'CONTENT_TYPE_STRING',
  CODE = 'CONTENT_TYPE_CODE',
  NONE = 'CONTENT_TYPE_NONE',
}
export interface ContentSection {
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
  text?: string[]; // store the raw input strings
  textType?: string;
}
export interface ChatLogEntry {
  role: string;
  content: ContentSection[];
  id: number;
}
export function isSection(
  node: FileTreeNode | undefined
): node is ContentSection {
  return !!node && node.type === 'section';
}
export function isContent(
  node: FileTreeNode | undefined
): node is ContentSection {
  return !!node && node.type === 'content';
}
export const dummySection: ContentSection = {
  sections: [],
  name: '',
  parent_id: -1,
  parent_type: '',
  content: [],
  type: '',
  contentType: ContentSectionType.NONE,
  selected: false,
};
