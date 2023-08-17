import { Injectable } from '@angular/core';
import { FileTreeFile } from '../models/file-tree.model';
import { ContentSection } from '../models/section.model';
import { marked } from 'marked';
import { NodeFactory } from '../utils/node.factory';
import { Token } from './file-tree-builder.service';
import { cloneDeep } from 'lodash';
import { DataService } from '../services/data.service';

const slugger = new marked.Slugger();

@Injectable({
  providedIn: 'root',
})
export class TreeBuilderService {
  content = ['paragraph', 'list'];
  constructor(private dataService: DataService) {}

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
          parent.content.push(this.tokenToSection(token, Token.CONTENT, parent));
        } else if (token.type === 'heading') {
          ancestors.splice(token.depth);
          const parent = ancestors[ancestors.length - 1];
          const newSection = this.tokenToSection(token, -1, parent);
          parent.sections.push(newSection);
          ancestors.push(newSection);
        }
      }
    }
  }
  tokenToSection(token, textType?, parent?): ContentSection {
    if (parent.depth) {
      token.depth = parent.depth + 1;
    }
    const depth = token.depth ? 7 - token.depth : -1;
    const result = NodeFactory.createSection({
      id: Math.floor(Math.random() * 1000000),
      text: token.raw,
      textType: textType >= 0 ? textType : depth,
      name: token.text ? token.text : token.items[0]?.text,
      parent_id: parent.id,
      parent_type: 'section',
      type: textType >= 0 ? 'content' : 'section',
      depth: token.depth,
    });
    this.dataService.createSection(result).subscribe((resp) => {});
    return result;
  }
}
