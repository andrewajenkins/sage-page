import { Injectable } from '@angular/core';
import { ContentNode } from '../models/content-node.model';

@Injectable({
  providedIn: 'root',
})
export class MarkdownExportService {
  constructor() {}

  downloadMarkdown(file: ContentNode, fileName: string = 'markdown.md') {
    const contentArray = dfs(file);
    const blob = new Blob([...contentArray], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
    document.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }
}
const headers = ['#', '##', '###', '####', '#####', '######'];
export const dfs = function (file: ContentNode) {
  let result: string[] = [];
  const processNode = (node: ContentNode | ContentNode) => {
    if (node.text) {
      result.push(headers[node.depth || -1] + ' ' + node.text + '  \n');
    }
    if (node.contents) {
      node.contents.forEach((content: ContentNode) => {
        if (content.text) {
          result.push(content.text + '  \n');
        }
      });
    }
    if (node.sections) {
      node.sections.forEach((section: ContentNode) => {
        processNode(section);
      });
    }
  };
  processNode(file);
  return result;
};
