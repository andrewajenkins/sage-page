import { generateRandomAlphanumeric } from '../utils/uuid';

export class ContentNode {
  id!: number;
  feId: string;
  editable!: boolean;
  name!: string;
  parent_id!: string;
  type!: string;
  selected!: boolean;
  contents!: ContentNode[];
  sections!: ContentNode[];
  subNodes!: ContentNode[];
  text?: string;
  depth?: number;
  focused?: boolean;
  generated?: boolean;
  orderId?: number;

  constructor(newNode: Partial<ContentNode>) {
    if (!newNode.feId) this.feId = generateRandomAlphanumeric(10);
    else this.feId = newNode.feId;
    this.id = newNode?.id || -1;
    this.editable = newNode?.editable || false;
    this.name = newNode?.name || 'DEFAULT_NAME';
    this.parent_id = newNode?.parent_id || '';
    this.type = newNode?.type || 'section';
    this.selected = newNode?.selected || false;
    this.contents = newNode?.contents || [];
    this.sections = newNode?.sections || [];
    this.subNodes = newNode?.subNodes || [];
    this.text = newNode?.text;
    this.depth = newNode?.depth;
    this.focused = newNode?.focused;
    this.generated = newNode?.generated;
    this.orderId = newNode?.orderId;
  }

  isSection(): boolean {
    return this.type === 'section' || this.type === 'heading';
  }
  isContent(): boolean {
    return this.type === 'content';
  }
  isFolder(): boolean {
    return this.type === 'folder';
  }
  isFile(): boolean {
    return this.type === 'file';
  }
  isContentNode(): boolean {
    return this.type === 'file' || this.isSection();
  }
  hasParent(): boolean {
    return this.parent_id !== '';
  }
}
const dummySection: any = {
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
export interface ChatLogEntry {
  role: string;
  content: ContentNode[];
  id: number;
}

// }

// export interface ContentNode {
//   id: number;
//   feId?: string;
//   orderId?: string;
//   editable: boolean;
//   name: string;
//   parent_id: number;
//   type: string;
//   selected: boolean;
//   contents: ContentNode[]; // section text that goes between the name and subsections
//   sections: ContentNode[]; // subsections to be created
//   subNodes: ContentNode[]; // for the file tree
//   text?: string; // store the raw input strings
//   depth?: number;
//   focused?: boolean;
//   generated?: boolean;
// }
