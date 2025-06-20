import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EtudiantService } from '../../../services/etudiant.service';
import { Etudiant } from '../../../models/etudiant.model';

@Component({
  selector: 'app-etudiant-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="form-container">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>{{ isEditMode ? 'edit' : 'add' }}</mat-icon>
          {{ isEditMode ? 'Modifier l\'Étudiant' : 'Ajouter un Étudiant' }}
        </mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="etudiantForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom</mat-label>
            <input matInput formControlName="nomEtudiant" placeholder="Entrez le nom">
            <mat-error *ngIf="etudiantForm.get('nomEtudiant')?.hasError('required')">
              Le nom est requis
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Prénom</mat-label>
            <input matInput formControlName="prenomEtudiant" placeholder="Entrez le prénom">
            <mat-error *ngIf="etudiantForm.get('prenomEtudiant')?.hasError('required')">
              Le prénom est requis
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>CIN</mat-label>
            <input matInput type="number" formControlName="cinEtudiant" placeholder="Entrez le CIN">
            <mat-error *ngIf="etudiantForm.get('cinEtudiant')?.hasError('required')">
              Le CIN est requis
            </mat-error>
            <mat-error *ngIf="etudiantForm.get('cinEtudiant')?.hasError('min')">
              Le CIN doit être supérieur à 0
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Date de Naissance</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="dateNaissance">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-error *ngIf="etudiantForm.get('dateNaissance')?.hasError('required')">
              La date de naissance est requise
            </mat-error>
          </mat-form-field>
          
          <div class="form-actions">
            <button mat-button type="button" (click)="onCancel()">
              <mat-icon>cancel</mat-icon>
              Annuler
            </button>
            <button mat-raised-button color="primary" type="submit" [disabled]="etudiantForm.invalid || loading">
              <mat-icon>{{ isEditMode ? 'save' : 'add' }}</mat-icon>
              {{ isEditMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styleUrls: ['./etudiant-form.component.scss']
})
export class EtudiantFormComponent implements OnInit {
  etudiantForm: FormGroup;
  isEditMode = false;
  loading = false;
  etudiantId?: number;

  constructor(
    private fb: FormBuilder,
    private etudiantService: EtudiantService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.etudiantForm = this.fb.group({
      nomEtudiant: ['', [Validators.required]],
      prenomEtudiant: ['', [Validators.required]],
      cinEtudiant: ['', [Validators.required, Validators.min(1)]],
      dateNaissance: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.etudiantId = +id;
      this.loadEtudiant(this.etudiantId);
    }
  }

  loadEtudiant(id: number): void {
    this.loading = true;
    this.etudiantService.getEtudiantById(id).subscribe({
      next: (etudiant) => {
        this.etudiantForm.patchValue({
          nomEtudiant: etudiant.nomEtudiant,
          prenomEtudiant: etudiant.prenomEtudiant,
          cinEtudiant: etudiant.cinEtudiant,
          dateNaissance: new Date(etudiant.dateNaissance)
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading etudiant:', error);
        this.snackBar.open('Erreur lors du chargement de l\'étudiant', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.etudiantForm.valid) {
      this.loading = true;
      const etudiant: Etudiant = this.etudiantForm.value;
      
      if (this.isEditMode && this.etudiantId) {
        etudiant.idEtudiant = this.etudiantId;
        this.etudiantService.updateEtudiant(etudiant).subscribe({
          next: () => {
            this.snackBar.open('Étudiant modifié avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/etudiants']);
          },
          error: (error) => {
            console.error('Error updating etudiant:', error);
            this.snackBar.open('Erreur lors de la modification de l\'étudiant', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      } else {
        this.etudiantService.addEtudiant(etudiant).subscribe({
          next: () => {
            this.snackBar.open('Étudiant ajouté avec succès', 'Fermer', {
              duration: 3000
            });
            this.router.navigate(['/etudiants']);
          },
          error: (error) => {
            console.error('Error adding etudiant:', error);
            this.snackBar.open('Erreur lors de l\'ajout de l\'étudiant', 'Fermer', {
              duration: 3000
            });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/etudiants']);
  }
}