import { ContentSection, isContent, isSection } from '../models/section.model';
import { cloneDeep, remove } from 'lodash';
import { map } from 'rxjs';
import { FileTreeFolder, FileTreeNode, isFile, isFolder } from '../models/file-tree.model';

export function recursiveDeleteNode(sections: ContentSection, idToRemove: number) {
  function clearSubNodes(node: ContentSection) {
    if (node.sections) {
      for (const subNode of node.sections) {
        clearSubNodes(subNode);
      }
      node.sections.length = 0;
    }
    if (node.contents) {
      for (const subNode of node.contents) {
        clearSubNodes(subNode);
      }
      node.contents.length = 0;
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
      if (node.contents) {
        removeNodeById(node.contents, idToRemove);
      }
      return false;
    });
  }

  removeNodeById(sections, idToRemove);
}
export const assembleTree = (nodes: FileTreeNode[], currentNode: ContentSection) => {
  const debug = true;
  const nodeMap = new Map<number, FileTreeNode>();
  const rootNodes: FileTreeNode[] = [];
  if (debug) console.log('assembleTree: nodes:', nodes);
  if (!nodes || nodes.length == 0) return { nodeMap, rootNodes };
  initMap(nodes, nodeMap);
  // return populateParents(nodeMap);
  return buildFromDepths(nodes, nodeMap, rootNodes);
};

function buildFromDepths(nodes, nodeMap, rootNodes) {
  // Process folders first.
  let depthMap = new Map();
  function clearLowerDepths(depth) {
    while (depthMap.has(depth + 1)) {
      depthMap.delete(depth + 1);
      depth++;
    }
  }
  for (let node of nodes) {
    if (node.type === 'folder') {
      // If it's a root folder
      if (!node.parent_id) {
        rootNodes.push(node);
      } else {
        // Add it to its parent folder's subNodes
        const parent = nodeMap.get(node.parent_id);
        if (!parent.subNodes) {
          parent.subNodes = [];
        }
        parent.subNodes.push(node);
      }
    } else if (isFile(node)) {
      const parent = nodeMap.get(node.parent_id);
      parent.subNodes.push(node);
      depthMap.clear();
      depthMap.set(0, node);
    } else {
      if (node.type === 'heading') {
        console.log('buildFromDepths: heading:', node.text);
        const parent = depthMap.get(node.depth - 1); // Get the parent at the previous depth
        if (!parent.sections) {
          parent.sections = [];
        }
        node.parent_id = parent.id;
        parent.sections.push(node);
        depthMap.set(node.depth, node);
        clearLowerDepths(node.depth);
      } else {
        const maxDepth = Math.max(...depthMap.keys());
        const parent = depthMap.get(maxDepth);
        if (!parent.contents) {
          parent.contents = [];
        }
        node.parent_id = parent.id;
        parent.contents.push(node);
      }
    }
  }
  return { nodeMap, rootNodes };
}

// Sample Usage:
function populateParents(nodeMap) {
  const rootNodes: FileTreeNode[] = [];
  nodeMap.forEach((node) => {
    if (node?.parent_id) {
      const parent = nodeMap.get(node.parent_id) as FileTreeNode;
      console.log('node:', node, 'parent:', parent);
      if (isFolder(parent)) {
        parent.subNodes.push(node);
      } else if (isSection(node)) {
        parent.sections.push(node);
      } else {
        parent.contents.push(node);
      }
      nodeMap.set(parent.id, parent);
    } else {
      node.depth = 0;
      rootNodes.push(node);
    }
  });
  return { nodeMap, rootNodes };
}
function initMap(nodes: FileTreeNode[], nodeMap: Map<number, FileTreeNode>) {
  nodes.forEach((node) => {
    if (isFolder(node)) {
      node.subNodes = [];
    } else if (isFile(node) || isSection(node) || isContent(node)) {
      node.sections = [];
      node.contents = [];
    }
    nodeMap.set(node.id as number, node);
  });
}

