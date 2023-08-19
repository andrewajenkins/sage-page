import { TestBed } from '@angular/core/testing';

import { TreeBuilderV2Service } from './tree-builder-v2.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { largeTreeInput, largeTreeOutput } from '../../data/tree-builder-v2.test-data';
import { ContentSection } from '../../models/section.model';
import { isArray, omit } from 'lodash';

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
  it('large tree should be created', () => {
    const root = JSON.parse(largeTreeInput);
    service.update(root);
    expect(dfsVerify(root, JSON.parse(largeTreeOutput))).toBe(true);
  });
});

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
