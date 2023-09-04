import { ContentNode } from '../../app/common/models/content-node.model';
import { deepEqualWithDebug } from '../support/test-utils';
import * as data from './golden';
import { NodeFactory } from '../../app/common/utils/node.factory';
import { cloneDeep } from 'lodash';
import { TreeBuilderV6Service } from '../../app/common/services/tree-builder-v6.service';
import { TestBed } from '@angular/core/testing';
import { FileTreeComponent } from '../../app/file-tree-panel/file-tree/file-tree.component';
import { AppModule } from '../../app/app.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DataService } from '../../app/common/services/data.service';
import { of } from 'rxjs';

const testsToRun = [];
const dataServiceMock = {
  createSections: jest.fn(),
  getFileTree: jest.fn(),
};
describe('buildMap', () => {
  let builderService: TreeBuilderV6Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileTreeComponent],
      imports: [AppModule, HttpClientTestingModule],
      providers: [TreeBuilderV6Service, { provide: DataService, useValue: dataServiceMock }],
    });
    jest.spyOn(dataServiceMock, 'createSections').mockReturnValue(of([]));
    jest.spyOn(dataServiceMock, 'getFileTree').mockReturnValue(of([]));
    builderService = TestBed.inject(TreeBuilderV6Service);
    TestBed.createComponent(FileTreeComponent);
  });

  const inputKeys = Object.keys(data).filter((key) => key.includes('in'));
  const titles = inputKeys.map((key) => key.replace('in', ''));
  console.log('running titles:', titles);
  for (let title of testsToRun.length > 0 ? testsToRun : titles) {
    it(title, () => {
      const nodes = NodeFactory.createSectionsFromText(data['in' + title].trim(), 'asdf1234');
      const currentNode = getCurrentNode(nodes);
      const { nodeMap, rootNodes } = builderService.buildTree(currentNode);
      const expected = data['out' + title];
      expect(deepEqualWithDebug(currentNode, expected)).toBe(true);
    });
  }
});
function getCurrentNode(data) {
  return new ContentNode({
    feId: 'file-id',
    type: 'file',
    parent_id: 'folder-id',
    name: 'sub-file',
    depth: 0,
    sections: [...data],
  });
}
