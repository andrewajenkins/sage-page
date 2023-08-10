import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { OPENAI_API_KEY, OPENAI_ORG } from '../../../../../tmp/creds';

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
export class BotWindowService {
  options: Options = {
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'OpenAI-Organization': OPENAI_ORG, // don't need this for text queries
    },
  };
  constructor(private http: HttpClient) {}
  getModels(): Observable<Model[]> {
    return this.http
      .get<ModelResponse>('https://api.openai.com/v1/models', this.options)
      .pipe(
        map((response: ModelResponse) => {
          return response.data;
        })
      ) as Observable<Model[]>;
  }
  postQuery(model = 'gpt-3.5-turbo-18k-0613', query = 'hi bot') {
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
    return this.http.post<RequestResponse>(
      'https://api.openai.com/v1/chat/completions',
      body,
      options
    );
  }
}
