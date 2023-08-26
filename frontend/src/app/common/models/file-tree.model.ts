import { ContentNode } from './section.model';

// }
export function isFolder(node: ContentNode): boolean {
  return node.type === 'folder';
}
export function isFile(node: ContentNode): boolean {
  return isContentNode(node) && node.type === 'file';
}
export function isContentNode(node: ContentNode | undefined): node is ContentNode {
  return !!node?.name || !!node?.text;
}
