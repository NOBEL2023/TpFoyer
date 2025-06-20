import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BlocService } from '../../../services/bloc.service';
import { Bloc } from '../../../models/bloc.model';

@Component({
  selector: 'app-bloc-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="form-container">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
          {{ isEditMode ? 'Modifier le Bloc' : 'Ajouter un Bloc' }}
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="blocForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom du Bloc</mat-label>
            <input matInput formControlName="nomBloc" placeholder="Entrez le nom du bloc">
            <mat-error *ngIf="blocForm.get('nomBloc')?.hasError('required')">
              Le nom du bloc est requis
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Capacité</mat-label>
            <input matInput type="number" formControlName="capaciteBloc" placeholder="Entrez la capacité">
            <mat-error *ngIf="blocForm.get('capaciteBloc')?.hasError('required')">
              La capacité est requise
            </mat-error>
            <mat-error *ngIf="blocForm.get('capaciteBloc')?.hasError('min')">
              La capacité doit être supérieure à 0
            </mat-error>
          </mat-form-field>
          
          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()">
              <mat-icon>cancel</mat-icon>
              Annuler
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="blocForm.invalid || loading">
              <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              {{ isEditMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./bloc-form.component.scss']
})
export class BlocFormComponent implements OnInit {
  blocForm: FormGroup;
  isEditMode = false;
  loading = false;
  blocId?: number;

  constructor(
    private fb: FormBuilder,
    private blocService: BlocService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.blocForm = this.fb.group({
      nomBloc: ['', [Validators.required]],
      capaciteBloc: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.blocId = +id;
      this.loadBloc(this.blocId);
    }
  }

  loadBloc(id: number): void {
    this.loading = true;
    this.blocService.getBlocById(id).subscribe({
      next: (bloc) => {
        this.blocForm.patchValue({
          nomBloc: bloc.nomBloc,
          capaciteBloc: bloc.capaciteBloc
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bloc:', error);
        this.snackBar.open('Erreur lors du chargement du bloc', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.blocForm.valid) {
      this.loading = true;
      const bloc: Bloc = this.blocForm.value;
      
      if (this.isEditMode && this.blocId) {
        bloc.idBloc = this.blocId;
        this.blocService.updateBloc(bloc).subscribe({
          next: () => {
            this.snackBar.open('Bloc modifié avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/blocs']);
          },
          error: (error) => {
            console.error('Error updating bloc:', error);
            this.snackBar.open('Erreur lors de la modification du bloc', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      } else {
        this.blocService.addBloc(bloc).subscribe({
          next: () => {
            this.snackBar.open('Bloc ajouté avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/blocs']);
          },
          error: (error) => {
            console.error('Error adding bloc:', error);
            this.snackBar.open('Erreur lors de l\'ajout du bloc', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/blocs']);
  }
}