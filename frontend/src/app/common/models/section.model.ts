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
  content?: ContentSection;
  sections?: ContentSection[];
  path?: string[];
  text?: string;
  textType?: string;
}
export interface ChatLogEntry {
  role: string;
  content: ContentSection[];
  id: number;
}
export function isSection(node: FileTreeNode): node is ContentSection {
  return node && node.type === 'section';
}
export const dummySection: ContentSection = {
  name: '',
  parent_id: -1,
  parent_type: '',
  type: '',
  contentType: ContentSectionType.NONE,
  selected: false,
};
