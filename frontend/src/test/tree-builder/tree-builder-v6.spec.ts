import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeBuilderV6Service } from '../../app/common/services/tree-builder-v6.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppModule } from '../../app/app.module';
import { TreeService } from '../../app/common/services/tree.service';
import { ContentNode } from '../../app/common/models/content-node.model';
import { FileTreeComponent } from '../../app/file-tree-panel/file-tree/file-tree.component';
import { CommandService } from '../../app/common/services/command.service';
import { ContentAction, EditorAction, NodeAction } from '../../app/common/models/command.model';
import { of } from 'rxjs';
import { DataService } from '../../app/common/services/data.service';
import { FileTreeActionHandler } from '../../app/file-tree-panel/file-tree/file-tree-action-handler';
import { sampleLongText, saveContentLarge } from './golden';
import { Clipboard } from '@angular/cdk/clipboard';
import { ContentContainerComponent } from '../../app/main-content/editor-window/content-container/content-container.component';
import { NodeFactory } from '../../app/common/utils/node.factory';
import { deepEqualWithDebug } from '../support/test-utils';

const dataServiceMock = {
  createNode: jest.fn(),
  getFileTree: jest.fn(),
  deleteNode: jest.fn(),
  createSections: jest.fn(),
};

describe('TreeBuilderV6Service', () => {
  let builderService: TreeBuilderV6Service;
  let treeService: TreeService;
  let commandService: CommandService;
  let actionHandler: FileTreeActionHandler;
  let fixture: ComponentFixture<FileTreeComponent>;
  let containerFixture: ComponentFixture<ContentContainerComponent>;
  let clipboard: Clipboard;
  let fileTreeElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileTreeComponent, ContentContainerComponent],
      imports: [AppModule, HttpClientTestingModule],
      providers: [
        TreeBuilderV6Service,
        TreeService,
        CommandService,
        FileTreeActionHandler,
        { provide: DataService, useValue: dataServiceMock },
      ],
    });
    jest.spyOn(dataServiceMock, 'getFileTree').mockReturnValue(of([]));
    jest.spyOn(dataServiceMock, 'deleteNode').mockReturnValue(of([]));
    fixture = TestBed.createComponent(FileTreeComponent);
    fileTreeElement = fixture.nativeElement;
    containerFixture = TestBed.createComponent(ContentContainerComponent);
    containerFixture.detectChanges();
    actionHandler = TestBed.inject(FileTreeActionHandler);
    actionHandler.init();
    builderService = TestBed.inject(TreeBuilderV6Service);
    clipboard = TestBed.inject(Clipboard);
    commandService = TestBed.inject(CommandService);
    treeService = TestBed.inject(TreeService);
    treeService.initialize = jest.fn();
  });

  it('should be created', () => {
    expect(builderService).toBeTruthy();
  });

  it('should create folder', () => {
    treeService.handleTreeUpdate([new ContentNode({ name: 'root', type: 'folder', text: 'root' })]);
    fixture.detectChanges();
    const html = fileTreeElement.innerHTML;
    const text = fileTreeElement.querySelector('.node-name')?.textContent;
    expect(fileTreeElement.querySelector('.node-name')?.textContent).toContain('root');
  });

  it('should create file', () => {
    const folder = new ContentNode({ name: 'root', type: 'folder', text: 'root' });
    const file = new ContentNode({ name: 'file', type: 'file', text: 'file', parent_id: folder.feId });
    treeService.handleTreeUpdate([folder, file]);
    fixture.detectChanges();
    const html = fileTreeElement.innerHTML;
    const text = fileTreeElement.querySelector('.node-name')?.textContent;
    expect(fileTreeElement.querySelector('.nested-name')?.textContent).toContain('root');
    expect(fileTreeElement.querySelector('.node-name')?.textContent).toContain('file');
  });

  describe('commands', () => {
    let folderNodeWithId: Partial<ContentNode>;
    beforeEach(() => {
      const folderNode = { feId: 'abc123', name: 'root-folder', type: 'folder', text: 'root' };
      folderNodeWithId = { ...folderNode, feId: '123' };
      dataServiceMock.createNode.mockReturnValue(of([folderNodeWithId]));
      commandService.perform({ action: NodeAction.CREATE_FOLDER, value: 'root-folder' });
      fixture.detectChanges();
    });

    describe('folder', () => {
      it('should create', () => {
        expect(fileTreeElement.querySelector('.node-name')?.textContent).toContain('root-folder');
      });
      it('should delete - current', () => {
        dataServiceMock.deleteNode.mockReturnValue(of([]));
        treeService.currentNode = treeService.tree.dataSource.data[0];
        commandService.perform({ action: NodeAction.DELETE_CURRENT_NODE });
        fixture.detectChanges();
        expect(fileTreeElement.querySelector('.node-name')?.textContent).toBeUndefined();
      });
      it('should delete - arbitrary', () => {
        dataServiceMock.deleteNode.mockReturnValue(of([]));
        commandService.perform({ action: NodeAction.DELETE_NODE, content: treeService.tree.dataSource.data[0] });
        fixture.detectChanges();
        expect(fileTreeElement.querySelector('.node-name')?.textContent).toBeUndefined();
      });
    });
    describe('file', () => {
      beforeEach(() => {
        const newNode = { name: 'root-file', type: 'file', text: 'root-file', depth: 0 };
        const newNodeWithId = { ...newNode, parent_id: folderNodeWithId.feId };
        dataServiceMock.createNode.mockReturnValue(of([folderNodeWithId, newNodeWithId]));
        treeService.currentNode = treeService.tree.dataSource.data[0];
        commandService.perform({ action: NodeAction.CREATE_FILE, value: 'root-file' });
        fixture.detectChanges();
        const text = fileTreeElement.textContent;
      });
      it('should create', () => {
        expect(fileTreeElement.querySelector('.nested-name')?.textContent).toContain('root-folder');
        expect(fileTreeElement.querySelector('.node-name')?.textContent).toContain('root-file');
      });
      it('should delete - current', () => {
        dataServiceMock.deleteNode.mockReturnValue(of([folderNodeWithId]));
        treeService.currentNode = treeService.tree.dataSource.data[0].subNodes[0];
        commandService.perform({ action: NodeAction.DELETE_CURRENT_NODE });
        fixture.detectChanges();
        expect(fileTreeElement.querySelector('.node-name')?.textContent).not.toContain('root-file');
      });
      it('should delete - arbitrary', () => {
        dataServiceMock.deleteNode.mockReturnValue(of([folderNodeWithId]));
        commandService.perform({
          action: NodeAction.DELETE_NODE,
          content: treeService.tree.dataSource.data[0].subNodes[0],
        });
        fixture.detectChanges();
        expect(fileTreeElement.querySelector('.node-name')?.textContent).not.toContain('root-file');
      });
      it('should save content', () => {
        treeService.currentNode = treeService.tree.dataSource.data[0].subNodes[0];
        dataServiceMock.createSections.mockReturnValue(of([]));
        commandService.perform({
          action: ContentAction.ADD_SECTIONS,
          sections: NodeFactory.createSectionsFromText(sampleLongText, treeService.currentNode.feId),
        });
        fixture.detectChanges();
        commandService.perform({
          action: EditorAction.SAVE_CONTENT,
        });
        fixture.detectChanges();
        // expect(fileTreeElement.textContent).toContain('Chapter 1: Ancient Philosophy ');
        // expect(fileTreeElement.textContent).toContain('Section 1: Pre-Socratic Philosophy');
        // expect(fileTreeElement.textContent).toContain('Conclusion');
        // expect(treeService.currentNode.contents[0].name).toContain("Here's a general outline");
        // expect(treeService.currentNode.sections[0].sections[1].sections[0].text).toContain(
        //   '### Section 1: Pre-Socratic Philosophy'
        // );
        // expect(treeService.currentNode.sections[0].sections[1].sections[0].depth).toBe(3);
        expect(deepEqualWithDebug(treeService.currentNode, saveContentLarge)).toBe(true);
      });
    });
  });
});
