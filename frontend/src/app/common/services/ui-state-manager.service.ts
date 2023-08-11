import { Subject } from 'rxjs';
import { Command, EditorAction } from './command.service';
import { Injectable } from '@angular/core';

export interface StateAction {
  nodeSelected: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UiStateManager {
  uiStateSubject = new Subject<StateAction>();
  uiState$ = this.uiStateSubject.asObservable();

  constructor() {}

  nodeSelected(value: boolean) {
    this.uiStateSubject.next({
      nodeSelected: value,
    });
  }
}
