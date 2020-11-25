import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Move } from './chess-model/game-definitions/game-interface/Move';
import { MoveRequest } from './chess-model/game-definitions/game-interface/MoveRequest';

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {
  
  private chessGameUrl = 'http://localhost:8080/api'
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }
  
  beginGame() : Observable<any> {
    return this.http.post<any>(this.chessGameUrl+'/begin', this.httpOptions)
    .pipe(
      tap( _ => console.log(`fetched board after makeMove`)),
      catchError(this.handleError<any>('make move'))
    );
  }
  /* GET all game ids */
  getAllGameList() : Observable<number[]> {
    return this.http.get<number[]>(this.chessGameUrl+'/game/ids')
    .pipe( tap(_ => console.log('fetched all game ids')),
    catchError(this.handleError<number[]>('getAllGameList',[])))
  }

  getGameById(gameId: number) : Observable<any>{
    return this.http.get<any>(this.chessGameUrl+'/game/'+gameId)
    .pipe( tap(_ => console.log('fetched game id: '+gameId)),
    catchError(this.handleError<number[]>('getGameById',[])))

  }

  makeMove(move:MoveRequest) : Observable<any>{
    console.log("sending out move: ");
    console.log(move);
    return this.http.post<any>(this.chessGameUrl+'/makeMove', move, this.httpOptions)
    .pipe(
      tap( _ => console.log(`fetched board after makeMove`)),
      catchError(this.handleError<any>('make move'))
    );
  }
  undoMove(undoRequest:any): Observable<any>{
    return this.http.post<any>(this.chessGameUrl+'/undoMove', undoRequest, this.httpOptions)
    .pipe(
      tap( _ => console.log(`fetched board after makeMove`)),
      catchError(this.handleError<any>('make move'))
    );
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
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
