import { TestBed } from '@angular/core/testing';
import { FileTreeBuilderService, Token } from './file-tree-builder.service';
import { cloneDeep, isMatch } from 'lodash';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeBuilderService } from './tree-builder.service';
import { FileTreeFile } from '../models/file-tree.model';
import { ContentSection } from '../models/section.model';
const fileNode: TestNode = {
  id: 0,
  textType: Token.FILE,
  sections: [],
  text: 'File node!',
  depth: 0,
};
const h1Node: TestNode = {
  id: -1,
  textType: Token.H1,
  sections: [],
  text: '# H1 node!',
  depth: 1,
};
const h2Node: TestNode = {
  id: -1,
  textType: Token.H2,
  sections: [],
  text: '## H2 node!',
  depth: 2,
};
const h3Node: TestNode = {
  id: -1,
  textType: Token.H3,
  sections: [],
  text: '### H3 node!',
  depth: 3,
};
const h4Node: TestNode = {
  id: -1,
  textType: Token.H4,
  sections: [],
  text: '#### H4 node!',
  depth: 4,
};
interface TestNode {
  id: number;
  name?: string;
  textType: Token;
  sections: TestNode[];
  text: string;
  depth: number;
}
const tokens = [fileNode, h1Node, h2Node, h3Node, h4Node];
const createNode = function (token, name?) {
  const targetNode = tokens.find((t) => t.textType === token);
  if (!targetNode) throw new Error('invalid token');
  const newNode = cloneDeep(targetNode);
  if (name) newNode.name = name;
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

  it('should promote', async () => {
    const file = createNode(Token.FILE, 'file');
    const h1 = createNode(Token.H1, 'h1');
    const h4 = createNode(Token.H4, 'h4');
    file.sections.push(h1);
    file.sections.push(h4);
    await service.generateNodes(file as ContentSection);
    console.log('result:', JSON.stringify(file, null, 2));
    const expectedResult = {
      text: 'File node!',
      depth: 0,
      textType: 7,
      sections: [
        {
          text: '# H1 node!',
          depth: 1,
          textType: 6,
          sections: [{ text: '#### H4 node!', sections: [], textType: 5, depth: 2 }],
        },
      ],
    };
    expect(isMatch(file, expectedResult)).toBe(true);
  });
  it('should demote', async () => {
    const file = createNode(Token.FILE, 'file');
    const h2 = createNode(Token.H2);
    const h1 = createNode(Token.H1);
    file.sections.push(h2);
    file.sections.push(h1);
    await service.generateNodes(file as ContentSection);
    console.log('result:', JSON.stringify(file, null, 2));
    const expectedResult = {
      text: 'File node!',
      depth: 0,
      textType: 7,
      sections: [
        {
          text: '# H2 node!',
          depth: 1,
          textType: 6,
          sections: [{ text: '#### H1 node!', sections: [], textType: 5, depth: 2 }],
        },
      ],
    };
    expect(isMatch(file, expectedResult)).toBe(true);
  });
});
