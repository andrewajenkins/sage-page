import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Command, EditorAction } from '../models/command.model';

// export interface StateAction {
//   setNodeSelected?: boolean;
//   setFileSelected?: boolean;
// }
export enum StateAction {
  SET_NODE_SELECTED,
  SET_FILE_SELECTED,
}
@Injectable({
  providedIn: 'root',
})
export class UiStateManager {
  uiStateSubject = new Subject<Command<StateAction>>();
  uiState$ = this.uiStateSubject.asObservable();

  constructor() {}

  nodeSelected(value: boolean) {
    this.uiStateSubject.next({
      action: StateAction.SET_NODE_SELECTED,
      flag: value,
    });
  }

  fileSelected(value: boolean) {
    this.uiStateSubject.next({
      action: StateAction.SET_FILE_SELECTED,
      flag: value,
    });
  }
}
