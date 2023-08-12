import {
  Directive,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { ComponentLogger } from '../../common/logger/loggers';

@Directive({
  selector: '[appContentSection]',
})
@ComponentLogger()
export class ContentSectionDirective implements OnChanges {
  @Input() isSelected = false;
  @HostBinding('style.backgroundColor') backgroundColor;

  private readonly notHoveredColor =
    'var(--mat-standard-button-toggle-background-color)';
  private readonly hoveredColor = '#f0f0f0';
  private readonly selectedColor =
    'var(--mat-standard-button-toggle-selected-state-background-color)';
  private readonly notSelectedMouseDownColor = '#d0d0d0';

  ngOnChanges(changes) {
    console.log('gibberish', this.isSelected, changes);
  }
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isSelected) this.backgroundColor = this.hoveredColor;
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.backgroundColor = this.isSelected
      ? this.selectedColor
      : this.notHoveredColor;
  }
  @HostListener('mousedown') onMouseDown() {
    this.backgroundColor = this.notSelectedMouseDownColor;
  }
  @HostListener('mouseup') onMouseUp() {
    // add is hovered stays hovered
    console.log('mouseUp:', this.isSelected);
    this.backgroundColor = this.isSelected
      ? this.hoveredColor
      : this.selectedColor;
  }
  selected() {}
  unselected() {}
  ngOnInit() {
    this.backgroundColor = this.notHoveredColor;
  }
}
