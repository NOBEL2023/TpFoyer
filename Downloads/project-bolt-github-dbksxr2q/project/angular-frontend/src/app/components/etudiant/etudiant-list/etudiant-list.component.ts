import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EtudiantService } from '../../../services/etudiant.service';
import { Etudiant } from '../../../models/etudiant.model';

@Component({
  selector: 'app-etudiant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>people</mat-icon>
          Liste des Étudiants
        </mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" routerLink="/etudiants/add">
          <mat-icon>add</mat-icon>
          Ajouter un Étudiant
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
        
        <div *ngIf="!loading && etudiants.length === 0" class="no-data">
          <p>Aucun étudiant trouvé.</p>
        </div>
        
        <table mat-table [dataSource]="etudiants" *ngIf="!loading && etudiants.length > 0" class="mat-elevation-z8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let etudiant">{{etudiant.idEtudiant}}</td>
          </ng-container>
          
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let etudiant">{{etudiant.nomEtudiant}}</td>
          </ng-container>
          
          <ng-container matColumnDef="prenom">
            <th mat-header-cell *matHeaderCellDef>Prénom</th>
            <td mat-cell *matCellDef="let etudiant">{{etudiant.prenomEtudiant}}</td>
          </ng-container>
          
          <ng-container matColumnDef="cin">
            <th mat-header-cell *matHeaderCellDef>CIN</th>
            <td mat-cell *matCellDef="let etudiant">{{etudiant.cinEtudiant}}</td>
          </ng-container>
          
          <ng-container matColumnDef="dateNaissance">
            <th mat-header-cell *matHeaderCellDef>Date de Naissance</th>
            <td mat-cell *matCellDef="let etudiant">{{etudiant.dateNaissance | date:'dd/MM/yyyy'}}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let etudiant">
              <div class="action-buttons">
                <button mat-icon-button color="primary" [routerLink]="['/etudiants/edit', etudiant.idEtudiant]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteEtudiant(etudiant.idEtudiant!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./etudiant-list.component.scss']
})
export class EtudiantListComponent implements OnInit {
  etudiants: Etudiant[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'cin', 'dateNaissance', 'actions'];

  constructor(
    private etudiantService: EtudiantService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadEtudiants();
  }

  loadEtudiants(): void {
    this.loading = true;
    this.etudiantService.getAllEtudiants().subscribe({
      next: (etudiants) => {
        this.etudiants = etudiants;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading etudiants:', error);
        this.snackBar.open('Erreur lors du chargement des étudiants', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteEtudiant(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      this.etudiantService.deleteEtudiant(id).subscribe({
        next: () => {
          this.snackBar.open('Étudiant supprimé avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadEtudiants();
        },
        error: (error) => {
          console.error('Error deleting etudiant:', error);
          this.snackBar.open('Erreur lors de la suppression de l\'étudiant', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}