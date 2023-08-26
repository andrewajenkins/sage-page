export interface ContentNode {
  editable: boolean;
  id: number;
  name: string;
  parent_id: number;
  type: string;
  selected: boolean;
  contents: ContentNode[]; // section text that goes between the name and subsections
  sections: ContentNode[]; // subsections to be created
  subNodes: ContentNode[]; // for the file tree
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
export function isSection(node: ContentNode | undefined): boolean {
  return node?.type === 'section' || node?.type === 'heading';
}
export function isContent(node: ContentNode | undefined): boolean {
  return node?.type === 'content';
}
export const dummySection: ContentNode = {
  id: -1,
  editable: false,
  name: '',
  parent_id: -1,
  contents: [],
  sections: [],
  subNodes: [],
  type: '',
  selected: false,
};
