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
  { path: 'boutique/create-boutique',
    loadComponent: () => 
      import('./boutique/create-boutique/create-boutique').then(m => m.CreateBoutique) 
  },
  { path: 'boutique/products',
    loadComponent: () => 
      import('./boutique/product/product-list').then(m => m.ProductList) 
  },
  { path: 'boutique/products/create',
    loadComponent: () => 
      import('./boutique/create-product/create-product').then(m => m.CreateProduct) 
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'event',
    loadComponent: () =>
      import('./client/client-event/client-event').then(m => m.ClientEvent)
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./client/list-shop/list-shop').then(m => m.ListShop)
  },
  {
    path: 'shop/:id',
    loadComponent: () =>
      import('./client/shop-detail/shop-detail').then(m => m.ShopDetail)
  }

];
