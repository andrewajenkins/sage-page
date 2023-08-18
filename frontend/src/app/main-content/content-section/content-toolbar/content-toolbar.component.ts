import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { EditorAction, NodeAction } from '../../../common/models/command.model';
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
    // console.log(changes);
  }
  createSection(location: 'above' | 'below') {
    this.commandService.perform({
      action: EditorAction.CREATE_SECTION,
      value: location,
      section: this.contentSection,
    });
  }
  editSection() {
    this.contentToolbarEvent.emit('edit');
  }

  deleteSection() {
    this.contentToolbarEvent.emit('delete');
  }

  saveContent() {
    this.contentToolbarEvent.emit('save');
  }
}
