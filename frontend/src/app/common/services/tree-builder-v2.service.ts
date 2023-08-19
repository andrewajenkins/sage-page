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
    return this.doUpdate(rootNode, rootNode);
  }

  private doUpdate(parentNode, rootNode) {
    // stringify the section nodes
    const docString: string = this.getDocString(parentNode);
    // lex
    console.log('docString:', docString);
    const lexResult: TokensList = marked.lexer(docString);
    const flattenResult: any = this.flattenResults(lexResult);
    // combine the tokens and the current nodes
    const annotatedNodes: ContentSection[] = this.mapTokensToNodes(flattenResult, [
      ...parentNode.content,
      ...parentNode.sections,
    ]);
    // first pull the top content off, it goes in the parent
    const { docNodes, parent } = this.getParentContent(annotatedNodes, parentNode);
    // demote/promote the nodes to match the parents depth
    const adjustedNodes: ContentSection[] = this.adjustNodes(docNodes, parent);
    // build the tree
    const { newTrees, newContent } = this.buildTree(adjustedNodes, rootNode);
    // put the new trees where the old doc nodes were
    const updatedParentNode: ContentSection = this.replaceNode(parent, newTrees, newContent);
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

  private mapTokensToNodes(lexResult: any, sections: ContentSection[]) {
    const newSections: ContentSection[] = [];
    lexResult = lexResult.filter((res) => {
      return res.type !== 'space';
    });
    for (let i = 0; i < sections.length; i++) {
      console.log('index:', i);
      let section = sections[i];
      const resSection = lexResult[i];
      if (!resSection || resSection.type == 'space') {
        console.warn('Some sections were merged and not parsed separately!', resSection, section);
        continue;
      }
      console.log(
        'mapping token:',
        ['paragraph', 'list'].indexOf(resSection.type) !== -1,
        resSection.type,
        resSection,
        section
      );

      if (['text', 'list_item'].indexOf(resSection.type) !== -1) {
        const list = resSection.type === 'list' ? resSection.items : resSection.tokens;
        let j = 0;
        // do {
        //   section = sections[i];
        const res = resSection;
        if (res.type == 'br') {
          console.warn('br token found, skipping', res, section);
          continue;
        }
        console.log('type: nested', res.type, res);
        section.lexType = resSection?.type || '';
        const newSection = { ...res, ...section };
        if (
          newSection.name.indexOf(newSection.text || 'NO_TEXT') == -1 &&
          (newSection.text || 'NO_TEXT').indexOf(newSection.name) === -1
        )
          console.error('NAME MISMATCH: map result: content: res:', res, 'section', section, 'newSection:', newSection);
        console.log('map result: content: res:', res, 'section', section, 'newSection:', newSection);
        newSections.push({ ...res, ...section });
        // if (j > 0) i++;
        // } while (list[++j]);
      } else {
        if (resSection.type == 'br') {
          console.warn('br token found, skipping', resSection, section);
          continue;
        }
        console.log('type: heading:', resSection?.type, resSection);
        section.lexType = resSection?.type || '';
        const newSection = { ...resSection, ...section };
        if (
          newSection.name.indexOf(newSection.text || 'NO_TEXT') == -1 &&
          (newSection.text || 'NO_TEXT').indexOf(newSection.name) === -1
        )
          console.error('NAME MISMATCH', newSection);
        else console.log('map result: section:', newSection);
        newSections.push({ ...section, ...resSection });
      }
    }
    console.log('mapping result:', newSections);
    return newSections;
  }

  private replaceNode(parent: ContentSection, newTrees: ContentSection[], newContent: ContentSection[]) {
    parent.sections = newTrees;
    parent.content = newContent;
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
  private buildTree(adjustedNodes: ContentSection[], rootNode) {
    const debug = true;
    if (debug) console.log('build: start:', adjustedNodes);
    let ancestors: ContentSection[] = [];
    const nodes = cloneDeep(adjustedNodes);
    const rootNodes: ContentSection[] = [];
    const newContent: ContentSection[] = [];
    for (let node of nodes) {
      if (debug) console.log('build: node:', node);
      const isContent = ['list_item', 'text'].indexOf(node.lexType || 'none') !== -1;
      if (isContent) {
        if (debug) console.log('build: pushing content:', node);
        const parent = ancestors[ancestors.length - 1] || rootNode;
        node.type = 'content';
        if (!node.generated) this.write(node, parent, Token.CONTENT);
        newContent.push(node);
        if (debug) console.log('build: result:', node, cloneDeep(parent));
      } else if (node.lexType === 'heading') {
        if (debug) console.log('build: pushing heading:', node);
        ancestors.splice((node.lexDepth || 0) - 1);
        const isTopLevel = ancestors.length == 0;
        const parent = isTopLevel ? rootNode : ancestors[ancestors.length - 1];
        if (!node.generated) this.write(node, parent, Token.NONE);
        isTopLevel ? rootNodes.push(node) : parent.sections.push(node);
        ancestors.push(node);
        console.log(
          'result: isTopLevel:',
          isTopLevel,
          'node:',
          cloneDeep(node),
          'parent:',
          cloneDeep(parent),
          'ancestors:',
          cloneDeep(ancestors)
        );
      } else {
        throw new Error('Failed to parse token:\n' + JSON.stringify(node, null, 2));
      }
    }
    console.log('build: end!');
    return { newTrees: rootNodes, newContent };
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
