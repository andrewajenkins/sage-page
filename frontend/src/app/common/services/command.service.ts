import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseAction, Command } from '../models/command.model';
import { ServiceLogger } from '../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class CommandService implements OnInit {
  private readonly UNDO_KEY = 'UNDO_STACK';

  private actionSubject = new Subject<Command<BaseAction>>();
  action$ = this.actionSubject.asObservable();

  constructor() {
    console.log('CommandService: constructor');
  }

  ngOnInit() {
    this.action$.subscribe((cmd) => {
      sessionStorage.setItem(this.UNDO_KEY, JSON.stringify(cmd));
    });
  }

  perform(command: Command<BaseAction>) {
    this.actionSubject.next(command);
  }
}
