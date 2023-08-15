import { Injectable } from '@angular/core';
import { FileTreeFile, FileTreeNode } from '../models/file-tree.model';
import { cloneDeep } from 'lodash';
import { DataService } from '../services/data.service';
import { ServiceLogger } from '../logger/loggers';
import { MarkdownParserService } from './markdown-parser.service';
import { ContentSection } from '../models/section.model';

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
    let currentH1, currentH2, currentH3, parent;
    function getParent() {
      return currentH3 || currentH2 || currentH1 || rootNode;
    }
    const sections = cloneDeep(rootNode.sections);
    rootNode.sections = [];
    for (const section of sections) {
      console.log('sections:', rootNode.sections);
      if (section.parent_id !== -1) {
        // already exists
        rootNode.sections.push(section);
        continue;
      } // skip existing sections
      MarkdownParserService.parse(section);
      switch (section.textType) {
        case Token.H1:
          this.logStart(
            'h1',
            currentH1,
            currentH2,
            currentH3,
            section,
            rootNode
          );
          if (rootNode.textType <= Token.H1) {
            console.warn(
              "Can't nest an h1 under anything less than a file - skipping section",
              section
            );
            continue;
          }
          section.parent_id = rootNode.id as number;
          section.parent_type = 'file';
          rootNode.sections.push(section);
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH1 = section;
          currentH2 = null;
          currentH3 = null;
          this.logEnd('h1', currentH1, currentH2, currentH3, section, rootNode);
          break;
        case Token.H2:
          this.logStart(
            'h2',
            currentH1,
            currentH2,
            currentH3,
            section,
            rootNode
          );
          if (rootNode.textType <= Token.H2) {
            console.warn(
              "Can't nest an h2 under anything less than a h1 - skipping section",
              section
            );
            continue;
          }
          parent = currentH1 || rootNode;
          section.parent_id = parent.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          parent.sections.push(section);
          currentH2 = section;
          currentH3 = null;
          this.logEnd('h2', currentH1, currentH2, currentH3, section, rootNode);
          break;
        case Token.H3:
          this.logStart(
            'h3',
            currentH1,
            currentH2,
            currentH3,
            section,
            rootNode
          );
          if (rootNode.textType <= Token.H3) {
            console.warn(
              "Can't nest an h3 under anything less than an h2  - skipping section",
              section
            );
            continue;
          }
          parent = currentH2 || currentH1 || rootNode;
          section.parent_id = currentH2.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH2.sections.push(section);
          this.logEnd('h3', currentH1, currentH2, currentH3, section, rootNode);
          break;
        case Token.CONTENT:
          this.logStart(
            'default',
            currentH1,
            currentH2,
            currentH3,
            section,
            rootNode
          );
          let parentId;
          section.type = 'content';
          section.parent_id = getParent().id;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          getParent().content.push(section);
          this.logEnd(
            'default',
            currentH1,
            currentH2,
            currentH3,
            section,
            rootNode
          );
          break;
        default:
          throw new Error('Invalid token type:' + JSON.stringify(section));
      }
    }
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
