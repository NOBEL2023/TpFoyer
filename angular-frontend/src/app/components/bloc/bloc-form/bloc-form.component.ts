import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-wrapper">
      <mat-card class="form-container">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
            {{ isEditMode ? 'Modifier le Bloc' : 'Ajouter un Bloc' }}
          </mat-card-title>
          <mat-card-subtitle *ngIf="isEditMode && currentBloc">
            Modification du bloc: {{ currentBloc.nomBloc }}
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="loading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
            <p>{{ isEditMode ? 'Chargement du bloc...' : 'Traitement en cours...' }}</p>
          </div>

          <form [formGroup]="blocForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom du Bloc</mat-label>
              <input matInput 
                     formControlName="nomBloc" 
                     placeholder="Entrez le nom du bloc"
                     maxlength="50">
              <mat-hint>Maximum 50 caractères</mat-hint>
              <mat-error *ngIf="blocForm.get('nomBloc')?.hasError('required')">
                Le nom du bloc est requis
              </mat-error>
              <mat-error *ngIf="blocForm.get('nomBloc')?.hasError('minlength')">
                Le nom doit contenir au moins 2 caractères
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Capacité</mat-label>
              <input matInput 
                     type="number" 
                     formControlName="capaciteBloc" 
                     placeholder="Entrez la capacité"
                     min="1"
                     max="1000">
              <mat-hint>Entre 1 et 1000</mat-hint>
              <mat-error *ngIf="blocForm.get('capaciteBloc')?.hasError('required')">
                La capacité est requise
              </mat-error>
              <mat-error *ngIf="blocForm.get('capaciteBloc')?.hasError('min')">
                La capacité doit être supérieure à 0
              </mat-error>
              <mat-error *ngIf="blocForm.get('capaciteBloc')?.hasError('max')">
                La capacité ne peut pas dépasser 1000
              </mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-button 
                      type="button" 
                      (click)="onCancel()"
                      [disabled]="submitting">
                <mat-icon>cancel</mat-icon>
                Annuler
              </button>
              <button mat-raised-button 
                      color="primary" 
                      type="submit" 
                      [disabled]="blocForm.invalid || submitting">
                <mat-spinner diameter="20" *ngIf="submitting"></mat-spinner>
                <mat-icon *ngIf="!submitting">{{ isEditMode ? 'save' : 'add' }}</mat-icon>
                {{ submitting ? 'Traitement...' : (isEditMode ? 'Modifier' : 'Ajouter') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./bloc-form.component.scss']
})
export class BlocFormComponent implements OnInit {
  blocForm: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  blocId?: number;
  currentBloc?: Bloc;

  constructor(
    private fb: FormBuilder,
    private blocService: BlocService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.blocForm = this.fb.group({
      nomBloc: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      capaciteBloc: ['', [Validators.required, Validators.min(1), Validators.max(1000)]]
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
        this.currentBloc = bloc;
        this.blocForm.patchValue({
          nomBloc: bloc.nomBloc,
          capaciteBloc: bloc.capaciteBloc
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bloc:', error);
        this.showErrorMessage('Erreur lors du chargement du bloc');
        this.loading = false;
        this.router.navigate(['/blocs']);
      }
    });
  }

  onSubmit(): void {
    if (this.blocForm.valid && !this.submitting) {
      this.submitting = true;
      const bloc: Bloc = {
        ...this.blocForm.value,
        ...(this.isEditMode && this.blocId ? { idBloc: this.blocId } : {})
      };
      
      const operation = this.isEditMode 
        ? this.blocService.updateBloc(bloc)
        : this.blocService.addBloc(bloc);

      operation.subscribe({
        next: (savedBloc) => {
          const message = this.isEditMode 
            ? `Bloc "${savedBloc.nomBloc}" modifié avec succès`
            : `Bloc "${savedBloc.nomBloc}" ajouté avec succès`;
          
          this.showSuccessMessage(message);
          this.router.navigate(['/blocs']);
        },
        error: (error) => {
          console.error('Error saving bloc:', error);
          const message = this.isEditMode 
            ? 'Erreur lors de la modification du bloc'
            : 'Erreur lors de l\'ajout du bloc';
          
          this.showErrorMessage(message);
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    if (this.blocForm.dirty && !this.submitting) {
      const confirmMessage = 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?';
      if (confirm(confirmMessage)) {
        this.router.navigate(['/blocs']);
      }
    } else {
      this.router.navigate(['/blocs']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.blocForm.controls).forEach(key => {
      const control = this.blocForm.get(key);
      control?.markAsTouched();
    });
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