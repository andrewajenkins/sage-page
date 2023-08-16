import { Injectable } from '@angular/core';
import { FileTreeFile } from '../models/file-tree.model';
import { ContentSection } from '../models/section.model';

@Injectable({
  providedIn: 'root',
})
export class MarkdownExportService {
  constructor() {}

  downloadMarkdown(file: FileTreeFile, fileName: string = 'markdown.md') {
    const contentArray = this.dfs(file);
    const blob = new Blob([...contentArray], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
    document.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }

  dfs(file: FileTreeFile) {
    let result: string[] = [];
    const processNode = (node: FileTreeFile | ContentSection) => {
      if (node.text) {
        result.push(node.text + '\n');
      }
      if (node.content) {
        node.content.forEach((content: ContentSection) => {
          if (content.text) {
            result.push(content.text + '\n');
          }
        });
      }
      if (node.sections) {
        node.sections.forEach((section: ContentSection) => {
          processNode(section);
        });
      }
    };
    processNode(file);
    return result;
  }
}