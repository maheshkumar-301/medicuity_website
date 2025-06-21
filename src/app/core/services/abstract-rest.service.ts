import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToClassFromExist } from 'class-transformer';
import { finalize, map, Observable } from 'rxjs';

export const CALLER_ERROR_HANDLER_KEY = 'e';
@Injectable({
  providedIn: 'root'
})
export class AbstractRestService {
  loadingBar: any;

  
  constructor(protected httpClient: HttpClient) { 
  }
  
  protected deserialise<T>(json: any, targetClass: any): any {
    return plainToClassFromExist(targetClass, json);
  }

  private httpRequest<T>(
    httpObservable: Observable<Object>,
    context: { returnType?: any; noLoadingMask?: boolean }
  ): Observable<T | T[]> {
    if (!context.noLoadingMask) {
      this.mask();
    }
    const observable = httpObservable
      .pipe(
        map((result) => {
          if (context.returnType) {
            return this.deserialise(result, context.returnType);
          }
          return result;
        })
      )
      .pipe(
        finalize(() => {
          if (!context.noLoadingMask) {
            this.unmask();
          }
        })
      );
    return observable;
  }

  protected mask(): void {
    // this.loadingBar.start();
  }

  unmask(): void {
    // this.loadingBar.stop();
  }

  private updateErrorParam(context: { params?: HttpParams; callerErrorHandler?: boolean }): void {
    if (context.callerErrorHandler === true) {
      const params = context.params ? context.params : new HttpParams();
      context.params = params.append(CALLER_ERROR_HANDLER_KEY, 'true');
    }
  }

  httpGet<T>(context: {
    url: string;
    returnType?: any;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
    observe?: any;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(this.httpClient.get(context.url, { params: context.params, observe: context.observe }), context);
  }

  httpDelete<T>(context: {
    url: string;
    returnType?: any;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
    observe?: any;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(this.httpClient.delete(context.url, { params: context.params, observe: context.observe }), context);
  }

  httpPost<T>(context: {
    url: string;
    payload?: any;
    returnType?: any;
    params?: HttpParams;
    headers?: HttpHeaders;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(
      this.httpClient.post(context.url, context.payload, { params: context.params, headers: context.headers }),
      context
    );
  }

  httpPosts<T>(context: {
    url: string;
    payload?: any;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
  }): Observable<T | T[]> {
    return this.httpRequest(
      this.httpClient.post(context.url, context.payload, {  }),
      context
    );
  }

  httpPut<T>(context: {
    url: string;
    payload?: any;
    returnType?: any;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(this.httpClient.put(context.url, context.payload, { params: context.params }), context);
  }
  httpPatch<T>(context: {
    url: string;
    payload?: any;
    returnType?: any;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(this.httpClient.patch(context.url, context.payload, { params: context.params }), context);
  }

  httpGetBlob<T>(context: {
    url: string;
    returnType?: any;
    params?: HttpParams;
    noLoadingMask?: boolean;
    callerErrorHandler?: boolean;
    observe?: any;
  }): Observable<T | T[]> {
    this.updateErrorParam(context);
    return this.httpRequest(
      this.httpClient.get(context.url, { params: context.params, observe: context.observe, responseType: 'blob' }),
      context
    );
  }
}
