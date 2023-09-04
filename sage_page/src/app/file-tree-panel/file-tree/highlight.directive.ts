import { Directive, ElementRef, HostListener, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective implements OnChanges {
  @Input() isSelected!: boolean;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    if (!this.isSelected) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'transparent');
    }
  }
  @HostListener('mouseenter') onMouseEnter() {
    if (!this.isSelected) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'whitesmoke');
    }
  }
  @HostListener('mouseleave') onMouseLeave() {
    if (!this.isSelected) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'white');
    }
  }
  ngOnChanges() {
    if (this.isSelected) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'background-color',
        'var(--mat-standard-button-toggle-selected-state-background-color)'
      );
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', 'white');
    }
  }
}
