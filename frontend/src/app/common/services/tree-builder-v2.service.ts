import { Injectable } from '@angular/core';
import { ContentSection } from '../models/section.model';
import { FileTreeFile, FileTreeNode } from '../models/file-tree.model';
import { marked, TokensList } from 'marked';
import { cloneDeep } from 'lodash';
import { Token } from '../parsers/file-tree-builder.service';
import { DataService } from './data.service';
import { ServiceLogger } from '../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV2Service {
  constructor(private dataService: DataService) {}

  update(rootNode: FileTreeFile | ContentSection) {
    this.doUpdate(rootNode, rootNode);
  }

  private doUpdate(parentNode, rootNode) {
    // stringify the section nodes
    const docString: string = this.getDocString(parentNode.sections);
    // lex
    console.log('docString:', docString);
    const lexResult: TokensList = marked.lexer(docString);
    // combine the tokens and the current nodes
    const annotatedNodes: ContentSection[] = this.mapTokensToNodes(lexResult, parentNode.sections);
    // first pull the top content off, it goes in the parent
    const { docNodes, parent } = this.getParentContent(annotatedNodes, parentNode);
    // demote/promote the nodes to match the parents depth
    const adjustedNodes: ContentSection[] = this.adjustNodes(docNodes, parent);
    // build the tree
    const newTrees = this.buildTree(adjustedNodes, rootNode);
    // put the new trees where the old doc nodes were
    const updatedParentNode: ContentSection = this.replaceNode(parent, newTrees);
  }

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

  private getDocString(doc: ContentSection[]): string {
    const docString = doc.map((section) => section.text).join('  \n');
    return docString;
  }

  private mapTokensToNodes(lexResult: TokensList, sections: ContentSection[]) {
    const newSections: ContentSection[] = [];
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const resSection = lexResult[i];
      console.log('mapping token:', resSection, section);
      if (['paragraph', 'list'].indexOf(resSection.type) !== -1) {
        for (let res of resSection.tokens || []) {
          if (res.type == 'br') continue;
          console.log('type: nested', res.type, res);
          section.lexType = res?.type || '';
          newSections.push({ ...section, ...res });
          i++;
        }
      } else {
        if (resSection?.type == 'br') continue;
        console.log('type: heading:', resSection?.type, resSection);
        section.lexType = resSection?.type || '';
        newSections.push({ ...section, ...resSection });
      }
    }
    // asdfsadf;
    return newSections;
  }

  private replaceNode(parent: ContentSection, newTrees: ContentSection[]) {
    parent.sections = newTrees;
    return {} as ContentSection;
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
  private buildTree(adjustedNodes: ContentSection[], rootNode) {
    const debug = true;
    if (debug) console.log('build: start:', adjustedNodes);
    let ancestors: ContentSection[] = [];
    const nodes = cloneDeep(adjustedNodes);
    const rootNodes: ContentSection[] = [];
    for (let node of nodes) {
      if (debug) console.log('build: node:', node);
      const isContent = ['paragraph', 'list', 'text'].indexOf(node.lexType || 'none') !== -1;
      if (isContent) {
        if (debug) console.log('build: pushing content:', node);
        const parent = ancestors[ancestors.length - 1] || rootNode;
        node.type = 'content';
        if (!node.generated) this.write(node, parent, Token.CONTENT);
        parent.content.push(node);
      } else if (node.lexType === 'heading') {
        if (debug) console.log('build: pushing heading:', node);
        ancestors.splice((node.lexDepth || 0) - 1);
        const isTopLevel = ancestors.length == 0;
        const parent = isTopLevel ? rootNode : ancestors[ancestors.length - 1];
        if (!node.generated) this.write(node, parent, Token.NONE);
        isTopLevel ? rootNodes.push(node) : parent.sections.push(node);
        ancestors.push(node);
      } else {
        throw new Error('Failed to parse token:\n' + JSON.stringify(node, null, 2));
      }
    }
    console.log('build: end!');
    return rootNodes;
  }

  private write(node: ContentSection, parent: ContentSection, token: Token) {
    node.id = Math.floor(Math.random() * 1000000);
    node.textType = 7 - (node.depth || -8);
    node.parent_id = parent.id || -1;
    node.parent_type = 'section';
    node.generated = true;
    this.dataService.createSection(node).subscribe(() => {});
  }
}
