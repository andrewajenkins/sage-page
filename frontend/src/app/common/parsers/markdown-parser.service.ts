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
    if (!node.text) return (node.text = node.name);
    const md = node.text;
    if (md.startsWith('- ###### ')) {
      node.textType = Token.H6;
      node.name = md.substring(9);
      node.bulletedText = true;
    } else if (md.startsWith('###### ')) {
      node.textType = Token.H6;
      node.name = md.substring(7);
    } else if (md.startsWith('- ##### ')) {
      node.textType = Token.H5;
      node.name = md.substring(8);
      node.bulletedText = true;
    } else if (md.startsWith('##### ')) {
      node.textType = Token.H5;
      node.name = md.substring(6);
    } else if (md.startsWith('- #### ')) {
      node.textType = Token.H4;
      node.name = md.substring(7);
      node.bulletedText = true;
    } else if (md.startsWith('#### ')) {
      node.textType = Token.H4;
      node.name = md.substring(5);
    } else if (md.startsWith('- ### ')) {
      (node.textType = Token.H3), (node.name = md.substring(6));
      node.bulletedText = true;
    } else if (md.startsWith('### ')) {
      (node.textType = Token.H3), (node.name = md.substring(4));
    } else if (md.startsWith('- ## ')) {
      (node.textType = Token.H2), (node.name = md.substring(5));
      node.bulletedText = true;
    } else if (md.startsWith('## ')) {
      (node.textType = Token.H2), (node.name = md.substring(3));
    } else if (md.startsWith('- # ')) {
      (node.textType = Token.H1), (node.name = md.substring(2));
      node.bulletedText = true;
    } else if (md.startsWith('# ')) {
      (node.textType = Token.H1), (node.name = md.substring(2));
    } else if (md.startsWith('- [')) {
      node.textType = Token.CONTENT;
      node.name = md.replace(/.*\[(.*?)\.*]/g, '$1');
    } else if (md.startsWith('- ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(2);
      node.bulletedText = true;
    } else if (md.startsWith(' - ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(3);
      node.bulletedText = true;
    } else if (md.startsWith('  - ')) {
      node.textType = Token.CONTENT;
      node.name = md.substring(4);
      node.bulletedText = true;
    } else {
      node.textType = Token.CONTENT;
      node.name = md;
    }

    return node;
  }
}

// const str = '- ##### Some text';
// const match = str.match(/(#+)(?=\s)/);
//
// if (match) {
//   const lastHash = match[1].slice(-1); // Gets the last #
//   console.log(lastHash); // Outputs: #
// }
