import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Command, EditorAction } from './command.service';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';
export enum ContentAction {
  ADD_SECTIONS,
}
@Injectable({
  providedIn: 'root',
})
export class ContentBridgeService {
  private contentBridgeSubject = new Subject<Command<ContentAction>>();
  content$ = this.contentBridgeSubject.asObservable();

  constructor() {}

  sendSelection(contents: ContentSection[]) {
    this.contentBridgeSubject.next({
      action: ContentAction.ADD_SECTIONS,
      content: contents,
    });
  }
}
