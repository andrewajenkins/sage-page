import { Component } from '@angular/core';
import { CommandService } from '../../../common/services/command.service';
import { ComponentLogger } from '../../../common/logger/loggers';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
@ComponentLogger()
export class ToolbarComponent {
  constructor(private commandService: CommandService) {}
  saveFile() {
    this.commandService.saveFile();
  }
}
