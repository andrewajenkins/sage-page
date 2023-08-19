import { Injectable } from '@angular/core';
import { ContentSection } from '../../models/section.model';
import { FileTreeFile, FileTreeNode } from '../../models/file-tree.model';
import { marked, TokensList } from 'marked';
import { cloneDeep } from 'lodash';
import { Token } from '../../parsers/file-tree-builder.service';
import { DataService } from '../data.service';
import { ServiceLogger } from '../../logger/loggers';
import { TreeBuilderV2MapperService } from './tree-builder-v2-mapper.service';
import { TreeBuilderV2BuilderService } from './tree-builder-v2-builder.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV2Service {
  constructor(private mapper: TreeBuilderV2MapperService, private builder: TreeBuilderV2BuilderService) {}

  update(rootNode: FileTreeFile | ContentSection) {
    const result = this.doUpdate(rootNode, rootNode);
  }

  private doUpdate(parentNode, rootNode) {
    // stringify the section nodes
    const docString: string = this.getDocString(parentNode);
    // lex
    console.log('docString:', docString);
    const lexResult: TokensList = marked.lexer(docString);
    const flattenResult: any = this.flattenResults(lexResult);
    // combine the tokens and the current nodes
    const annotatedNodes: ContentSection[] = this.mapper.mapTokensToNodes(flattenResult, [
      ...parentNode.content,
      ...parentNode.sections,
    ]);
    // first pull the top content off, it goes in the parent
    const { docNodes, parent } = this.getParentContent(annotatedNodes, parentNode);
    // demote/promote the nodes to match the parents depth
    const adjustedNodes: ContentSection[] = this.adjustNodes(docNodes, parent);
    // build the tree
    const newTrees = this.builder.buildTree(adjustedNodes, rootNode);
    // put the new trees where the old doc nodes were
    const updatedParentNode: ContentSection = this.replaceNode(parent, newTrees);
    return updatedParentNode;
  }

  private flattenResults(lexResult: TokensList) {
    const result: any[] = [];
    const flatten = (section): any => {
      if (section.type === 'list') {
        section.items.forEach((item) => {
          result.push(item);
        });
      } else if (section.type === 'paragraph') {
        section.tokens.forEach((token) => {
          result.push(token);
        });
      } else {
        result.push(section);
      }
    };
    lexResult.forEach((section) => {
      flatten(section);
    });
    return result;
  }
  // asdf;

  private getParentContent(annotatedNodes: ContentSection[], parent: ContentSection): any {
    const contentTypes = ['paragraph', 'list'];
    // for (let node of annotatedNodes) {
    let index = 0;
    while (index < annotatedNodes.length) {
      const node = annotatedNodes[index];
      if (node.lexType && contentTypes.indexOf(node.lexType) !== -1) {
        parent.content.push(annotatedNodes.shift() as ContentSection);
      } else break;
    }
    return { docNodes: annotatedNodes, parent };
  }

  private getDocString(parent: ContentSection): string {
    const contentString = parent.content.map((content) => content.text).join('  \n');
    const sectionString = parent.sections.map((section) => section.text).join('  \n');
    const docString = contentString + '  \n' + sectionString;
    return docString;
  }

  private replaceNode(parent: ContentSection, newTrees: ContentSection[]) {
    parent.sections = newTrees;
    return parent;
  }
  private adjustNodes(docNodes: ContentSection[], parent: ContentSection) {
    docNodes = this.adjustForDoc(docNodes);
    docNodes = this.adjustForParent(docNodes, parent);

    return docNodes;
  }
  adjustForDoc(docNodes): ContentSection[] {
    let minDepth = 100;
    docNodes.forEach((node) => {
      if (node.depth && node.depth < minDepth) {
        minDepth = node.depth;
      }
    });
    minDepth--;
    docNodes.forEach((node) => {
      if (node.depth) {
        node.depth -= minDepth;
      }
    });
    return docNodes;
  }
  adjustForParent(docNodes, parent): ContentSection[] {
    const offset = 7 - parent.textType;
    for (let node of docNodes) {
      if (!!node.depth && node.depth > -1) {
        node.lexDepth = node.depth;
        node.depth += offset;
      }
    }
    return docNodes;
  }
}
