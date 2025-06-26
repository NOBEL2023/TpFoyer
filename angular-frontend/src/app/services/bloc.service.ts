import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Bloc } from '../models/bloc.model';

@Injectable({
  providedIn: 'root'
})
export class BlocService {
  private apiUrl = 'http://localhost:8089/tpfoyer/bloc';

  constructor(private http: HttpClient) { }

  getAllBlocs(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.apiUrl}/retrieve-all-blocs`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getBlocById(id: number): Observable<Bloc> {
    return this.http.get<Bloc>(`${this.apiUrl}/retrieve-bloc/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addBloc(bloc: Bloc): Observable<Bloc> {
    return this.http.post<Bloc>(`${this.apiUrl}/add-bloc`, bloc)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateBloc(bloc: Bloc): Observable<Bloc> {
    return this.http.put<Bloc>(`${this.apiUrl}/modify-bloc`, bloc)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteBloc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-bloc/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBlocsWithoutFoyer(): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.apiUrl}/trouver-blocs-sans-foyer`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getBlocsByNameAndCapacity(name: string, capacity: number): Observable<Bloc[]> {
    return this.http.get<Bloc[]>(`${this.apiUrl}/get-bloc-nb-c/${name}/${capacity}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}