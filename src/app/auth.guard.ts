import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './services/user.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(UserService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  const userRole = authService.getRole();

  if (authService.isLoggedIn() && userRole === expectedRole) {
    return true;
  } else if(authService.isLoggedIn()) {
    router.navigate(['/forbidden']);
    return false;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
