import { Routes } from '@angular/router';
import { Main } from './pages/main/main';

export const routes: Routes = [
  {
    path: '',
    component: Main,
  },
  {
    path: 'rented',
    loadComponent: () => import('./pages/rented/rented').then((m) => m.Rented),
  },
  {
    path: 'paid-off',
    loadComponent: () => import('./pages/paid-off/paid-off').then((m) => m.PaidOff),
  },
  {
    path: 'funded',
    loadComponent: () => import('./pages/funded/funded').then((m) => m.Funded),
  },
  {
    path: 'result',
    loadComponent: () => import('./pages/result/result').then((m) => m.Result),
  },
];
