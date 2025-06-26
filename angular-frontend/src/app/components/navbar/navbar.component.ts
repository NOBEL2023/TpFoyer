import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>home</mat-icon>
      <span style="margin-left: 10px;">Foyer Management System</span>
      
      <span class="spacer"></span>
      
      <button mat-button routerLink="/blocs" routerLinkActive="active">
        <mat-icon>apartment</mat-icon>
        Blocs
      </button>
      
      <button mat-button routerLink="/chambres" routerLinkActive="active">
        <mat-icon>bed</mat-icon>
        Chambres
      </button>
      
      <button mat-button routerLink="/etudiants" routerLinkActive="active">
        <mat-icon>people</mat-icon>
        Étudiants
      </button>
    </mat-toolbar>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent { }