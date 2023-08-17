import { Injectable } from '@angular/core';
import { FileTreeFile } from '../models/file-tree.model';
import { ContentSection } from '../models/section.model';
import { marked } from 'marked';
import { NodeFactory } from '../utils/node.factory';
import { Token } from './file-tree-builder.service';
import { cloneDeep } from 'lodash';

const slugger = new marked.Slugger();

@Injectable({
  providedIn: 'root',
})
export class TreeBuilderService {
  content = ['paragraph', 'list'];
  constructor() {}

  async generateNodes(rootNode: FileTreeFile | ContentSection) {
    // preprocess sections (adjust depths)
    this.preprocessNodes(rootNode);
    this.processNodes(rootNode);
    // adjust raw strings to match depth
    this.postprocessNodes(rootNode);
    return rootNode;
  }
  preprocessNodes(rootNode) {}
  postprocessNodes(rootNode) {}
  processNodes(rootNode) {
    let ancestors: ContentSection[] = [];
    const sections = cloneDeep(rootNode.sections);
    rootNode.sections = [];
    ancestors.push(rootNode as ContentSection);
    for (let section of sections) {
      if (section.id >= 0) {
        rootNode.sections.push(section);
        continue;
      }
      const tokens = marked.lexer(section.text!);
      for (let token of tokens) {
        if (this.content.indexOf(token.type) !== -1) {
          const parent = ancestors[ancestors.length - 1];
          parent.content.push(TreeBuilderService.tokenToSection(token, Token.CONTENT));
        } else if (token.type === 'heading') {
          ancestors.splice(token.depth);
          const parent = ancestors[ancestors.length - 1];
          const newSection = TreeBuilderService.tokenToSection(token);
          parent.sections.push(newSection);
          ancestors.push(newSection);
        }
      }
    }
  }
  static tokenToSection(token, textType?): ContentSection {
    return NodeFactory.createSection({
      id: Math.floor(Math.random() * 100000),
      text: token.raw,
      textType: textType ? textType : 7 - token.depth,
      name: token.text,
    });
  }
}
