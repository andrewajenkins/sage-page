import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { ContentSection } from '../../bot-window/bot-window.component';
import { NodeAction } from '../../../common/models/command.model';

@Component({
  selector: 'app-content-toolbar',
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.scss'],
})
export class ContentToolbarComponent {
  contentMenu: any;
  @Input() contentSection!: ContentSection;
  constructor(private commandService: CommandService) {}

  createSubsection() {
    this.commandService.perform({
      action: NodeAction.CREATE_SUBSECTION,
      content: this.contentSection,
    });
  }
  createContent() {}
  editSection() {}
  deleteSection() {}
}
