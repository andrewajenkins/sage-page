import { ContentSection } from '../models/section.model';
import { remove } from 'lodash';

export function recursiveDeleteNode(sections: ContentSection, idToRemove: number) {
  function clearSubNodes(node: ContentSection) {
    if (node.sections) {
      for (const subNode of node.sections) {
        clearSubNodes(subNode);
      }
      node.sections.length = 0;
    }
    if (node.content) {
      for (const subNode of node.content) {
        clearSubNodes(subNode);
      }
      node.content.length = 0;
    }
  }

  function removeNodeById(tree, idToRemove) {
    remove(tree, (node: ContentSection) => {
      if (node.id === idToRemove) {
        clearSubNodes(node);
        return true; // Remove this node
      }
      if (node.sections) {
        removeNodeById(node.sections, idToRemove);
      }
      if (node.content) {
        removeNodeById(node.content, idToRemove);
      }
      return false;
    });
  }

  removeNodeById(sections, idToRemove);
}
