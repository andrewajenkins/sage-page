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

  perform(command: Command<BaseAction>) {
    this.actionSubject.next(command);
  }
}
