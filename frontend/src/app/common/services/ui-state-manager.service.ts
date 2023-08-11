import { Subject } from 'rxjs';
import { Command } from './command.service';
import { Injectable } from '@angular/core';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';

export enum EditorAction {
  SAVE,
  UNDO,
  REDO,
  SELECT_ALL,
  DELETE_SELECTED,
  TOGGLE_HIGHLIGHT,
  ADD_SECTIONS,
  NONE,
}
@Injectable({
  providedIn: 'root',
})
export class UiStateManager {
  private uiStateSubject = new Subject<Command<EditorAction>>();
  uiState$ = this.uiStateSubject.asObservable();

  constructor() {}

  sendSelection(contents: ContentSection[]) {
    this.uiStateSubject.next({
      action: EditorAction.ADD_SECTIONS,
      content: contents,
    });
  }
}
