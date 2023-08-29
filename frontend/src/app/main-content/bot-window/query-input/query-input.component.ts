import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormGroup } from '@angular/forms';
import { TreeService } from '../../../common/services/tree.service';
import { getPath } from '../../../common/utils/tree-utils';
import { CommandService } from '../../../common/services/command.service';
import { StateAction } from '../../../common/models/command.model';

@Component({
  selector: 'app-query-input',
  templateUrl: './query-input.component.html',
  styleUrls: ['./query-input.component.scss'],
})
export class QueryInputComponent {
  @Input() queryHistory!: string[];
  @Output() query = new EventEmitter<any>();

  value: string = '';

  constructor(private treeService: TreeService, private commandService: CommandService) {}

  submit($event) {
    $event.preventDefault();
    this.query.emit(this.value);
    this.value = '';
  }

  prefillQuery(action: string, query) {
    if (action === 'add query') this.value += '\n' + query + '\n';
    else if (action === 'add context') {
      if (!this.treeService.currentNode)
        this.commandService.perform({
          action: StateAction.NOTIFY,
          value: 'Please select a file or section to add context to.',
        });
      else
        this.value +=
          '\nCurrent path in our book/wiki is: ' +
          getPath(this.treeService.currentNode!, this.treeService.nodeMap)
            .map((node) => node.name)
            .join(': ') +
          '\n';
    }
  }
}
