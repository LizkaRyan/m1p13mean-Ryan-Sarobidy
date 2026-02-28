import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // convertir en ms
    return Date.now() > expiry;
  } catch {
    return true;
  }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const excludedUrls = ['/auth/login', '/register'];

  const shouldExclude = excludedUrls.some(url => req.url.includes(url));

  if (shouldExclude) {
    return next(req);
  }

  const token = authService.getToken();

  if (token) {

    if (isTokenExpired(token)) {
      authService.logout(); // optionnel
      router.navigate(['/login']);
      return next(req); // ou on peut arrêter la requête
    }

    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedReq);
  }

  return next(req);
};
