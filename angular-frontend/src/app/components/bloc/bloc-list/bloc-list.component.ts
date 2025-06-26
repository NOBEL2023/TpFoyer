import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
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
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>
          <mat-icon>apartment</mat-icon>
          Liste des Blocs
        </mat-card-title>
        <div class="spacer"></div>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Rechercher par nom</mat-label>
            <input matInput [(ngModel)]="searchTerm" (input)="onSearch()" placeholder="Nom du bloc">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" routerLink="/blocs/add">
            <mat-icon>add</mat-icon>
            Ajouter un Bloc
          </button>
          <button mat-stroked-button color="accent" (click)="loadBlocsWithoutFoyer()">
            <mat-icon>home_work</mat-icon>
            Blocs sans Foyer
          </button>
          <button mat-stroked-button (click)="loadAllBlocs()">
            <mat-icon>refresh</mat-icon>
            Actualiser
          </button>
        </div>
      </mat-card-header>
      
      <mat-card-content>
        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner></mat-spinner>
          <p>Chargement des blocs...</p>
        </div>
        
        <div *ngIf="!loading && filteredBlocs.length === 0 && !searchTerm" class="no-data">
          <mat-icon>info</mat-icon>
          <p>Aucun bloc trouvé. Commencez par ajouter un bloc.</p>
        </div>

        <div *ngIf="!loading && filteredBlocs.length === 0 && searchTerm" class="no-data">
          <mat-icon>search_off</mat-icon>
          <p>Aucun bloc trouvé pour "{{searchTerm}}".</p>
        </div>
        
        <div *ngIf="!loading && filteredBlocs.length > 0" class="table-container">
          <table mat-table [dataSource]="filteredBlocs" class="mat-elevation-z8">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let bloc">{{bloc.idBloc}}</td>
            </ng-container>
            
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let bloc">
                <strong>{{bloc.nomBloc}}</strong>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="capacite">
              <th mat-header-cell *matHeaderCellDef>Capacité</th>
              <td mat-cell *matCellDef="let bloc">
                <span class="capacity-badge">{{bloc.capaciteBloc}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="foyer">
              <th mat-header-cell *matHeaderCellDef>Foyer</th>
              <td mat-cell *matCellDef="let bloc">
                <span *ngIf="bloc.foyer" class="foyer-name">{{bloc.foyer.nomFoyer}}</span>
                <span *ngIf="!bloc.foyer" class="no-foyer">Aucun foyer</span>
              </td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let bloc">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" 
                          [routerLink]="['/blocs/edit', bloc.idBloc]"
                          matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" 
                          (click)="deleteBloc(bloc)"
                          matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="table-row" 
                [class.highlight]="row.idBloc === highlightedBlocId"></tr>
          </table>
        </div>

        <div *ngIf="!loading && filteredBlocs.length > 0" class="table-info">
          <p>{{filteredBlocs.length}} bloc(s) affiché(s) sur {{blocs.length}} total</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./bloc-list.component.scss']
})
export class BlocListComponent implements OnInit {
  blocs: Bloc[] = [];
  filteredBlocs: Bloc[] = [];
  loading = false;
  searchTerm = '';
  highlightedBlocId?: number;
  displayedColumns: string[] = ['id', 'nom', 'capacite', 'foyer', 'actions'];

  constructor(
    private blocService: BlocService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadAllBlocs();
  }

  loadAllBlocs(): void {
    this.loading = true;
    this.blocService.getAllBlocs().subscribe({
      next: (blocs) => {
        this.blocs = blocs;
        this.filteredBlocs = [...blocs];
        this.loading = false;
        this.showSuccessMessage(`${blocs.length} bloc(s) chargé(s)`);
      },
      error: (error) => {
        console.error('Error loading blocs:', error);
        this.showErrorMessage('Erreur lors du chargement des blocs');
        this.loading = false;
      }
    });
  }

  loadBlocsWithoutFoyer(): void {
    this.loading = true;
    this.blocService.getBlocsWithoutFoyer().subscribe({
      next: (blocs) => {
        this.filteredBlocs = blocs;
        this.loading = false;
        this.showSuccessMessage(`${blocs.length} bloc(s) sans foyer trouvé(s)`);
      },
      error: (error) => {
        console.error('Error loading blocs without foyer:', error);
        this.showErrorMessage('Erreur lors du chargement des blocs sans foyer');
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBlocs = [...this.blocs];
    } else {
      this.filteredBlocs = this.blocs.filter(bloc =>
        bloc.nomBloc.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  deleteBloc(bloc: Bloc): void {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le bloc "${bloc.nomBloc}" ?`;
    
    if (confirm(confirmMessage)) {
      this.blocService.deleteBloc(bloc.idBloc!).subscribe({
        next: () => {
          this.showSuccessMessage(`Bloc "${bloc.nomBloc}" supprimé avec succès`);
          this.loadAllBlocs();
        },
        error: (error) => {
          console.error('Error deleting bloc:', error);
          this.showErrorMessage('Erreur lors de la suppression du bloc');
        }
      });
    }
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}