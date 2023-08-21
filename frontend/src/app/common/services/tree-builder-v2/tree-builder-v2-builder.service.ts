import { Injectable } from '@angular/core';
import { ContentSection } from '../../models/section.model';
import { cloneDeep } from 'lodash';
import { Token } from '../../parsers/file-tree-builder.service';
import { DataService } from '../data.service';
import { ServiceLogger } from '../../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV2BuilderService {
  constructor(private dataService: DataService) {}
  buildTree(adjustedNodes: ContentSection[], rootNode) {
    let ancestors: ContentSection[] = [];
    // const nodes = cloneDeep(adjustedNodes);
    const nodes = [];
    const rootNodes: ContentSection[] = [];
    for (let node of adjustedNodes) {
      this.buildNode(node, rootNode, ancestors, rootNodes);
    }
    return rootNodes;
  }
  private buildNode(node: ContentSection, rootNode, ancestors: ContentSection[], rootNodes: ContentSection[]) {
    const isContent = ['list_item', 'text'].indexOf(node.lexType || 'none') !== -1;
    if (isContent) {
      this.buildContent(node, rootNode, ancestors);
    } else if (node.lexType === 'heading') {
      this.buildSection(node, rootNode, ancestors, rootNodes);
    } else {
      throw new Error('Failed to parse token:\n' + JSON.stringify(node, null, 2));
    }
  }
  private buildContent(node: ContentSection, rootNode, ancestors: ContentSection[]) {
    const parent = ancestors[ancestors.length - 1] || rootNode;
    node.type = 'content';
    if (!node.generated) this.write(node, parent, Token.CONTENT);
    this.pushContent(node, parent, rootNode, ancestors);
  }
  private buildSection(node: ContentSection, rootNode, ancestors: ContentSection[], rootNodes: ContentSection[]) {
    ancestors.splice((node.lexDepth || 0) - 1);
    this.pushSection(rootNode, node, ancestors, rootNodes);

    ancestors.push(node);
  }
  private pushSection(
    rootNode: ContentSection,
    node: ContentSection,
    ancestors: ContentSection[],
    rootNodes: ContentSection[]
  ) {
    const isTopLevel = ancestors.length == 0;
    const parent = isTopLevel ? rootNode : ancestors[ancestors.length - 1];
    if (!node.generated) this.write(node, parent, Token.NONE);
    if (isTopLevel) rootNodes.push(node);
    else {
      this.removeDupes(parent, node);
      parent.sections.push(node);
    }
  }
  private removeDupes(parent, node: ContentSection) {
    parent.content = parent.content.filter((content) => {
      if (content.id != node.id)
        console.warn(
          'removeDupes: content:',
          content.id,
          node.id,
          'content text:',
          content.text,
          'node text:',
          node.text
        );
      return content.id != node.id;
    });
    parent.sections = parent.sections.filter((content) => {
      if (content.id != node.id) console.warn('removeDupes: sections:', content.id, node.id, content.text, node.text);
      return content.id != node.id;
    });
  }
  private pushContent(node: ContentSection, parent: ContentSection, _rootNode, _ancestors: ContentSection[]) {
    this.removeDupes(parent, node);
    parent.content.push(node);
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
