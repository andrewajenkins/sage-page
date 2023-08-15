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
import { ComponentLogger } from '../../common/logger/loggers';
import {
  ContentAction,
  isFlagCommand,
  isNodeCommand,
  StateAction,
} from '../../common/models/command.model';
import { CommandService } from '../../common/services/command.service';
import { DataService } from '../../common/services/data.service';
import {
  ChatLogEntry,
  ContentSection,
  ContentSectionType,
  isSection,
} from '../../common/models/section.model';
import { NodeFactory } from '../../common/utils/node.factory';

@Component({
  selector: 'app-bot-window',
  templateUrl: './bot-window.component.html',
  styleUrls: ['./bot-window.component.scss'],
})
@ComponentLogger()
export class BotWindowComponent implements OnInit {
  @ViewChild('scrollMe') private botLogWindow!: ElementRef;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  models: any;
  form!: FormGroup;
  log: ChatLogEntry[] = [];
  contentSectionSelected!: boolean;

  constructor(
    private _ngZone: NgZone,
    private botWindowService: BotWindowService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef, // TODO need this cdref?
    private commandService: CommandService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      modelControl: ['gpt-3.5-turbo-16k-0613'],
      queryControl: [
        [
          // 'If giving a list please respond in markdown with non-numbered headings.',
          // 'Please only give outputs with these markdown tags #, ##, ###, - and please add a few markdown links',
          // "Can you give me a table of contents for a wiki i'm writing about the Angular API? Include all the different libraries like core, common, http, routing, testing, etc.",
          'Can you something like the following, but not exactly? # Header1\n- Bullet content\n## Header2\n- Bullet content\n## Header3\n- Some bullet right here\n### Header 4',
        ].join('\n'),
      ],
    });
    this.botWindowService.getModels().subscribe((models) => {
      this.models = models.filter((model) => model.id.indexOf('gpt') !== -1);
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isFlagCommand(cmd) && cmd.action === StateAction.SET_FILE_SELECTED) {
        this.contentSectionSelected = cmd.flag as boolean;
      } else if (
        isNodeCommand(cmd) &&
        isFlagCommand(cmd) &&
        cmd.action === StateAction.SET_NODE_SELECTED
      ) {
        if (isSection(cmd.node)) {
          this.contentSectionSelected = cmd.flag as boolean;
        }
      }
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
            NodeFactory.createSection({
              contentType: ContentSectionType.STRING,
              text: [],
              content: [],
              type: 'section',
              sections: [],
              name: query,
              selected: false,
            }),
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
            newContents.push(
              NodeFactory.createSection({
                contentType: ContentSectionType.STRING,
                type: ContentSectionType.CODE,
                name: content,
                text: [content],
              })
            );
          } else {
            newContents.push(
              NodeFactory.createSection({
                contentType: ContentSectionType.STRING,
                type: 'section',
                name: content,
                text: [content],
                selected: false,
              })
            );
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
    this.commandService.perform({
      action: ContentAction.ADD_SECTIONS,
      sections: selected,
    });
  }
}
