import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { NodeAction } from '../../../common/models/command.model';
import { ContentSection } from '../../../common/models/section.model';

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
      action: NodeAction.CREATE_SECTION,
      content: this.contentSection,
    });
  }
  createContent() {}
  editSection() {
    this.contentSection.editable = true;
  }
  deleteSection() {
    this.commandService.perform({
      action: NodeAction.DELETE_NODE,
      content: this.contentSection,
    });
  }

  saveContent($event: MouseEvent) {
    console.log('event:', $event);
    // $event.target.
    this.contentSection.editable = false;
  }
}
