import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';
import { BaseAction, Command, NodeAction } from '../models/command.model';
// type Command<T extends Action> = {
//   action: T;
// };
// type Subject<T extends Command<U extends Action>> = {
//   next: (cmd: Command<T>) => void;
// };
@Injectable({
  providedIn: 'root',
})
export class CommandService implements OnInit {
  private readonly UNDO_KEY = 'UNDO_STACK';

  private actionSubject = new Subject<Command<BaseAction>>();
  action$ = this.actionSubject.asObservable();
  constructor() {}

  ngOnInit() {
    this.action$.subscribe((cmd) => {
      const undoStack = sessionStorage.setItem(
        this.UNDO_KEY,
        JSON.stringify(cmd)
      );
    });
  }

  perform(command: Command<NodeAction>) {
    this.actionSubject.next(command);
  }

  createFolder(name: string) {
    this.actionSubject.next({
      action: NodeAction.CREATE_FOLDER,
      value: name,
    });
  }

  createFile(name: string) {
    this.actionSubject.next({
      action: NodeAction.CREATE_FILE,
      value: name,
    });
  }

  editFileName(uid: string) {
    this.actionSubject.next({
      action: NodeAction.EDIT_NODE_NAME,
      value: uid,
    });
  }

  deleteNode() {
    this.actionSubject.next({
      action: NodeAction.DELETE_NODE,
    });
  }

  saveFile() {
    this.actionSubject.next({ action: NodeAction.SAVE_FILE });
  }

  loadFile(id: number) {
    this.actionSubject.next({
      action: NodeAction.LOAD_FILE,
      id: id,
    });
  }

  createSubsection(contentSection: ContentSection) {
    this.actionSubject.next({
      action: NodeAction.CREATE_SUBSECTION,
      content: contentSection,
    });
  }
}
