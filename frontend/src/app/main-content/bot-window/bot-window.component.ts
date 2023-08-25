import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs';
import { BotWindowService } from './bot-window.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { ComponentLogger } from '../../common/logger/loggers';
import { ContentAction, isFlagCommand, StateAction } from '../../common/models/command.model';
import { CommandService } from '../../common/services/command.service';
import { ChatLogEntry, ContentSection } from '../../common/models/section.model';
import { NodeFactory } from '../../common/utils/node.factory';
import { Chat } from './chat.model';

@Component({
  selector: 'app-bot-window',
  templateUrl: './bot-window.component.html',
  styleUrls: ['./bot-window.component.scss'],
})
@ComponentLogger()
export class BotWindowComponent implements OnInit {
  @ViewChild('scrollMe') private botLogWindow!: ElementRef;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  @ViewChildren('chat') chats!: ElementRef[];

  models: any;
  form!: FormGroup;
  log: ChatLogEntry[] = [];
  contentSectionSelected!: boolean;

  constructor(
    private _ngZone: NgZone,
    private botWindowService: BotWindowService,
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private commandService: CommandService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      modelControl: ['gpt-3.5-turbo-16k-0613'],
      queryControl: [
        // [
        //   // 'If giving a list please respond in markdown with non-numbered headings.',
        //   // 'Please only give outputs with these markdown tags #, ##, ###, - and please add a few markdown links',
        //   // "Can you give me a table of contents for a wiki i'm writing about the Angular API? Include all the different libraries like core, common, http, routing, testing, etc.",
        //   'Can you something like the following, but not exactly? # Header1\n- Bullet content\n## Header2\n- Bullet content\n## Header3\n- Some bullet right here\n### Header 4',
        // ].join('\n'),
      ],
    });
    this.botWindowService.getModels().subscribe((models) => {
      this.models = models.filter((model) => model.id.indexOf('gpt') !== -1);
    });
    this.commandService.action$.subscribe((cmd) => {
      if (isFlagCommand(cmd) && cmd.action === StateAction.SET_FILE_SELECTED) {
        this.contentSectionSelected = cmd.flag as boolean;
      } else if (isFlagCommand(cmd) && cmd.action === StateAction.SET_NODE_SELECTED) {
        this.contentSectionSelected = cmd.flag as boolean;
      }
    });
    this.scrollDown();
    this.sendQuery(); // TODO remove
  }

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendQuery(query?) {
    this.botWindowService.postQuery(this.form.get('modelControl')?.value, query).subscribe((response) => {
      const chat = new Chat(query, response);
      this.log.push({
        id: this.log.length,
        role: 'Query:',
        content: [
          NodeFactory.createSection({
            type: 'section',
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
              name: content,
              text: content,
            })
          );
        } else {
          newContents.push(
            NodeFactory.createSection({
              name: content,
              text: content,
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
      this.scrollDown();
    });
  }

  scrollDown() {
    this.cdRef.detectChanges();
    try {
      const botWindow = this.botLogWindow.nativeElement;
      // @ts-ignore
      const chat = this.chats.last?.nativeElement;
      if (chat) {
        this.botLogWindow.nativeElement.scrollTop = botWindow.scrollHeight;
        this.botLogWindow.nativeElement.scrollTop -= chat.offsetHeight - botWindow.clientHeight;
      }
    } catch (e) {}
  }

  selectAll(entry: ChatLogEntry) {
    entry.content.forEach((content) => (content.selected = true));
  }

  clearSelection(entry: ChatLogEntry) {
    entry.content.forEach((content) => (content.selected = false));
  }

  sendSelection(logEntry: ChatLogEntry) {
    const selected: ContentSection[] = cloneDeep(logEntry.content.filter((content) => content.selected));
    selected.forEach((content) => {
      content.selected = false;
    });
    this.commandService.perform({
      action: ContentAction.ADD_SECTIONS,
      sections: selected,
    });
  }

  getQueries() {
    const log = this.botWindowService.log;
    const queries = [
      ...log.filter((chat) => chat.user == 'user').map((entry) => entry.content),
      ...[
        'Can you write me a long diatribe about the history of the internet?',
        'Can you write an outline for a book I am doing on the history of philosophy?',
      ],
    ];
    return queries;
  }
}
