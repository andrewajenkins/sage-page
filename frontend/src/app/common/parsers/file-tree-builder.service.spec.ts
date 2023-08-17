import { TestBed } from '@angular/core/testing';
import { FileTreeBuilderService, Token } from './file-tree-builder.service';
import { cloneDeep } from 'lodash';
import { FileTreeFile } from '../models/file-tree.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
const fileNode: TestNode = {
  id: 0,
  textType: Token.FILE,
  sections: [],
};
const h1Node: TestNode = {
  id: -1,
  textType: Token.H1,
  sections: [],
};
const h2Node: TestNode = {
  id: -1,
  textType: Token.H2,
  sections: [],
};
const h3Node: TestNode = {
  id: -1,
  textType: Token.H3,
  sections: [],
};
const h4Node: TestNode = {
  id: -1,
  textType: Token.H4,
  sections: [],
};
interface TestNode {
  id: number;
  name?: string;
  textType: Token;
  sections: TestNode[];
}
const tokens = [fileNode, h1Node, h2Node, h3Node, h4Node];
const createNode = function (token, name) {
  const targetNode = tokens.find((t) => t.textType === token);
  if (!targetNode) throw new Error('invalid token');
  const newNode = cloneDeep(targetNode);
  newNode.name = name;
  return newNode;
};
class DataService {}
describe('FileTreeBuilderService', () => {
  let service: FileTreeBuilderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include this line
      providers: [FileTreeBuilderService, { provide: DataService, useValue: {} }],
    });
    service = TestBed.inject(FileTreeBuilderService);
  });
  it('h1 drops for h1 root', () => {
    const h1 = createNode(Token.H1, 'h1');
    const h1Dupe = createNode(Token.H1, 'h1dupe');
    h1.sections.push(h1Dupe);
    service.preprocess(h1 as FileTreeFile);
    expect(h1Dupe.textType).toBe(Token.H2);
  });
  it('h1\\h2 drop for h1 root', () => {
    const h1 = createNode(Token.H1, 'h1');
    const h1Dupe = createNode(Token.H1, 'h1dupe');
    const h2 = createNode(Token.H2, 'h2');
    h1.sections.push(h1Dupe);
    h1.sections.push(h2);
    service.preprocess(h1 as FileTreeFile);
    expect(h1Dupe.textType).toBe(Token.H2);
    expect(h2.textType).toBe(Token.H3);
  });
});
