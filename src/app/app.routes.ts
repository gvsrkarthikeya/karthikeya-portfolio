import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'GVSR Karthikeya – Senior UI Engineer',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
  {
    path: 'github',
    title: 'GitHub – GVSR Karthikeya',
    loadComponent: () => import('./pages/github-page').then((m) => m.GithubPage),
  },
  {
    path: 'lab',
    title: 'UI Lab – GVSR Karthikeya',
    loadComponent: () => import('./pages/lab-page').then((m) => m.LabPage),
  },
  { path: '**', redirectTo: '' },
];
