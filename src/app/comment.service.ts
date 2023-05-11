import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CommentInterface } from './comment-interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentsUrl = 'api/comments'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private httpClient: HttpClient) {}

  /** GET comments from the server */
  getComments(): Observable<CommentInterface[]> {
    return this.httpClient.get<CommentInterface[]>(this.commentsUrl).pipe(
      tap((_) => console.log('fetched comments')),
      catchError(this.handleError<CommentInterface[]>('getComments', []))
    );
  }

  /** POST: add a new comment to the server */
  addComment(comment: CommentInterface): Observable<CommentInterface> {
    return this.httpClient
      .post<CommentInterface>(this.commentsUrl, comment, this.httpOptions)
      .pipe(
        tap((newComment: CommentInterface) =>
          console.log(`added comment w/ id=${newComment.id}`)
        ),
        catchError(this.handleError<CommentInterface>('addComment'))
      );
  }

  /** DELETE: delete the comment from the server */
  deleteComment(id: number): Observable<CommentInterface> {
    const url = `${this.commentsUrl}/${id}`;

    return this.httpClient.delete<CommentInterface>(url, this.httpOptions).pipe(
      tap((_) => console.log(`deleted comment id=${id}`)),
      catchError(this.handleError<CommentInterface>('deleteComment'))
    );
  }

  /** PUT: update the comment on the server */
  updateComment(comment: CommentInterface): Observable<any> {
    return this.httpClient
      .put(this.commentsUrl, comment, this.httpOptions)
      .pipe(
        tap((_) => console.log(`updated comment id=${comment.id}`)),
        catchError(this.handleError<any>('updateComment'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
