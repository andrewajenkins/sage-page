import { ContentSection, isContent, isSection } from '../models/section.model';
import { remove } from 'lodash';
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
export const assembleTree = (nodes: FileTreeNode[], currentNode: ContentSection) => {
  const debug = true;
  const nodeMap = new Map<number, FileTreeNode>();
  const rootNodes: FileTreeNode[] = [];
  if (debug) console.log('assembleTree: nodes:', nodes);
  if (!nodes || nodes.length == 0) return { nodeMap, rootNodes };
  initMap(nodes, nodeMap);
  return populateParents(nodeMap);
};
function populateParents(nodeMap) {
  const rootNodes: FileTreeNode[] = [];
  nodeMap.forEach((node) => {
    console.log('node:', node, 'parent:', parent);
    if (node?.parent_id) {
      const parent = nodeMap.get(node.parent_id) as FileTreeNode;
      if (isFolder(parent)) {
        parent.subNodes.push(node);
      } else if (isSection(node)) {
        parent.sections.push(node);
      } else {
        parent.content.push(node);
      }
    } else rootNodes.push(node);
  });
  // parent.sections.sort((a, b) => a.id - b.id);
  // parent.content.sort((a, b) => a.id - b.id);
  return { nodeMap, rootNodes };
}
function initMap(nodes: FileTreeNode[], nodeMap: Map<number, FileTreeNode>) {
  nodes.forEach((node) => {
    if (isFolder(node)) {
      node.subNodes = [];
    } else if (isFile(node) || isSection(node) || isContent(node)) {
      node.sections = [];
      node.content = [];
    }
    nodeMap.set(node.id as number, node);
  });
}
function buildTree(nodes: FileTreeNode[], rootNodes: FileTreeNode[], nodeMap) {
  nodes
    .sort((a, b) => a.id - b.id)
    .forEach((node: FileTreeNode) => {
      const findDebug = true;
      node.generated = true;
      node.name = node.name.replace(/^[#]+\s/, '');
      // if (!node.parent_id) {
      //   if (findDebug) console.log('assembleTree: pushing root node:', node);
      //   rootNodes.push(node);
      // } else
      if (isFolder(node)) {
        if (findDebug) console.log('assembleTree: pushing folder or file:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (isFile(node)) {
        if (findDebug) console.log('assembleTree: pushing file:', node);
        const parent = nodeMap.get(node.parent_id) as FileTreeFolder;
        parent.subNodes.push(node);
      } else if (node.type === 'content') {
        if (findDebug) console.log('assembleTree: pushing content:', node);
        const parent = nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.content) parent.content = [];
        parent.content.push(node);
      } else if (node.type == 'heading' || isSection(node)) {
        if (findDebug) console.log('assembleTree: pushing section:', node);
        const parent = nodeMap.get(node.parent_id) as ContentSection;
        if (!parent.sections) parent.sections = [];
        parent.sections.push(node);
      } else {
        console.error('assembleTree: unknown node type:', node);
      }
    });
  console.log('assembleTree: final tree:', rootNodes);
  return rootNodes;
}

export function getPath(node: FileTreeNode, nodeMap) {
  let curr: FileTreeNode = node;
  const path: FileTreeNode[] = [];
  while (!isFolder(curr)) {
    console.log('getPath: curr:', curr);
    path.unshift(curr);
    if (!curr.parent_id) throw new Error('getPath: no parent_id: ' + JSON.stringify(curr));
    curr = nodeMap.get(curr.parent_id) as FileTreeNode;
  }
  return path;
}
