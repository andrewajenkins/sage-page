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
  @Output() contentToolbarEvent = new EventEmitter();
  constructor(private commandService: CommandService) {}

  ngOnChanges(changes) {
    console.log(changes);
  }
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
    // if (this.contentSection.type === 'content') {
    //   this.contentToolbarEvent.emit('deleteContent');
    // } else {
    this.commandService.perform({
      action: NodeAction.DELETE_NODE,
      content: this.contentSection,
    });
    // }
  }

  saveContent() {
    this.contentToolbarEvent.emit('save');
    this.contentSection.editable = false;
  }
}
