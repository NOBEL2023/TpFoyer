import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChambreService } from '../../../services/chambre.service';
import { Chambre } from '../../../models/chambre.model';

@Component({
  selector: 'app-chambre-list',
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
          <mat-icon>bed</mat-icon>
          Liste des Chambres
        </mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" routerLink="/chambres/add">
          <mat-icon>add</mat-icon>
          Ajouter une Chambre
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
        
        <div *ngIf="!loading && chambres.length === 0" class="no-data">
          <p>Aucune chambre trouvée.</p>
        </div>
        
        <table mat-table [dataSource]="chambres" *ngIf="!loading && chambres.length > 0" class="mat-elevation-z8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let chambre">{{chambre.idChambre}}</td>
          </ng-container>
          
          <ng-container matColumnDef="numero">
            <th mat-header-cell *matHeaderCellDef>Numéro</th>
            <td mat-cell *matCellDef="let chambre">{{chambre.numeroChambre}}</td>
          </ng-container>
          
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let chambre">{{chambre.typeC}}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let chambre">
              <div class="action-buttons">
                <button mat-icon-button color="primary" [routerLink]="['/chambres/edit', chambre.idChambre]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteChambre(chambre.idChambre!)">
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
  styleUrls: ['./chambre-list.component.scss']
})
export class ChambreListComponent implements OnInit {
  chambres: Chambre[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'numero', 'type', 'actions'];

  constructor(
    private chambreService: ChambreService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadChambres();
  }

  loadChambres(): void {
    this.loading = true;
    this.chambreService.getAllChambres().subscribe({
      next: (chambres) => {
        this.chambres = chambres;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chambres:', error);
        this.snackBar.open('Erreur lors du chargement des chambres', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteChambre(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
      this.chambreService.deleteChambre(id).subscribe({
        next: () => {
          this.snackBar.open('Chambre supprimée avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadChambres();
        },
        error: (error) => {
          console.error('Error deleting chambre:', error);
          this.snackBar.open('Erreur lors de la suppression de la chambre', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}