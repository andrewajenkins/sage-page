import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs';
import { BotWindowService } from './bot-window.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import {
  StateAction,
  UiStateManager,
} from '../../common/services/ui-state-manager.service';
import { ComponentLogger } from '../../common/logger/loggers';
import { ContentBridgeService } from '../../common/services/content-bridge.service';

export const enum ContentSectionType {
  STRING,
  CODE,
  HIGHLIGHT,
}

export interface ContentSection {
  locked?: Boolean;
  type: ContentSectionType;
  text: string;
  botID: number;
  uid?: string; // for duplicates in wiki-editor
  selected: boolean;
}

export interface ChatLogEntry {
  role: string;
  content: ContentSection[];
  id: number;
}

@Component({
  selector: 'app-bot-window',
  templateUrl: './bot-window.component.html',
  styleUrls: ['./bot-window.component.scss'],
})
@ComponentLogger()
export class BotWindowComponent implements OnInit {
  @ViewChild('scrollMe') private botLogWindow!: ElementRef;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  botText!: ChatLogEntry[];
  models: any;
  form!: FormGroup;
  log: ChatLogEntry[] = [];
  private isMouseDown = false;
  fileSelected!: boolean;

  constructor(
    private _ngZone: NgZone,
    private botWindowService: BotWindowService,
    private formBuilder: FormBuilder,
    private uiStateManager: UiStateManager,
    private cdRef: ChangeDetectorRef, // TODO need this cdref?
    private contentBridgeService: ContentBridgeService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      modelControl: ['gpt-3.5-turbo-16k-0613'],
      // queryControl: ['Can you explain and show hello world in java?'],
      // queryControl: [
      //   'Lets write a low-level/reference wiki for Angular 10 api. Can you give me 10 sections, no details, that we can use for the table of contents? Just need the section headlines. Needs to be from the api so things like core, testing, common, etc. Needs to be in markdown and lets ignore animation and routing',
      // ],
      // queryControl: [
      //   'Can you give me one short paragraph about roses and then also a hello world function in java?',
      // ],
      queryControl: [
        'Can you me about roses and then also a hello world function in java?',
      ],
    });
    this.botWindowService.getModels().subscribe((models) => {
      this.models = models.filter((model) => model.id.indexOf('gpt') !== -1);
    });
    this.uiStateManager.uiState$.subscribe((uiState) => {
      if (uiState.action === StateAction.SET_FILE_SELECTED)
        this.fileSelected = uiState.flag as boolean;
    });
    this.scrollDown();
    this.sendQuery(); // TODO remove
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable
      .pipe(take(1))
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendQuery(event?: Event) {
    event?.preventDefault(); // keep the enter key from returning
    const query = this.form.get('queryControl')?.value;
    this.form.get('queryControl')?.reset();
    this.botWindowService
      .postQuery(this.form.get('modelControl')?.value, query)
      .subscribe((response) => {
        console.log('bot-response:', response);
        // TODO nest log entries under conversation objects (avoide parsing for select all and future stuff)
        this.log.push({
          id: this.log.length,
          role: 'Query:',
          content: [
            {
              type: ContentSectionType.STRING,
              text: query,
              botID: 1,
              selected: false,
            },
          ],
        });
        const contentArray = response.choices[0].message.content.split('\n');
        const contents = [...contentArray];
        const newContents: ContentSection[] = [];
        let isCode = false;
        for (let i = 0; i < contents.length; i++) {
          const content = contents[i];
          if (!content) continue;
          if (content.indexOf('```') !== -1) {
            isCode = !isCode;
            continue;
          }
          if (isCode) {
            newContents.push({
              type: ContentSectionType.CODE,
              text: content,
              botID: i,
              selected: false,
            });
          } else {
            newContents.push({
              type: ContentSectionType.STRING,
              text: content,
              botID: i,
              selected: false,
            });
          }
        }
        this.log.push({
          role: 'Sage:',
          content: newContents,
          id: this.log.length,
        });
        // TODO generally need to format the window content somehow so its selectable
        // TODO use edits endpoint for selecting text you want and regenerating text you dont
        // TODO save user queries and responses and pass them in the messages (with roles) to enable convo context

        // scroll down bot chat
        this.scrollDown();
        // TODO remove below selectall and send selection
        // this.selectAll(this.log[this.log.length - 1]);
        // this.sendSelection(this.log[this.log.length - 1]);
      });
  }

  scrollDown() {
    this.cdRef.detectChanges();
    // TODO needs to scroll down to top of response maybe, not bottom?
    try {
      this.botLogWindow.nativeElement.scrollTop =
        this.botLogWindow.nativeElement.scrollHeight;
    } catch (e) {}
  }

  selectAll(entry: ChatLogEntry) {
    entry.content.forEach((content) => (content.selected = true));
  }

  clearSelection(entry: ChatLogEntry) {
    entry.content.forEach((content) => (content.selected = false));
  }

  sendSelection(logEntry: ChatLogEntry) {
    const selected: ContentSection[] = cloneDeep(
      logEntry.content.filter((content) => content.selected)
    );
    selected.forEach((content) => {
      content.selected = false;
    });
    this.contentBridgeService.sendSelection(selected);
  }
}
