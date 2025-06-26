import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChambreService } from '../../../services/chambre.service';
import { Chambre, TypeChambre } from '../../../models/chambre.model';

@Component({
  selector: 'app-chambre-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="form-container">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
          {{ isEditMode ? 'Modifier la Chambre' : 'Ajouter une Chambre' }}
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="chambreForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Numéro de Chambre</mat-label>
            <input matInput type="number" formControlName="numeroChambre" placeholder="Entrez le numéro de chambre">
            <mat-error *ngIf="chambreForm.get('numeroChambre')?.hasError('required')">
              Le numéro de chambre est requis
            </mat-error>
            <mat-error *ngIf="chambreForm.get('numeroChambre')?.hasError('min')">
              Le numéro de chambre doit être supérieur à 0
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Type de Chambre</mat-label>
            <mat-select formControlName="typeC">
              <mat-option *ngFor="let type of chambreTypes" [value]="type">
                {{type}}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="chambreForm.get('typeC')?.hasError('required')">
              Le type de chambre est requis
            </mat-error>
          </mat-form-field>
          
          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()">
              <mat-icon>cancel</mat-icon>
              Annuler
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="chambreForm.invalid || loading">
              <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              {{ isEditMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./chambre-form.component.scss']
})
export class ChambreFormComponent implements OnInit {
  chambreForm: FormGroup;
  isEditMode = false;
  loading = false;
  chambreId?: number;
  chambreTypes = Object.values(TypeChambre);

  constructor(
    private fb: FormBuilder,
    private chambreService: ChambreService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.chambreForm = this.fb.group({
      numeroChambre: ['', [Validators.required, Validators.min(1)]],
      typeC: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.chambreId = +id;
      this.loadChambre(this.chambreId);
    }
  }

  loadChambre(id: number): void {
    this.loading = true;
    this.chambreService.getChambreById(id).subscribe({
      next: (chambre) => {
        this.chambreForm.patchValue({
          numeroChambre: chambre.numeroChambre,
          typeC: chambre.typeC
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading chambre:', error);
        this.snackBar.open('Erreur lors du chargement de la chambre', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.chambreForm.valid) {
      this.loading = true;
      const chambre: Chambre = this.chambreForm.value;
      
      if (this.isEditMode && this.chambreId) {
        chambre.idChambre = this.chambreId;
        this.chambreService.updateChambre(chambre).subscribe({
          next: () => {
            this.snackBar.open('Chambre modifiée avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/chambres']);
          },
          error: (error) => {
            console.error('Error updating chambre:', error);
            this.snackBar.open('Erreur lors de la modification de la chambre', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      } else {
        this.chambreService.addChambre(chambre).subscribe({
          next: () => {
            this.snackBar.open('Chambre ajoutée avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/chambres']);
          },
          error: (error) => {
            console.error('Error adding chambre:', error);
            this.snackBar.open('Erreur lors de l\'ajout de la chambre', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/chambres']);
  }
}