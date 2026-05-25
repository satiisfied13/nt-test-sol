import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../login/auth.service';

export const CanActivateChat: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.user()) {
    const loginPath = router.parseUrl('/login');
    return new RedirectCommand(loginPath);
  }
  return true;
};
