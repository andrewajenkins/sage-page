import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { OPENAI_API_KEY, OPENAI_ORG } from '../../../../../tmp/creds';
import { ServiceLogger } from '../../common/logger/loggers';
import { tap } from 'rxjs/operators';
import { botResponse } from '../../common/data/data';
import { Chat } from './chat.model';

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
    }
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
      })
    ) as Observable<Model[]>;
    // }
  }
  postQuery(model = 'gpt-3.5-turbo-16k-0613', query = 'hi bot') {
    const body = this.prepareRequest(model, query);
    const options = this.options;
    options.headers['Content-Type'] = 'application/json';
    if (this.BYPASS) {
      this.BYPASS = false;
      return of(botResponse);
    } else {
      this.lastQuery = query;
      this.log.push(new Chat('user', query));
      return this.sendQuery(body, options);
    }
  }
  sendQuery(body, options) {
    return this.http
      .post<RequestResponse>('https://api.openai.com/v1/chat/completions', body, options)
      .pipe(this.logResults);
  }
  prepareRequest(model, query) {
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
  buildMessages(query: string) {
    const messages: any = this.getSystemMessages();
    let logIndex = this.log.length - 1;
    while (logIndex >= 0) {
      const chat = this.log[logIndex--];
      messages.unshift(chat.toObject());
    }
    messages.push({
      role: 'user',
      content: query,
    });
    return messages;
  }

  private getSystemMessages() {
    return [
      {
        role: 'system',
        content: 'Please respond in markdown.',
      },
    ];
  }
}
