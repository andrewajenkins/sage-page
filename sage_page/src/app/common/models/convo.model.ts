import { Chat } from '../../main-content/bot-window/chat.model';
import { generateRandomAlphanumeric } from '../utils/uuid';

export class ConvoNode {
  id?: number;
  feId?: string;
  name!: string;
  parent_id?: number;
  type!: 'folder' | 'convo' | 'chat';
  selected?: boolean;
  chats!: Chat[];
  nodes!: ConvoNode[];
  depth?: number;
  orderId?: string;

  constructor(newNode?: Partial<ConvoNode>) {
    if (newNode) {
      if (!newNode.feId) this.feId = generateRandomAlphanumeric(10);
      else this.feId = newNode.feId;
      this.name = newNode?.name || 'DEFAULT_NAME';
      this.parent_id = newNode?.parent_id;
      this.type = newNode?.type || 'convo';
      this.selected = newNode?.selected || false;
      this.chats = newNode?.chats || [];
      this.depth = newNode?.depth ? newNode.depth : this.type === 'convo' ? 0 : undefined;
      this.orderId = newNode?.orderId;
    }
  }
  isFolder() {
    return this.type === 'folder';
  }
  isConvo() {
    return this.type === 'convo';
  }
  isChat() {
    return this.type === 'chat';
  }
  hasParent() {
    return !!this.parent_id;
  }
}
