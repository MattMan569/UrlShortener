import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from './../environments/environment';
import IUrl from '../../../types/url';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private apiUrl = `${environment.apiUrl}/url`;

  constructor(private http: HttpClient) { }

  /**
   * Create a new short url.
   *
   * Return the link to the redirection page on success,
   * otherwise return the error
   */
  createUrl(url: string, slug?: string): Promise<string | HttpErrorResponse> {
    return new Promise<string | HttpErrorResponse>((resolve, reject) => {
      if (!url) {
        return reject('Missing url');
      }

      // Typescript bug https://github.com/microsoft/TypeScript/issues/43053
      // FIXME when the bug is fixed
      // tslint:disable-next-line: deprecation
      this.http.post<IUrl>(this.apiUrl, { url, slug }).subscribe({
        next: (data) => {
          resolve(`${environment.apiUrl}/${data.slug}`);
        },
        error: (error: HttpErrorResponse) => {
          resolve(error);
        },
      });
    });
  }
}
