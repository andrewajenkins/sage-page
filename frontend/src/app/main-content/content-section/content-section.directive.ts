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
  private readonly hoveredColor = '#ededed';
  private readonly selectedColor =
    'var(--mat-standard-button-toggle-selected-state-background-color)';
  private readonly notSelectedMouseDownColor = '#d0d0d0';
  private readonly selectedAndHoveredColor = '#f0f0f0';
  ngOnChanges(changes) {
    this.backgroundColor = this.isSelected
      ? this.selectedColor
      : this.hoveredColor;
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.backgroundColor = this.isSelected
      ? this.selectedAndHoveredColor
      : this.hoveredColor;
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
    this.backgroundColor = this.isSelected
      ? this.hoveredColor
      : this.selectedColor;
  }
  ngOnInit() {
    this.backgroundColor = this.notHoveredColor;
  }
}
