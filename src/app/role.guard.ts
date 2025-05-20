// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { AlertServiceService } from './services/alert-service.service';

@Injectable({
    providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router, private alertServiceService: AlertServiceService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user = JSON.parse(sessionStorage.getItem('userProfile') || '{}');
        this.authService.userRole = this.authService.userRole ? this.authService.userRole : user.role;
        if (this.authService.userRole && !this.router.routerState.snapshot.url.includes('login')) {
            const expectedRole = route.data.expectedRole;
            if (this.authService.userRole !== expectedRole) {
                this.alertServiceService.customError('Not a valid URL')
                return false;
            }
        }
        return true
    }
}
