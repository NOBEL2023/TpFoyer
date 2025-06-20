import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chambre, TypeChambre } from '../models/chambre.model';

@Injectable({
  providedIn: 'root'
})
export class ChambreService {
  private apiUrl = 'http://localhost:8089/tpfoyer/chambre';

  constructor(private http: HttpClient) { }

  getAllChambres(): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/retrieve-all-chambres`);
  }

  getChambreById(id: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/retrieve-chambre/${id}`);
  }

  addChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.post<Chambre>(`${this.apiUrl}/add-chambre`, chambre);
  }

  updateChambre(chambre: Chambre): Observable<Chambre> {
    return this.http.put<Chambre>(`${this.apiUrl}/modify-chambre`, chambre);
  }

  deleteChambre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove-chambre/${id}`);
  }

  getChambresByType(type: TypeChambre): Observable<Chambre[]> {
    return this.http.get<Chambre[]>(`${this.apiUrl}/trouver-chambres-selon-typ/${type}`);
  }

  getChambreByEtudiantCin(cin: number): Observable<Chambre> {
    return this.http.get<Chambre>(`${this.apiUrl}/trouver-chambre-selon-etudiant/${cin}`);
  }
}