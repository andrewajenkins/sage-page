import { Injectable } from '@angular/core';
import { FileTreeFile, FileTreeNode } from '../models/file-tree.model';
import { cloneDeep } from 'lodash';
import { DataService } from '../services/data.service';
import { ServiceLogger } from '../logger/loggers';
import { MarkdownParserService } from './markdown-parser.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class FileTreeBuilderService {
  constructor(private dataService: DataService) {}

  async generateNodes(file: FileTreeFile) {
    const contents = cloneDeep(file.sections);
    file.sections = [];
    let currentH1, currentH2, currentH3;

    for (const section of contents) {
      MarkdownParserService.parse(section);
      switch (section.textType) {
        case 'h1':
          this.logStart('h1', currentH1, currentH2, currentH3, section);
          section.parent_id = file.id as number;
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
        case 'h2':
          this.logStart('h2', currentH1, currentH2, currentH3, section);
          section.parent_id = currentH1.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH1.sections.push(section);
          currentH2 = section;
          currentH3 = null;
          this.logEnd('h2', currentH1, currentH2, currentH3, section);
          break;
        case 'h3':
          this.logStart('h3', currentH1, currentH2, currentH3, section);
          section.parent_id = currentH2.id as number;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          currentH2.sections.push(currentH3);
          this.logEnd('h3', currentH1, currentH2, currentH3, section);
          break;
        case 'section':
          this.logStart('section', currentH1, currentH2, currentH3, section);
          if (currentH3) {
            this.appendContent(currentH3, section.text);
          } else if (currentH2) {
            this.appendContent(currentH2, section.text);
          } else if (currentH1) {
            this.appendContent(currentH1, section.text);
          }
          // send content to backend
          this.logEnd('section', currentH1, currentH2, currentH3, section);
          break;
        case 'bullet':
          this.logStart('bullet', currentH1, currentH2, currentH3, section);
          let parentId;
          if (currentH3) {
            this.appendContent(currentH3, section.text);
          } else if (currentH2) {
            this.appendContent(currentH2, section.text);
          } else if (currentH1) {
            this.appendContent(currentH1, section.text);
          }
          this.logEnd('bullet', currentH1, currentH2, currentH3, section);
          break;
        case 'link':
          // this.logStart('link', currentH1, currentH2, currentH3, section);
          // section.parent_id = currentH2.id as number;
          // section.parent_type = 'section';
          // section.id = await this.dataService
          //   .createSection(section)
          //   .toPromise();
          // if (!section.sections) section.sections = [];
          // currentH2.sections.push(currentH3);
          // this.logEnd('link', currentH1, currentH2, currentH3, section);
          break;
        default:
          this.logStart('default', currentH1, currentH2, currentH3, section);
          this.logEnd('default', currentH1, currentH2, currentH3, section);
          break;
      }
    }
  }
  appendContent(src, content) {
    if (src.content) {
      src.content += '\n' + content;
    } else {
      src.content = content;
    }
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
