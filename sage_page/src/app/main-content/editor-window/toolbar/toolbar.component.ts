import { Component } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import { EditorAction } from '../../../common/models/command.model';
import { MarkdownExportService } from '../../../common/services/markdown-export.service';
import { TreeService } from '../../../common/services/tree.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
@ComponentLogger()
export class ToolbarComponent {
  constructor(
    private commandService: CommandService,
    private markdownExportService: MarkdownExportService,
    private treeService: TreeService
  ) {}
  saveFile() {
    this.commandService.perform({ action: EditorAction.SAVE_CONTENT });
  }
  copyAll() {
    this.commandService.perform({ action: EditorAction.COPY_ALL });
  }
  copySelected() {
    this.commandService.perform({ action: EditorAction.COPY_SELECTED });
  }
  exportFile() {
    if (this.treeService.currentNode?.isFile()) {
      this.markdownExportService.downloadMarkdown(this.treeService.currentNode, 'test.md');
    } else throw new Error("Can't export file - none selected!");
  }

  selectAll() {
    this.commandService.perform({ action: EditorAction.SELECT_ALL });
  }
  deleteSelected() {
    this.commandService.perform({ action: EditorAction.DELETE_SELECTED });
  }

  deselectAll() {
    this.commandService.perform({ action: EditorAction.DESELECT_ALL });
  }

  addSection() {
    this.commandService.perform({ action: EditorAction.ADD_NEW_SECTION });
  }

  upload() {
    this.commandService.perform({ action: EditorAction.UPLOAD });
  }
}
