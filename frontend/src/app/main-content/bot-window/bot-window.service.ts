import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { OPENAI_API_KEY, OPENAI_ORG } from '../../../../../tmp/creds';
import { ServiceLogger } from '../../common/logger/loggers';
import { tap } from 'rxjs/operators';
import { botModels, botResponse } from '../../common/data/data';

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
    const body = {
      model: model,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.7,
    };
    const options = this.options;
    options.headers['Content-Type'] = 'application/json';
    console.log('making request:', body, options);
    if (this.BYPASS) {
      this.BYPASS = false;
      return of(botResponse);
    } else {
      return this.http.post<RequestResponse>('https://api.openai.com/v1/chat/completions', body, options).pipe(
        tap((res) => {
          // console.log('resp:', JSON.stringify(res));
        })
      );
    }
  }
}
