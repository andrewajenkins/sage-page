import { Injectable } from '@angular/core';
import { FileTreeFile } from '../models/file-tree.model';
import { DataService } from '../services/data.service';
import { ServiceLogger } from '../logger/loggers';
import { MarkdownParserService } from './markdown-parser.service';
import { ContentSection } from '../models/section.model';
import { clone } from 'lodash'; // used below

export const enum Token {
  CONTENT,
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
    let currentH1, currentH2, currentH3;
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
        if (newRoot.textType <= token) {
          console.warn(
            "Can't nest an " +
              name +
              ' under anything less than a ' +
              minParent +
              ' - skipping section',
            section
          );
          return true;
        }
        return false;
      };
      switch (section.textType) {
        case Token.H1:
          logStart('h1');
          if (skipLower('h1', 'file', Token.H1)) continue;
          section.parent_id = newRoot.id as number;
          section.parent_type = 'file';
          newRoot.sections.push(section);
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH1 = clone(section);
          currentH2 = null;
          currentH3 = null;
          logEnd('h1');
          break;
        case Token.H2:
          logStart('h2');
          if (skipLower('h2', 'h1', Token.H2)) continue;
          const h2Parent = currentH1 || newRoot;
          section.parent_id = h2Parent.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          h2Parent.sections.push(section);
          currentH2 = clone(section);
          currentH3 = null;
          logEnd('h2');
          break;
        case Token.H3:
          logStart('h3');
          if (skipLower('h3', 'h2', Token.H3)) continue;
          const h3Parent = currentH2 || currentH1 || newRoot;
          section.parent_id = h3Parent.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          h3Parent.sections.push(section);
          currentH3 = clone(section);
          logEnd('h3');
          break;
        case Token.CONTENT:
          logStart('default');
          let parentId;
          section.type = 'content';
          section.parent_id = getParent().id;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          getParent().content.push(section);
          logEnd('default');
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
