import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { OPENAI_API_KEY, OPENAI_ORG } from '../../../../tmp/creds';
import { ServiceLogger } from '../../common/logger/loggers';
import { tap } from 'rxjs/operators';
import { botResponse } from '../../common/data/data';
import { Chat } from './chat.model';
import { IQuery } from './bot-window.component';

interface Model {
  id: string;
}

interface ModelResponse {
  data: Model[];
  object: string;
}

interface RequestResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
      index: number;
    },
  ];
}

interface Options {
  headers: any;
}
@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class BotWindowService {
  BYPASS = true;
  options: Options = {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Organization': OPENAI_ORG, // don't need this for text queries
    },
  };
  log: Chat[] = [];
  lastQuery = '';
  constructor(private http: HttpClient) {}
  getModels(): Observable<Model[]> {
    return this.http.get<ModelResponse>('https://api.openai.com/v1/models', this.options).pipe(
      map((response: ModelResponse) => {
        console.log('models resp:', response);
        return response.data;
      }),
    ) as Observable<Model[]>;
    // }
  }
  postQuery(model = 'gpt-3.5-turbo-16k-0613', query: IQuery) {
    if (this.BYPASS) {
      this.BYPASS = false;
      const test = botResponse;
      return of(botResponse);
    } else {
      const body = this.prepareRequest(model, query);
      const options = this.options;
      options.headers['Content-Type'] = 'application/json';
      this.lastQuery = query.query;
      this.log.push(new Chat('user', query.query));
      console.log('-- request:', body, options);
      return this.sendQuery(body, options);
    }
  }
  sendQuery(body, options) {
    return this.http
      .post<RequestResponse>('https://api.openai.com/v1/chat/completions', body, options)
      .pipe(this.logResults);
  }
  prepareRequest(model, query: IQuery) {
    return {
      model: model,
      messages: this.buildMessages(query),
      temperature: 0.7,
    };
  }

  logResults = tap((response: HttpEvent<RequestResponse>) => {
    const chat = new Chat('assistant', response);
    this.log.push(chat);
  });
  buildMessages(query: IQuery) {
    const messages: any = this.getSystemMessages(query.outline);
    let logIndex = this.log.length - 1;
    while (logIndex >= 0) {
      const chat = this.log[logIndex--];
      messages.unshift(chat.toObject());
    }
    messages.push({
      role: 'user',
      content: query.query,
    });
    return messages;
  }

  private getSystemMessages(outline: string | undefined) {
    const systemMsg = [
      {
        role: 'system',
        content: `You are a wiki creation chat bot. You will have two types of responses, informative when content is asked for where you will answer in the form of a wiki paragraph(s) or you will respond with a wiki style outline in markdown for the contents of a wiki. If the prompt contains "Current path in our book is" and then a seris of chapters or sections, that means you're writing for one particular part of the wiki. Try not to give general information that will be covered in different sections of the wiki. Try to give specific information only for the described section. So if it says "History of Philosophy, Socrates and Plato, Philosophy and Dialectic" don't give and overview or conclusion because those will be covered in other sections. Please don't include introductions or conclusions. Please don't include the title in the response, we already know what it is. Please don't have a conversational tone like, "Sure! I'll do that for you.". You wouldn't find that in a wiki article.`,
      },
    ];
    if (outline) {
      systemMsg[0].content +=
        `\nHere is the outline for the wiki for reference. Please stick to your assigned topic and don't cover other topics in the outline:\n` +
        outline;
    }
    return systemMsg;
  }
}
