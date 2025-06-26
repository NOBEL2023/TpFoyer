import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Chambre, TypeChambre } from '../models/chambre.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = 'http://localhost:8089/tpfoyer/chambre';

  constructor(private http: HttpClient) { }

  getAllChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/retrieve-all-chambres`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/retrieve-chambre/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.apiUrl}/add-chambre`, chambre)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/modify-chambre`, chambre)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-chambre/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getChambresByType(type: TypeChambre): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/trouver-chambres-selon-typ/${type}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getChambreByEtudiantCin(cin: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/trouver-chambre-selon-etudiant/${cin}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}