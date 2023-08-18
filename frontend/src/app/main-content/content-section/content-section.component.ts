import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

import { ContentSection, dummySection } from '../../common/models/section.model';
import { NodeAction } from '../../common/models/command.model';
import { CommandService } from '../../common/services/command.service';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss'],
})
export class ContentSectionComponent implements OnChanges {
  @Input() contentSection: ContentSection = dummySection;

  @ViewChild('textContent', { static: false }) textContent!: ElementRef;

  constructor(private commandService: CommandService) {}

  toggleSelection() {
    this.contentSection.selected = !this.contentSection.selected;
  }
  ngOnChanges() {
    if (this.contentSection.focused) {
      this.setFocus();
    }
  }

  setFocus() {
    setTimeout(() => {
      this.textContent.nativeElement.focus();
      this.textContent.nativeElement.click();
    }, 500);
  }

  getContent() {
    return this.contentSection.text ? this.contentSection.text : this.contentSection.name;
  }

  handleToolbarEvent(event) {
    if (event == 'save') {
      this.contentSection.text = this.textContent.nativeElement.innerText;
    } else if (event === 'delete') {
      this.recursiveDeleteNode();
    } else if (event === 'edit') {
      this.contentSection.editable = true;
      this.setFocus();
    }
  }

  private recursiveDeleteNode() {
    this.commandService.perform({
      action: NodeAction.DELETE_NODE,
      content: this.contentSection,
    });
  }

  handleFocusOut($event: FocusEvent) {
    let text = this.textContent.nativeElement.innerText.trim();
    if (text.length === 0 && this.contentSection.name == '') {
      this.recursiveDeleteNode();
    } else {
      if (text.length === 0) {
        text = 'DEFAULT_CHANGE_ME_TEXT';
      }
      this.contentSection.text = text;
      this.contentSection.name = text;
    }
  }
}
