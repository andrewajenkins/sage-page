import { ContentNode } from '../../app/common/models/content-node.model';
import { deepEqualWithDebug } from '../support/test-utils';
import * as data from './golden-nested';
import { NodeFactory } from '../../app/common/utils/node.factory';
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
describe('buildMapNested', () => {
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
      const nodes = NodeFactory.createSectionsFromText(data['in' + title].trim(), 'generated', true);
      const currentNode = getCurrentNode(nodes);
      builderService.buildTree(currentNode);
      const expected = data['out' + title];
      expect(deepEqualWithDebug(currentNode, expected)).toBe(true);
    });
  }
});
function getCurrentNode(data) {
  const header2 = new ContentNode({
    feId: 'header2-id',
    name: 'Second header',
    text: '## Second header',
    type: 'heading',
    parent_id: 'header1-id',
    depth: 2,
    sections: [...data],
  });
  const header1 = new ContentNode({
    feId: 'header1-id',
    name: 'First header',
    text: '## First header',
    type: 'heading',
    parent_id: 'file-id',
    depth: 1,
    sections: [header2],
  });
  const rootFile = new ContentNode({
    feId: 'file-id',
    type: 'file',
    parent_id: 'folder-id',
    name: 'sub-file',
    depth: 0,
    sections: [header1],
  });
  return header2;
}
