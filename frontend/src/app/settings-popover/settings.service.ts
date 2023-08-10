// settings.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  wikiRight: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private settingsSubject = new BehaviorSubject<AppSettings>({
    wikiRight: false,
  });

  // Observable to subscribe to settings changes
  settings$ = this.settingsSubject.asObservable();

  updateSettings(newSettings: AppSettings): void {
    this.settingsSubject.next(newSettings);
  }
}
