import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private apiUrl = 'http://localhost:8089/tpfoyer/etudiant';

  constructor(private http: HttpClient) { }

  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.apiUrl}/retrieve-all-etudiants`);
  }

  getEtudiantById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/retrieve-etudiant/${id}`);
  }

  getEtudiantByCin(cin: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/retrieve-etudiant-cin/${cin}`);
  }

  addEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.apiUrl}/add-etudiant`, etudiant);
  }

  updateEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/modify-etudiant`, etudiant);
  }

  deleteEtudiant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-etudiant/${id}`);
  }
}