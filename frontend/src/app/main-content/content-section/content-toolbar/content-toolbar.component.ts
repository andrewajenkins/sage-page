import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { ContentSection } from '../../bot-window/bot-window.component';

@Component({
  selector: 'app-content-toolbar',
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.scss'],
})
export class ContentToolbarComponent {
  contentMenu: any;
  @Input() contentSection!: ContentSection;
  constructor(private commandService: CommandService) {}
  // task changes to content title
  // editor is cleared
  // wiki tree shows a new subsection
  createSubsection() {
    this.commandService.createSubsection(this.contentSection);
  }
  createContent() {}
  editSection() {}
  deleteSection() {}
}
