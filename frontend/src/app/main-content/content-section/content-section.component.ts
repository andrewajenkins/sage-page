import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ContentSection, dummySection } from '../../common/models/section.model';

@Component({
  selector: 'app-content-section',
  templateUrl: './content-section.component.html',
  styleUrls: ['./content-section.component.scss'],
})
export class ContentSectionComponent {
  @Input() contentSection: ContentSection = dummySection;
  @ViewChild('textContent', { static: false }) textContent!: ElementRef;
  isEditable: any;
  toggleSelection() {
    this.contentSection.selected = !this.contentSection.selected;
  }
  ngOnChanges() {
    // console.log(this.contentSection);
  }

  getContent() {
    return this.contentSection.text ? this.contentSection.text : this.contentSection.name;
  }

  handleToolbarEvent(event) {
    if (event == 'save') {
      this.contentSection.text = this.textContent.nativeElement.innerText;
    }
  }
}
