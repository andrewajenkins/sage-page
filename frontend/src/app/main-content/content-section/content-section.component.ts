import { Component, Input } from '@angular/core';

import { ContentSection, dummySection } from '../../common/models/section.model';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss'],
})
export class ContentSectionComponent {
  @Input() contentSection: ContentSection = dummySection;
  isEditable: any;
  toggleSelection() {
    this.contentSection.selected = !this.contentSection.selected;
  }
  ngOnChanges() {
    console.log(this.contentSection);
  }

  getContent() {
    return this.contentSection.text ? this.contentSection.text : this.contentSection.name;
  }
}
