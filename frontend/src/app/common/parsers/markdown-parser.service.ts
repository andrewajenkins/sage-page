import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class MarkdownParserService {
  constructor() {}

  static parse(node) {
    if (!node.text) return (node.text = node.name);
    const md = node.text[0];
    if (md.startsWith('#### ')) {
      node.textType = 'h4';
      node.name = md.substring(5);
    } else if (md.startsWith('### ')) {
      node.textType = 'h3';
      node.name = md.substring(4);
    } else if (md.startsWith('## ')) {
      node.textType = 'h2';
      node.name = md.substring(3);
    } else if (md.startsWith('# ')) {
      node.textType = 'h1';
      node.name = md.substring(2);
    } else if (md.startsWith('- [')) {
      node.textType = 'link';
      node.name = md.replace(/.*\[(.*?)\.*]/g, '$1');
    } else if (md.startsWith('- ')) {
      node.textType = 'bullet';
      node.name = md.substring(2);
    } else if (md.startsWith(' - ')) {
      node.textType = 'bullet';
      node.name = md.substring(3);
    } else if (md.startsWith('  - ')) {
      node.textType = 'bullet';
      node.name = md.substring(4);
    } else {
      node.textType = 'content';
      node.name = 'content';
    }

    return node;
  }
}
