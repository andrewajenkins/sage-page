import { Injectable } from '@angular/core';
import { FileTreeFile } from '../models/file-tree.model';
import { DataService } from '../services/data.service';
import { ServiceLogger } from '../logger/loggers';
import { MarkdownParserService } from './markdown-parser.service';
import { ContentSection } from '../models/section.model';
import { clone } from 'lodash'; // used below

export const enum Token {
  CONTENT,
  H6,
  H5,
  H4,
  H3,
  H2,
  H1,
  FILE,
}

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class FileTreeBuilderService {
  constructor(private dataService: DataService) {}

  async generateNodes(rootNode: FileTreeFile | ContentSection) {
    let currentH1, currentH2, currentH3, currentH4, currentH5, currentH6;
    const newRoot: FileTreeFile | ContentSection = clone(rootNode);
    newRoot.sections = [];
    function getParent() {
      return currentH3 || currentH2 || currentH1 || newRoot;
    }
    for (const section of rootNode.sections) {
      if (section.parent_id !== -1) {
        // already exists
        newRoot.sections.push(section);
        continue;
      } // skip existing sections
      MarkdownParserService.parse(section);
      const logStart = (token) => {
        this.logStart(token, currentH1, currentH2, currentH3, section, newRoot);
      };
      const logEnd = (token) => {
        this.logEnd(token, currentH1, currentH2, currentH3, section, newRoot);
      };
      const skipLower = (name, minParent, token) => {
        const msg1 = "Can't nest an " + name;
        const msg2 =
          'under anything less than a ' + minParent + ' - skipping section';
        if (newRoot.textType <= token) {
          console.warn(msg1, msg2, section);
          return true;
        }
        return false;
      };
      const writeNode = async (parent_id, parent_type) => {
        section.parent_id = parent_id;
        section.parent_type = parent_type;
        section.id = await this.dataService.createSection(section).toPromise();
      };
      switch (section.textType) {
        case Token.H1:
          if (skipLower('h1', 'file', Token.H1)) continue;
          await writeNode(newRoot.id, 'file');
          newRoot.sections.push(section);
          currentH1 = clone(section);
          currentH2 = null;
          currentH3 = null;
          currentH4 = null;
          currentH5 = null;
          currentH6 = null;
          break;
        case Token.H2:
          if (skipLower('h2', 'h1', Token.H2)) continue;
          const h2Parent = currentH1 || newRoot;
          await writeNode(h2Parent.id, 'section');
          h2Parent.sections.push(section);
          currentH2 = clone(section);
          currentH3 = null;
          currentH4 = null;
          currentH5 = null;
          currentH6 = null;
          break;
        case Token.H3:
          if (skipLower('h3', 'h2', Token.H3)) continue;
          const h3Parent = currentH2 || currentH1 || newRoot;
          await writeNode(h3Parent.id, 'section');
          h3Parent.sections.push(section);
          currentH3 = clone(section);
          currentH4 = null;
          currentH5 = null;
          currentH6 = null;
          break;
        case Token.H4:
          if (skipLower('h4', 'h3', Token.H4)) continue;
          const h4Parent = currentH2 || currentH1 || newRoot;
          await writeNode(h4Parent.id, 'section');
          h4Parent.sections.push(section);
          currentH4 = clone(section);
          currentH5 = null;
          currentH6 = null;
          break;
        case Token.H5:
          if (skipLower('h5', 'h4', Token.H5)) continue;
          const h5Parent = currentH2 || currentH1 || newRoot;
          await writeNode(h5Parent.id, 'section');
          h5Parent.sections.push(section);
          currentH5 = clone(section);
          currentH6 = null;
          break;
        case Token.H6:
          if (skipLower('h6', 'h5', Token.H6)) continue;
          const h6Parent = currentH2 || currentH1 || newRoot;
          await writeNode(h6Parent.id, 'section');
          h6Parent.sections.push(section);
          currentH6 = clone(section);
          break;
        case Token.CONTENT:
          let parentId;
          section.type = 'content';
          await writeNode(getParent().id, 'section');
          getParent().content.push(section);
          break;
        default:
          throw new Error('Invalid token type:' + JSON.stringify(section));
      }
    }
    rootNode.sections = newRoot.sections;
    rootNode.content = newRoot.content;
    return rootNode;
  }
  logStart(el, h1, h2, h3, node, root) {
    console.log('start: el:', el);
    console.log('start: h1:', JSON.stringify(h1));
    console.log('start: h2:', JSON.stringify(h2));
    console.log('start: h3:', JSON.stringify(h3));
    console.log('start: section:', JSON.stringify(node));
    console.log('start: root:', JSON.stringify(root));
  }
  logEnd(el, h1, h2, h3, node, root) {
    console.log('end: el:', el);
    console.log('end: h1:', JSON.stringify(h1));
    console.log('end: h2:', JSON.stringify(h2));
    console.log('end: h3:', JSON.stringify(h3));
    console.log('end: section:', JSON.stringify(node));
    console.log('end: root:', JSON.stringify(root));
  }
}
