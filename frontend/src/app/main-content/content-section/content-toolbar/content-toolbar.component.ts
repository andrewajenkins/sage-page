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
  @Input() hideEditorContent: boolean = false;
  @Output() contentToolbarEvent = new EventEmitter();

  symbols = ['#', '##', '###', '####', '#####', '######', '-', 'Plain text'];

  constructor(private commandService: CommandService) {}

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
    if (this.contentSection.text) {
      this.contentSection.text = this.contentSection?.text.trim();
      this.contentToolbarEvent.emit('save');
    }
  }

  changeSymbolTo(symbol: string) {
    if (this.contentSection.text) {
      this.contentSection.text = this.contentSection.text.trim().replace(/^[#|-]+\s/, '');
      this.contentSection.text = symbol + ' ' + this.contentSection.text;
      this.contentSection.generated = false;
    }
  }
}
