import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ContentSection } from '../../main-content/bot-window/bot-window.component';
import { Command } from '../models/command.model';
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
      contents: contents,
    });
  }
}
