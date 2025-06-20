import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlocService } from '../../../services/bloc.service';
import { Bloc } from '../../../models/bloc.model';

@Component({
  selector: 'app-bloc-list',
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
          <mat-icon>apartment</mat-icon>
          Liste des Blocs
        </mat-card-title>
        <div class="spacer"></div>
        <button mat-raised-button color="primary" routerLink="/blocs/add">
          <mat-icon>add</mat-icon>
          Ajouter un Bloc
        </button>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
        </div>
        
        <div *ngIf="!loading && blocs.length === 0" class="no-data">
          <p>Aucun bloc trouvé.</p>
        </div>
        
        <table mat-table [dataSource]="blocs" *ngIf="!loading && blocs.length > 0" class="mat-elevation-z8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let bloc">{{bloc.idBloc}}</td>
          </ng-container>
          
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom</th>
            <td mat-cell *matCellDef="let bloc">{{bloc.nomBloc}}</td>
          </ng-container>
          
          <ng-container matColumnDef="capacite">
            <th mat-header-cell *matHeaderCellDef>Capacité</th>
            <td mat-cell *matCellDef="let bloc">{{bloc.capaciteBloc}}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let bloc">
              <div class="action-buttons">
                <button mat-icon-button color="primary" [routerLink]="['/blocs/edit', bloc.idBloc]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteBloc(bloc.idBloc!)">
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
  styleUrls: ['./bloc-list.component.scss']
})
export class BlocListComponent implements OnInit {
  blocs: Bloc[] = [];
  loading = false;
  displayedColumns: string[] = ['id', 'nom', 'capacite', 'actions'];

  constructor(
    private blocService: BlocService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadBlocs();
  }

  loadBlocs(): void {
    this.loading = true;
    this.blocService.getAllBlocs().subscribe({
      next: (blocs) => {
        this.blocs = blocs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading blocs:', error);
        this.snackBar.open('Erreur lors du chargement des blocs', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  deleteBloc(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
      this.blocService.deleteBloc(id).subscribe({
        next: () => {
          this.snackBar.open('Bloc supprimé avec succès', 'Fermer', {
            duration: 3000
          });
          this.loadBlocs();
        },
        error: (error) => {
          console.error('Error deleting bloc:', error);
          this.snackBar.open('Erreur lors de la suppression du bloc', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
}