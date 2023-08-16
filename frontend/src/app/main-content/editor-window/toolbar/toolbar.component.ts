import { Component } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';
import { NodeAction } from '../../../common/models/command.model';
import { MarkdownExportService } from '../../../common/services/markdown-export.service';
import { NodeService } from '../../../common/services/node.service';
import { FileTreeFile } from '../../../common/models/file-tree.model';
import { ContentSection } from '../../../common/models/section.model';

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
    private nodeService: NodeService
  ) {}
  saveFile() {
    this.commandService.perform({ action: NodeAction.SAVE_FILE });
  }
  exportFile() {
    if (this.nodeService.currentFile) {
      this.markdownExportService.downloadMarkdown(
        this.nodeService.currentFile,
        'test.md'
      );
    } else throw new Error("Can't export file - none selected!");
  }
}
