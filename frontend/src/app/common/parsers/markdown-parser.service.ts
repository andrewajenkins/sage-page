import { Injectable } from '@angular/core';
import { ServiceLogger } from '../logger/loggers';
import { Token } from './file-tree-builder.service';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class MarkdownParserService {
  constructor() {}

  static parse(node) {
    if (!node.text) return (node.text = [node.name]);
    const md = node.text[0];
    if (md.startsWith('#### ')) {
      node.textType = Token.H4;
      node.name = md.substring(5);
    } else if (md.startsWith('### ')) {
      (node.textType = Token.H3), (node.name = md.substring(4));
    } else if (md.startsWith('## ')) {
      (node.textType = Token.H2), (node.name = md.substring(3));
    } else if (md.startsWith('# ')) {
      (node.textType = Token.H1), (node.name = md.substring(2));
    } else if (md.startsWith('- [')) {
      node.textType = Token.CONTENT;
      node.name = md.replace(/.*\[(.*?)\.*]/g, '$1');
    } else if (md.startsWith('- ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(2);
    } else if (md.startsWith(' - ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(3);
    } else if (md.startsWith('  - ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(4);
    } else {
      node.textType = Token.CONTENT;
      node.name = md;
    }

    return node;
  }
}
