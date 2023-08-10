import { Component } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { EditorCommandService } from '../../../common/services/editor-command.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private editorCommandService: EditorCommandService) {}
  saveFile() {
    this.editorCommandService.saveFile();
  }
}
