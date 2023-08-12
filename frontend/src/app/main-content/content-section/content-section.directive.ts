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
  // @Input()
  isSelected = false;
  defaultColor = 'var(--mat-standard-button-toggle-background-color)';
  @HostBinding('style.backgroundColor') backgroundColor;

  private readonly notHoveredColor =
    'var(--mat-standard-button-toggle-background-color)';
  private readonly hoveredColor = '#f0f0f0';
  private readonly selectedColor =
    'var(--mat-standard-button-toggle-selected-state-background-color)';
  private readonly notSelectedMouseDownColor = '#d0d0d0';

  ngOnChanges() {
    console.log('gibberish');
  }
  @HostListener('mouseover') onMouseEnter() {
    this.backgroundColor = this.hoveredColor;
  }
  @HostListener('mouseout') onMouseLeave() {
    this.backgroundColor = this.isSelected
      ? this.selectedColor
      : this.notHoveredColor;
  }
  @HostListener('mousedown') onMouseDown() {
    this.backgroundColor = this.isSelected
      ? this.selectedColor
      : this.notSelectedMouseDownColor;
  }
  @HostListener('mouseup') onMouseUp() {
    // add is hovered stays hovered
    this.backgroundColor = this.isSelected
      ? this.selectedColor
      : this.notHoveredColor;
  }
  ngOnInit() {
    this.backgroundColor = this.notHoveredColor;
  }
}
