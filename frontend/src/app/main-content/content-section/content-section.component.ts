import { Component, Input } from '@angular/core';
import { ContentSection } from '../bot-window/bot-window.component';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss'],
})
export class ContentSectionComponent {
  @Input() entry!: ContentSection;

  isSelected = false;

  toggleSelection(entry: ContentSection) {
    // this.isSelected = !this.isSelected;
  }
}
