// authentication.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    isAuthenticated: boolean = false;
    userRole: string = '';

    setAuthenticationStatus(role: string): void {
        this.userRole = role;
    }
    // Implement methods to set and check authentication status
    // and retrieve user role.
}
