import { TestBed } from '@angular/core/testing';

import { TreeBuilderV2Service } from './tree-builder-v2.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContentSection } from '../../models/section.model';
import { isArray, omit } from 'lodash';
import { NodeFactory } from '../../utils/node.factory';
import { FileTreeFile, FileTreeNode } from '../../models/file-tree.model';

class DataService {}

describe('TreeBuilderV2Service', () => {
  let service: TreeBuilderV2Service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Include this line
      providers: [TreeBuilderV2Service, { provide: DataService, useValue: {} }],
    });
    service = TestBed.inject(TreeBuilderV2Service);
  });
  //test
  it('root text', () => {
    const rootNode = makeFileNodes(['Some root text', 'Some more root text']);
    service.update(rootNode);
    expectContentCount(rootNode, 2);
    expectSectionCount(rootNode, 0);
  });
  it('header1', () => {
    const rootNode = makeFileNodes(['# Header1']);
    service.update(rootNode);
    expectContentCount(rootNode, 0);
    expectSectionCount(rootNode, 1);
  });
  it('header and 2 text', () => {
    const rootNode = makeFileNodes(['# Header1', 'Some header text', 'Some more header text']);
    service.update(rootNode);
    expectContentCount(rootNode, 0);
    expectSectionCount(rootNode, 1);
    expectContentCount(rootNode.sections[0], 2);
    expectSectionCount(rootNode.sections[0], 0);
  });
  it('header and 2 bullets', () => {
    const rootNode = makeFileNodes(['# Header1', '- Some header bullet', '- Another header bullet']);
    service.update(rootNode);
    expectContentCount(rootNode, 0);
    expectSectionCount(rootNode, 1);
    expectContentCount(rootNode.sections[0], 2);
    expectSectionCount(rootNode.sections[0], 0);
  });
  it('2 headers', () => {
    const rootNode = makeFileNodes(['# Header1', '# Header2']);
    service.update(rootNode);
    expectContentCount(rootNode, 0);
    expectSectionCount(rootNode, 2);
  });
  it('root text bullet', () => {
    const rootNode = makeFileNodes(['Some root text', '- Some root bullet']);
    service.update(rootNode);
    expectContentCount(rootNode, 2);
    expectSectionCount(rootNode, 0);
  });
  it('header bullet text', () => {
    const rootNode = makeFileNodes(['# Header1', '- Some header bullet', 'Some header text']);
    service.update(rootNode);
    expectContentCount(rootNode, 0);
    expectSectionCount(rootNode, 1);
    expectContentCount(rootNode.sections[0], 2);
    expectSectionCount(rootNode.sections[0], 0);
  });
});
function expectContentCount(rootNode: ContentSection, count: number) {
  expect(rootNode.content.length).toEqual(count);
}
function expectSectionCount(rootNode: ContentSection, count: number) {
  expect(rootNode.sections.length).toEqual(count);
}
function makeFileNodes(contents: string[]) {
  return makeNodes(contents, 'file') as ContentSection;
}
function makeNodes(contents: string[], type?: 'file' | 'section') {
  const nodes = contents.map((stringInput) => {
    return NodeFactory.createSection({
      id: Math.floor(Math.random() * 1000000),
      name: stringInput,
      text: stringInput,
      type: 'section',
    });
  });
  return NodeFactory.createNode({
    id: Math.floor(Math.random() * 1000000),
    name: 'root-node-name',
    type: type,
    sections: nodes,
  });
}

const shallowCompare = (o1: any, o2: any) => {
  const keysToExclude = ['id', 'parent_id', 'content', 'sections', 'tokens'];
  const pickedO1 = omit(o1, keysToExclude);
  const pickedO2 = omit(o2, keysToExclude);

  let allMatch = true;

  for (const key in pickedO1) {
    if (!isArray(pickedO1[key]) && pickedO1[key] !== pickedO2[key]) {
      console.error(`Mismatch found: ${key}. Expected ${pickedO1[key]}, but got ${pickedO2[key]}`);
      allMatch = false;
    } else console.log(`Match found: ${key}. Expected ${pickedO1[key]}, but got ${pickedO2[key]}`);
  }

  return allMatch;
};

export const dfsVerify = function (file: ContentSection, golden: ContentSection) {
  const processNode = (node: ContentSection, gNode: ContentSection) => {
    // node.content.forEach((content: ContentSection) => {
    let result = true;
    for (let i = 0; i < node.content.length; i++) {
      const content = node.content[i];
      const golden = gNode.content[i];
      const localResult = shallowCompare(content, golden);
      if (localResult) console.log('shallowCompare: content:', content, golden);
      else console.error('shallowCompare: content:', content, golden);
      result = result && localResult;
    }
    // node.sections.forEach((section: ContentSection) => {
    for (let i = 0; i < node.sections.length; i++) {
      const section = node.sections[i];
      const golden = gNode.sections[i];
      const localResult = shallowCompare(section, golden);
      if (localResult) console.log('shallowCompare: section:', section, golden);
      else console.error('shallowCompare: section:', section, golden);
      result = result && localResult;
      processNode(section, golden);
    }
    return result;
  };
  return processNode(file, golden);
};
