import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },
  {
    path: 'admin/room',
    loadComponent: () =>
      import('./admin/room/room').then(m => m.RoomPage)
  },
  {
    path: 'admin/reservation-validation',
    loadComponent: () =>
      import('./admin/reservation-validation/reservation-validation').then(m => m.ReservationValidation)
  },
  {
    path: 'admin/event',
    loadComponent: () =>
      import('./admin/event/event').then(m => m.Event)
  },
  {
    path: 'admin/event-validation',
    loadComponent: () =>
      import('./admin/event-validation/event-validation').then(m => m.EventValidation)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
