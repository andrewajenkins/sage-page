import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';

export enum EditorAction {
  SAVE,
  UNDO,
  REDO,
  SELECT_ALL,
  DELETE_SELECTED,
  TOGGLE_HIGHLIGHT,
  NONE,
}
export enum Action {
  CREATE_FOLDER,
  CREATE_FILE,
  EDIT_NODE_NAME,
  DELETE_NODE,
  SAVE_FILE,
  LOAD_FILE,
  ADD_CONTENT,
}
export interface Command<T> {
  action: T;
  id?: number;
  value?: string;
  content?: ContentSection[];
}

@Injectable({
  providedIn: 'root',
})
export class CommandService {
  private actionSubject = new Subject<Command<Action>>();
  action$ = this.actionSubject.asObservable();
  constructor() {}

  createFolder(name: string) {
    this.actionSubject.next({
      action: Action.CREATE_FOLDER,
      value: name,
    });
  }

  createFile(name: string) {
    this.actionSubject.next({
      action: Action.CREATE_FILE,
      value: name,
    });
  }

  editFileName(uid: string) {
    this.actionSubject.next({
      action: Action.EDIT_NODE_NAME,
      value: uid,
    });
  }

  deleteNode() {
    this.actionSubject.next({
      action: Action.DELETE_NODE,
    });
  }

  saveFile() {
    this.actionSubject.next({ action: Action.SAVE_FILE });
  }

  loadFile(id: number) {
    this.actionSubject.next({
      action: Action.LOAD_FILE,
      id: id,
    });
  }
}
