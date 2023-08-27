import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { ContentNode } from '../models/content-node.model';
import { cloneDeep } from 'lodash';
import { ServiceLogger } from '../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV6Service {
  constructor(private dataService: DataService) {}

  assembleTree(currentNode: ContentNode, nodeDatas: ContentNode[]) {
    const rootNodes: ContentNode[] = [];
    const nodeMap = new Map<string, ContentNode>();
    if (!nodeDatas || nodeDatas.length == 0) return { nodeMap, rootNodes };
    const nodes = this.initNodes(nodeDatas);
    this.initMap(nodes, nodeMap);
    return this.buildFromIds(nodes, nodeMap, rootNodes);
  }
  private buildFromIds(nodes: ContentNode[], nodeMap: Map<string, ContentNode>, rootNodes: ContentNode[]) {
    for (let node of nodes) {
      if (node.isFolder()) {
        if (!node.hasParent()) rootNodes.push(node);
        else this.getNodeParent(node, nodeMap)?.subNodes.push(node);
      } else if (node.isFile()) {
        const parent = this.getNodeParent(node, nodeMap);
        parent?.subNodes.push(node);
      } else {
        if (node.type === 'heading') {
          const parent = this.getNodeParent(node, nodeMap); // Get the parent at the previous depth
          if (!parent.sections) parent.sections = [];
          parent.sections.push(node);
        } else {
          const parent = this.getNodeParent(node, nodeMap);
          parent.contents.push(node);
        }
      }
    }
    return { nodeMap, rootNodes };
  }
  private getNodeParent(node, nodeMap) {
    const result = nodeMap.get(node.parent_id);
    if (!result) throw new Error('getNodeParent: no parent found for node:' + JSON.stringify(node));
    return result;
  }
  private initNodes(nodeDatas) {
    const nodes: ContentNode[] = [];
    for (let nodeData of nodeDatas) {
      nodes.push(new ContentNode(nodeData));
    }
    return nodes;
  }
  private initMap(nodes: ContentNode[], nodeMap: Map<string, ContentNode>) {
    nodes.forEach((node) => {
      if (node.isFolder()) {
        if (!node.subNodes) node.subNodes = [];
      } else {
        if (!node.sections) node.sections = [];
        if (!node.contents) node.contents = [];
      }
      nodeMap.set(node.feId, node);
    });
  }
  buildTree(parent, nodes) {
    const parsedResults = this.parseNodes(nodes);
    const { nodeMap, rootNodes, updateSections } = this.build(parent, parsedResults);
    this.dataService.createSections(updateSections).subscribe((nodes) => {});
    return { nodeMap, rootNodes };
  }
  private build(parent: ContentNode, nodes) {
    const depthMap = new Map<number, ContentNode>();
    const nodeMap = new Map<string, ContentNode>();
    const rootNodes: ContentNode[] = [];
    const updateSections: ContentNode[] = [];
    parent.sections = [];
    depthMap.set(0, parent);
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.depth) {
        const localParent = this.getParent(node.depth - 1, depthMap);
        if (!localParent) throw new Error('buildMapV6: no localParent for node:' + JSON.stringify(node));
        node.generated = true;
        node.type = 'heading';
        node.depth = localParent.depth! + 1;
        node.parent_id = localParent.feId;
        localParent!.sections.push(node);
        depthMap.set(node.depth!, node);
        updateSections.push(cloneDeep(node));
        nodeMap.set(node.feId, node);
        while (nodes[i + 1] && nodes[i + 1].depth == undefined) {
          const subNode = nodes[++i];
          subNode.generated = true;
          subNode.type = 'content';
          if (node) {
            subNode.parent_id = node.feId;
            node.contents.push(subNode);
          } else {
            subNode.parent_id = localParent.feId;
            localParent.contents.push(subNode);
          }
          updateSections.push(cloneDeep(subNode));
          nodeMap.set(subNode.feId, subNode);
        }
      } else {
        node.generated = true;
        node.type = 'content';
        node.parent_id = parent.feId;
        parent.sections.push(node);
        updateSections.push(cloneDeep(node));
        nodeMap.set(node.feId, node);
      }
    }
    return { nodeMap, rootNodes, updateSections };
  }
  private getParent(depth, depthMap) {
    let i = depth >= 0 ? depth : depthMap.size;
    console.log('getParent: depth:', depth, depthMap.get(depth));
    while (!depthMap.get(i)) {
      i--;
      console.log('getParent: depth:', depth, depthMap.get(depth));
      if (i < 0) throw new Error('getParent: no parent found');
    }
    return depthMap.get(i);
  }
  private parseNodes(nodes: ContentNode[]) {
    nodes.forEach((node) => {
      this.parse(node);
    });
    return nodes;
  }
  private parse(node: ContentNode) {
    const text = node.text;
    if (!text) return;
    if (text.startsWith('- ###### ')) {
      node.depth = 6;
      node.type = 'heading';
      node.name = text.substring(9);
    } else if (text.startsWith('###### ')) {
      node.depth = 6;
      node.type = 'heading';
      node.name = text.substring(7);
    } else if (text.startsWith('- ##### ')) {
      node.depth = 5;
      node.type = 'heading';
      node.name = text.substring(8);
    } else if (text.startsWith('##### ')) {
      node.depth = 5;
      node.type = 'heading';
      node.name = text.substring(6);
    } else if (text.startsWith('- #### ')) {
      node.depth = 4;
      node.type = 'heading';
      node.name = text.substring(7);
    } else if (text.startsWith('#### ')) {
      node.depth = 4;
      node.type = 'heading';
      node.name = text.substring(5);
    } else if (text.startsWith('- ### ')) {
      node.depth = 3;
      node.type = 'heading';
      node.name = text.substring(6);
    } else if (text.startsWith('### ')) {
      node.depth = 3;
      node.type = 'heading';
      node.name = text.substring(4);
    } else if (text.startsWith('- ## ')) {
      node.depth = 2;
      node.type = 'heading';
      node.name = text.substring(5);
    } else if (text.startsWith('## ')) {
      node.depth = 2;
      node.type = 'heading';
      node.name = text.substring(3);
    } else if (text.startsWith('- # ')) {
      node.depth = 1;
      node.type = 'heading';
      node.name = text.substring(2);
    } else if (text.startsWith('# ')) {
      node.depth = 1;
      node.type = 'heading';
      node.name = text.substring(2);
    } else if (/^[0-9]+\./.test(text)) {
      try {
        node.depth = 1;
        const name = text.match(/^\d+\.\s(.+)$/)![1];
        node.name = name;
        node.type = 'heading';
      } catch (e) {
        console.error('parseNodes: skipped - error parsing:', text);
      }
    } else if (text.startsWith('- [')) {
      node.type = 'content';
      node.name = text.replace(/.*\[(.*?)\.*]/g, '$1');
    } else if (text.startsWith('- ')) {
      node.type = 'content';
      node.name = text.substring(2);
    } else if (text.startsWith(' - ')) {
      node.type = 'content';
      node.name = text.substring(3);
    } else if (text.startsWith('  - ')) {
      node.type = 'content';
      node.name = text.substring(4);
    } else {
      node.type = 'content';
      node.name = text;
    }
    return node;
  }
}
