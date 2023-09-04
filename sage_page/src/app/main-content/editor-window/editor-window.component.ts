import { Component } from '@angular/core';
import { ComponentLogger } from '../../common/logger/loggers';

@Component({
  selector: 'app-editor-window',
  templateUrl: './editor-window.component.html',
  styleUrls: ['./editor-window.component.scss'],
})
@ComponentLogger()
export class EditorWindowComponent {}
