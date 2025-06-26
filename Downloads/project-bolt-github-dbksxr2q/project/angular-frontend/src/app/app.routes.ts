import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/blocs', pathMatch: 'full' },
  { 
    path: 'blocs', 
    loadComponent: () => import('./components/bloc/bloc-list/bloc-list.component').then(m => m.BlocListComponent)
  },
  { 
    path: 'blocs/add', 
    loadComponent: () => import('./components/bloc/bloc-form/bloc-form.component').then(m => m.BlocFormComponent)
  },
  { 
    path: 'blocs/edit/:id', 
    loadComponent: () => import('./components/bloc/bloc-form/bloc-form.component').then(m => m.BlocFormComponent)
  },
  { 
    path: 'chambres', 
    loadComponent: () => import('./components/chambre/chambre-list/chambre-list.component').then(m => m.ChambreListComponent)
  },
  { 
    path: 'chambres/add', 
    loadComponent: () => import('./components/chambre/chambre-form/chambre-form.component').then(m => m.ChambreFormComponent)
  },
  { 
    path: 'chambres/edit/:id', 
    loadComponent: () => import('./components/chambre/chambre-form/chambre-form.component').then(m => m.ChambreFormComponent)
  },
  { 
    path: 'etudiants', 
    loadComponent: () => import('./components/etudiant/etudiant-list/etudiant-list.component').then(m => m.EtudiantListComponent)
  },
  { 
    path: 'etudiants/add', 
    loadComponent: () => import('./components/etudiant/etudiant-form/etudiant-form.component').then(m => m.EtudiantFormComponent)
  },
  { 
    path: 'etudiants/edit/:id', 
    loadComponent: () => import('./components/etudiant/etudiant-form/etudiant-form.component').then(m => m.EtudiantFormComponent)
  },
  { path: '**', redirectTo: '/blocs' }
];