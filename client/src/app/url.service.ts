import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../environments/environment';
import IUrl from './../../../types/url';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private apiUrl = `${environment.apiUrl}/url`;

  constructor(private http: HttpClient) { }

  /** Create a new short url */
  createUrl(url: string, slug?: string): Promise<IUrl> {
    return new Promise<IUrl>((resolve) => {
      // Typescript bug https://github.com/microsoft/TypeScript/issues/43053
      // tslint:disable-next-line: deprecation
      this.http.post<IUrl>(this.apiUrl, { url, slug }).subscribe({
        next: (data) => {
          resolve(data);
        },
        error: (error: HttpErrorResponse) => {
          // TODO remove console
          console.error(error.message);
        },
      });
    });
  }
}
