import { Injectable } from '@angular/core';
import { FileTreeFile, FileTreeNode } from '../models/file-tree.model';
import { cloneDeep } from 'lodash';
import { DataService } from '../services/data.service';
import { ServiceLogger } from '../logger/loggers';
import { MarkdownParserService } from './markdown-parser.service';
import { ContentSection } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class FileTreeBuilderService {
  constructor(private dataService: DataService) {}

  async generateNodes(file: FileTreeFile) {
    let currentH1, currentH2, currentH3;
    function getParent() {
      return currentH3 || currentH2 || currentH1;
    }
    for (const section of file.sections) {
      if (section.parent_id !== -1) continue; // skip existing sections
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
          currentH2.sections.push(section);
          this.logEnd('h3', currentH1, currentH2, currentH3, section);
          break;
        // case 'section':
        //   this.logStart('section', currentH1, currentH2, currentH3, section);
        //   if (currentH3) {
        //     currentH3.text.push(section.text);
        //   } else if (currentH2) {
        //     currentH2.text.push(section.text);
        //   } else if (currentH1) {
        //     currentH1.text.push(section.text);
        //   }
        //   // send content to backend
        //   this.logEnd('section', currentH1, currentH2, currentH3, section);
        //   break;
        case 'bullet':
          this.logStart('bullet', currentH1, currentH2, currentH3, section);
          let parentId;
          section.type = 'content';
          section.parent_id = getParent().id;
          section.parent_type = 'section';
          section.id = await this.dataService
            .createSection(section)
            .toPromise();
          if (!section.sections) section.sections = [];
          getParent().content.push(section);
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
          throw new Error('Failed to parse section:' + JSON.stringify(section));
          this.logEnd('default', currentH1, currentH2, currentH3, section);
          break;
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
