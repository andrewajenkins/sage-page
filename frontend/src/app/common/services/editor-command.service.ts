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
export class EditorCommandService {
  private editorCommandSubject = new Subject<Command<EditorAction>>();
  editorAction$ = this.editorCommandSubject.asObservable();

  constructor() {}
  saveFile() {
    this.editorCommandSubject.next({ action: EditorAction.SAVE });
  }
  sendSelection(contents: ContentSection[]) {
    this.editorCommandSubject.next({
      action: EditorAction.ADD_SECTIONS,
      content: contents,
    });
  }
}
