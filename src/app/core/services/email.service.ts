import { Injectable } from '@angular/core';
import { AbstractRestService } from './abstract-rest.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends AbstractRestService {

  readonly emailBaseUrl = environment.emailApiUrl + '/api';

  constructor(private _httpClient: HttpClient) {
    super(_httpClient);
  }

  sendEmail(payload: any): Observable<any> {
    const url = `${this.emailBaseUrl}/send-email`;
    return this.httpPost({
      url: url,
      payload: payload
    });
  }


}


