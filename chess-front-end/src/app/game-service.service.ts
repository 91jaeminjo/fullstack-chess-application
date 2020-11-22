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

  /* GET all game ids */
  getAllGameList() : Observable<number[]> {
    return this.http.get<number[]>(this.chessGameUrl+'/gameIds')
    .pipe( tap(_ => console.log('fetched all game ids')),
    catchError(this.handleError<number[]>('getAllGameList',[])))
  }

  getGameById(gameId: number) : Observable<any>{
    return this.http.get<any>(this.chessGameUrl+'/game/'+gameId)
    .pipe( tap(_ => console.log('fetched game id: '+gameId)),
    catchError(this.handleError<number[]>('getGameById',[])))

  }
  getBoardById(boardId: number) : Observable<any>{
    return this.http.get<any>(this.chessGameUrl+'/board/'+boardId)
    .pipe( tap(_ => console.log('fetched board id: '+boardId)),
    catchError(this.handleError<number[]>('getBoardById',[])))
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
//   /** GET hero by id. Will 404 if id not found */
//   getHero(id: number): Observable<Hero> {
//     const url = `${this.heroesUrl}/${id}`;
//     return this.http.get<Hero>(url).pipe(
//       tap(_ => this.log(`fetched hero id=${id}`)),
//       catchError(this.handleError<Hero>(`getHero id=${id}`))
//     );
//   }
//   /** PUT: update the hero on the server */
//   updateHero(hero: Hero): Observable<any> {
//     return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
//       tap(_ => this.log(`updated hero id=${hero.id}`)),
//       catchError(this.handleError<any>('updateHero'))
//     );
//   }

//   /** POST: add a new hero to the server */
//   addHero(hero: Hero): Observable<Hero> {
//     return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
//       tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
//       catchError(this.handleError<Hero>('addHero'))
//     );
//   }
//   /** DELETE: delete the hero from the server */
//   deleteHero(hero: Hero | number): Observable<Hero> {
//     const id = typeof hero === 'number' ? hero : hero.id;
//     const url = `${this.heroesUrl}/${id}`;

//     return this.http.delete<Hero>(url, this.httpOptions).pipe(
//       tap(_ => this.log(`deleted hero id=${id}`)),
//       catchError(this.handleError<Hero>('deleteHero'))
//     );
//   }
//   /* GET heroes whose name contains search term */
// searchHeroes(term: string): Observable<Hero[]> {
//   if (!term.trim()) {
//     // if not search term, return empty hero array.
//     return of([]);
//   }
//   return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
//     tap(x => x.length ?
//        this.log(`found heroes matching "${term}"`) :
//        this.log(`no heroes matching "${term}"`)),
//     catchError(this.handleError<Hero[]>('searchHeroes', []))
//   );
// }

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