export function buildMapV2(parent: ContentSection) {
  const oldSections: ContentSection[] = [];
  const depthMap = new Map<number, ContentSection>();
  const sections = parent.sections;
  parent.sections = [];
  depthMap.set(0, parent);
  for (let i = 0; i < sections.length; i++) {
    const node = sections[i];
    if (node.depth) {
      const localParent = depthMap.get(node.depth - 1);
      if (!localParent) throw new Error('buildMapV2: no localParent for node:' + JSON.stringify(node));
      node.generated = true;
      node.type = 'heading';
      node.depth = localParent.depth! + 1;
      localParent!.sections.push(node);
      depthMap.set(node.depth, node);
      oldSections.push(cloneDeep(node));
      while (sections[i + 1] && sections[i + 1].depth == undefined) {
        const subNode = sections[++i];
        subNode.generated = true;
        subNode.type = 'content';
        if (node) {
          node.contents.push(subNode);
        } else {
          localParent.contents.push(subNode);
        }
        oldSections.push(cloneDeep(subNode));
      }
    }
  }
  return oldSections;
}
function getParent(depthMap: Map<number, ContentSection>, depth: number): ContentSection {
  //adjust for parent depth
  const startIndex = depth ? depth - 1 : depthMap.size;
  for (let i = depth - 1; i >= 1; i--) {
    if (depthMap.has(i)) {
      return depthMap.get(i) as ContentSection;
    }
  }
  return depthMap.get(0) as ContentSection;
}
export function parseNodes(parent: ContentSection) {
  parent.sections.forEach((node) => {
    parse(node);
  });
  return parent;
}
function parse(node: ContentSection) {
  const text = node.text;
  if (!text) return;
  if (text.startsWith('- ###### ')) {
    node.depth = 6;
    node.name = text.substring(9);
  } else if (text.startsWith('###### ')) {
    node.depth = 6;
    node.name = text.substring(7);
  } else if (text.startsWith('- ##### ')) {
    node.depth = 5;
    node.name = text.substring(8);
  } else if (text.startsWith('##### ')) {
    node.depth = 5;
    node.name = text.substring(6);
  } else if (text.startsWith('- #### ')) {
    node.depth = 4;
    node.name = text.substring(7);
  } else if (text.startsWith('#### ')) {
    node.depth = 4;
    node.name = text.substring(5);
  } else if (text.startsWith('- ### ')) {
    node.depth = 3;
    node.name = text.substring(6);
  } else if (text.startsWith('### ')) {
    node.depth = 3;
    node.name = text.substring(4);
  } else if (text.startsWith('- ## ')) {
    node.depth = 2;
    node.name = text.substring(5);
  } else if (text.startsWith('## ')) {
    node.depth = 2;
    node.name = text.substring(3);
  } else if (text.startsWith('- # ')) {
    node.depth = 1;
    node.name = text.substring(2);
  } else if (text.startsWith('# ')) {
    node.depth = 1;
    node.name = text.substring(2);
  } else if (text.startsWith('- [')) {
    node.name = text.replace(/.*\[(.*?)\.*]/g, '$1');
  } else if (text.startsWith('- ')) {
    node.name = text.substring(2);
  } else if (text.startsWith(' - ')) {
    node.name = text.substring(3);
  } else if (text.startsWith('  - ')) {
    node.name = text.substring(4);
  } else {
    node.name = text;
  }
  return node;
}
export function getPath(node: FileTreeNode, nodeMap) {
  return [];
  // let curr: FileTreeNode = node;
  // const path: FileTreeNode[] = [];
  // console.log('equality:', !nodeMap, nodeMap === undefined);
  // if (!nodeMap || !curr) {
  //   console.warn('getPath: no nodeMap or node:', nodeMap, curr);
  //   return [];
  // }
  // while (!isFolder(curr)) {
  //   console.log('getPath: curr:', curr);
  //   path.unshift(curr);
  //   if (!curr.parent_id) throw new Error('getPath: no parent_id: ' + JSON.stringify(curr));
  //   curr = nodeMap.get(curr.parent_id) as FileTreeNode;
  // }
  // return path;
}
