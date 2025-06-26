import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiUrl = 'http://localhost:8089/tpfoyer/etudiant';

  constructor(private http: HttpClient) { }

  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.apiUrl}/retrieve-all-etudiants`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getEtudiantById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/retrieve-etudiant/${id}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getEtudiantByCin(cin: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/retrieve-etudiant-cin/${cin}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  addEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.apiUrl}/add-etudiant`, etudiant)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/modify-etudiant`, etudiant)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteEtudiant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-etudiant/${id}`)
      .pipe(
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