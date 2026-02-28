import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login').then(m => m.Login)
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
  { path: 'boutique', 
    loadComponent: () => 
      import('./boutique/boutique').then(m => m.Boutique) 
  },
  { path: 'boutique/reservation',
    loadComponent: () => 
      import('./boutique/reservation/reservation').then(m => m.Reservation) 
  },
  { path: 'boutique/reservation/select-shop',
    loadComponent: () => 
      import('./boutique/select-shop/select-shop').then(m => m.SelectShop) 
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }

];
