import { TestBed } from '@angular/core/testing';
import { FileTreeBuilderService, Token } from './file-tree-builder.service';
import { cloneDeep } from 'lodash';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeBuilderService } from './tree-builder.service';
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
describe('TreeBuilderService', () => {
  let service: TreeBuilderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include this line
      providers: [TreeBuilderService, { provide: DataService, useValue: {} }],
    });
    service = TestBed.inject(TreeBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
