import { ContentNode } from '../models/content-node.model';
import { cloneDeep, remove } from 'lodash';

export function recursiveDeleteNode(sections: ContentNode, idToRemove: number) {
  function clearSubNodes(node: ContentNode) {
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
    remove(tree, (node: ContentNode) => {
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
export const assembleTree = (nodeDatas: ContentNode[], currentNode?: ContentNode) => {
  const debug = true;
  const nodeMap = new Map<number, ContentNode>();
  const rootNodes: ContentNode[] = [];
  if (debug) console.log('assembleTree: nodes:', nodeDatas);
  if (!nodeDatas || nodeDatas.length == 0) return { nodeMap, rootNodes };
  const nodes = initNodes(nodeDatas);
  initMap(nodes, nodeMap);
  // return populateParents(nodeMap);
  return buildFromDepths(nodes, nodeMap, rootNodes);
};
function initNodes(nodeDatas) {
  const nodes: ContentNode[] = [];
  for (let nodeData of nodeDatas) {
    nodes.push(new ContentNode(nodeData));
  }
  return nodes;
}
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
    if (node.isFolder()) {
      // If it's a root folder
      if (!node.hasParent()) {
        rootNodes.push(node);
      } else {
        // Add it to its parent folder's subNodes
        const parent = nodeMap.get(node.parent_id);
        if (!parent.subNodes) {
          parent.subNodes = [];
        }
        parent.subNodes.push(node);
      }
    } else if (node.isFile()) {
      const parent = nodeMap.get(node.parent_id);
      parent.subNodes.push(node);
      depthMap.clear();
      depthMap.set(0, node);
    } else {
      if (node.type === 'heading') {
        console.log('buildFromDepths: heading:', node.text, node);
        const parent = getParent(node.depth - 1, depthMap); // Get the parent at the previous depth
        if (!parent.sections) parent.sections = [];
        node.parent_id = parent.id;
        parent.sections.push(node);
        depthMap.set(node.depth, node);
        clearLowerDepths(node.depth);
      } else {
        const maxDepth = Math.max(...depthMap.keys());
        const parent = getParent(node.depth - 1, depthMap);
        if (!parent.contents) parent.contents = [];
        node.parent_id = parent.id;
        parent.contents.push(node);
      }
    }
  }
  return { nodeMap, rootNodes };
}

function initMap(nodes: ContentNode[], nodeMap: Map<number, ContentNode>) {
  nodes.forEach((node) => {
    if (node.isFolder()) {
      if (!node.subNodes) node.subNodes = [];
    } else {
      if (!node.sections) node.sections = [];
      if (!node.contents) node.contents = [];
    }
    nodeMap.set(node.id as number, node);
  });
}

export function buildMapV2(parent: ContentNode) {
  const oldSections: ContentNode[] = [];
  const depthMap = new Map<number, ContentNode>();
  const sections = parent.sections;
  parent.sections = [];
  depthMap.set(0, parent);
  for (let i = 0; i < sections.length; i++) {
    const node = sections[i];
    if (node.depth) {
      const localParent = getParent(node.depth - 1, depthMap);
      if (!localParent) throw new Error('buildMapV2: no localParent for node:' + JSON.stringify(node));
      node.generated = true;
      node.type = 'heading';
      node.depth = localParent.depth! + 1;
      localParent!.sections.push(node);
      depthMap.set(node.depth!, node);
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
    } else {
      node.generated = true;
      node.type = 'content';
      node.parent_id = parent.feId;
      parent.sections.push(node);
      oldSections.push(cloneDeep(node));
    }
  }
  return oldSections;
}
function getParent(depth, depthMap) {
  let i = depth >= 0 ? depth : depthMap.size;
  console.log('getParent: depth:', depth, depthMap.get(depth));
  while (!depthMap.get(i)) {
    i--;
    console.log('getParent: depth:', depth, depthMap.get(depth));
    if (i < 0) throw new Error('getParent: no parent found');
  }
  return depthMap.get(i);
}
export function parseNodes(parent: ContentNode) {
  parent.sections.forEach((node) => {
    parse(node);
  });
  return parent;
}
function parse(node: ContentNode) {
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
  } else if (/^[0-9]+\./.test(text)) {
    try {
      node.depth = 1;
      const name = text.match(/^\d+\.\s(.+)$/)![1];
      node.name = name;
    } catch (e) {
      console.error('parseNodes: skipped - error parsing:', text);
    }
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
export function getPath(node: ContentNode, nodeMap) {
  let curr: ContentNode = node;
  const path: ContentNode[] = [];
  console.log('equality:', !nodeMap, nodeMap === undefined);
  if (!nodeMap || !curr) {
    console.warn('getPath: no nodeMap or node:', nodeMap, curr);
    return [];
  }
  while (curr && !curr.isFolder()) {
    path.unshift(curr);
    if (!curr.parent_id) throw new Error('getPath: no parent_id: ' + JSON.stringify(curr));
    curr = nodeMap.get(curr.parent_id) as ContentNode;
  }
  return path;
}
