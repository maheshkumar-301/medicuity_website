import { Injectable } from '@angular/core';
import { AbstractRestService } from './abstract-rest.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodeService extends AbstractRestService {

  readonly codingBaseUrl = environment.codingApiUrl + '/api';
  readonly redactBaseUrl = environment.redactApiUrl + '/api';

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

   codes(payload: FormData): Observable<any> {  
    const url = `${this.codingBaseUrl}/code`;
    return this.httpPost({
      url: url,
      payload: payload
    });
  }

   redact(payload: FormData): Observable<any> {  
    const url = `${this.redactBaseUrl}/redact`;
    return this.httpPost({
      url: url,
      payload: payload
    });
  }

   askQuestion(payload: FormData): Observable<any> {  
    const url = `${this.codingBaseUrl}/ask`;
    return this.httpPost({
      url: url,
      payload: payload
    });
  }

  }


