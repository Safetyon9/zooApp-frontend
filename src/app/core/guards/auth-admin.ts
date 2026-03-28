import { inject, Injectable } from '@angular/core';
import { AuthServices } from '../services/auth-services';
import { CanActivateFn } from '@angular/router';

export const authAdminGuard: CanActivateFn = (route, state) => {
  const authServices = inject(AuthServices);
  
  return authServices.isRoleAdmin();
}
