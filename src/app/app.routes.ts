import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./sign-up/sign-up').then(m => m.SignUp)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/stat/stat').then(m => m.Stat)
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
    path: 'event',
    loadComponent: () =>
      import('./client/client-event/client-event').then(m => m.ClientEvent)
  },
  {
    path: 'admin/event-validation',
    loadComponent: () =>
      import('./admin/event-validation/event-validation').then(m => m.EventValidation),
    runGuardsAndResolvers: 'always'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
