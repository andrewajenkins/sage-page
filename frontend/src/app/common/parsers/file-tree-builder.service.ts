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
}

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class FileTreeBuilderService {
  constructor(private dataService: DataService) {}

  async generateNodes(file: FileTreeFile | ContentSection) {
    let currentH1, currentH2, currentH3, parent;
    function getParent() {
      return currentH3 || currentH2 || currentH1 || file;
    }
    const sections = cloneDeep(file.sections);
    file.sections = [];
    for (const section of sections) {
      console.log('sections:', file.sections);
      if (section.parent_id !== -1) {
        // already exists
        file.sections.push(section);
        continue;
      } // skip existing sections
      MarkdownParserService.parse(section);
      switch (section.textType) {
        case Token.H1:
          this.logStart('h1', currentH1, currentH2, currentH3, section);
          if (file.textType <= Token.H1) section.parent_id = file.id as number;
          section.parent_type = 'file';
          file.sections.push(section);
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH1 = section;
          currentH2 = null;
          currentH3 = null;
          this.logEnd('h1', currentH1, currentH2, currentH3, section);
          break;
        case Token.H2:
          this.logStart('h2', currentH1, currentH2, currentH3, section);
          parent = currentH1 || file;
          section.parent_id = parent.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          parent.sections.push(section);
          currentH2 = section;
          currentH3 = null;
          this.logEnd('h2', currentH1, currentH2, currentH3, section);
          break;
        case Token.H3:
          parent = currentH2 || currentH1 || file;
          this.logStart('h3', currentH1, currentH2, currentH3, section);
          section.parent_id = currentH2.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH2.sections.push(section);
          this.logEnd('h3', currentH1, currentH2, currentH3, section);
          break;
        case Token.CONTENT:
          this.logStart('default', currentH1, currentH2, currentH3, section);
          let parentId;
          section.type = 'content';
          section.parent_id = getParent().id;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          getParent().content.push(section);
          this.logEnd('default', currentH1, currentH2, currentH3, section);
          break;
        default:
          throw new Error('Invalid token type:' + JSON.stringify(section));
      }
    }
    return file;
  }
  logStart(el, h1, h2, h3, node) {
    console.log('start: el:', el);
    // console.log('start: h1:', JSON.stringify(h1));
    // console.log('start: h2:', JSON.stringify(h2));
    // console.log('start: h3:', JSON.stringify(h3));
    // console.log('start: node:', JSON.stringify(node));
  }
  logEnd(el, h1, h2, h3, node) {
    console.log('end: el:', el);
    // console.log('end: h1:', JSON.stringify(h1));
    // console.log('end: h2:', JSON.stringify(h2));
    // console.log('end: h3:', JSON.stringify(h3));
    // console.log('end: node:', JSON.stringify(node));
  }
}
