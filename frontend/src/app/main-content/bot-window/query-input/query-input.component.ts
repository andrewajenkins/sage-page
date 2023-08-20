import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss'],
})
export class QueryInputComponent {
  @Input() queryHistory!: string[];
  @Input() form!: FormGroup;
  @Output() query = new EventEmitter<any>();

  value: string = '';

  submit($event) {
    $event.preventDefault();
    this.query.emit(this.value);
    this.value = '';
  }

  prefillQuery($event: MouseEvent, query) {
    this.form.get('queryControl')?.setValue(query);
  }
}
