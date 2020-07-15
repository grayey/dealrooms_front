import {Injectable} from '@angular/core';
import * as Cookies from '../utils/cookies';
import {Router} from '@angular/router';
import {Cache} from '../utils/cache';
import {LogoutTypes} from '../shared/enum/logout.type';
import {DateFormatting} from '../utils/util';
import {ApiHandlerService} from './api-handler.service';
import {NotificationService} from './notification.service';

@Injectable()
export class TokenService extends DateFormatting {

    constructor(private router: Router,
                private Alert: NotificationService) {
        super();
    }

    /**
     * This is used to set authenticated user into cache.
     * @param user
     */
    public setAuthUser(user: any): void {
        // console.log('Auth User ', user);
        Cookies.set('chi-user-auth-token', user, {expires: 1});
        Cache.set('chi-user-auth-token', this.getAuthUser());
    }

    /**
     * This is used to get Authenticated user from cache
     */
    public getAuthUser(): any {
        const cacheUser = Cache.get('chi-user-auth-token');
        return (cacheUser) ? cacheUser : this.dateFormatterInResponse({data: Cookies.get('chi-user-auth-token')})['data'];
    }


    /**
     * This is to set auth user session
     * @param data
     */
    public setAuthUserSession(data) {
        Cache.set('chi-user-auth-token', data);
    }

    /**
     * This is used to get Authenticated user from cache
     */
    public getAuthUserToken(): any {
        return Cookies.getToken();
    }

    /**
     * This is used to get user in a session
     */
    public getUserSession(): any {
        return Cache.get('chi-user-auth-token');
    }

    /**
     * This is used to delete Authenticated user from Cache.
     */
    public removeAuthUser(): void {
        Cookies.remove('chi-user-auth-token');
        Cache.remove('chi-user-auth-token');
    }

    /**
     * This is to remove user in a session
     * @returns {undefined}
     */
    public removeUserSession(): any {
        return Cache.remove('chi-user-auth-token');
    }

    /**
     * Check if user token exist in Cache
     * @returns {boolean}
     */
    public isLoggedIn(): boolean {
        return !!(this.getAuthUser());
    }

    /**
     * This is used to logout
     * @param type
     * @param message
     * @returns {null}
     */
    public logout(type?: LogoutTypes | String, message?: string) {
        this.removeAuthUser();
        Cache.clear();
        localStorage.clear();

        switch (type) {
            case LogoutTypes.CHECKOUT:
                return null;
            case LogoutTypes.SESSION_EXPIRATION:
                Cache.set('cloud-session-expiration', message || 'You were logged out due to session timeout, please login again to continue.');
                this.Alert.error('Your session timed out, please login again to continue.');
                this.router.navigateByUrl('/login');
                break;

            case '403':
                Cache.set('cloud-session-expiration', message || 'You were logged out due to session timeout, please try again');
                // window.location.href = window.location.origin + '';
                this.Alert.error('Forbidden Access!');
                this.router.navigateByUrl('/403-denied');


            case 'stay':
                this.router.navigateByUrl('/login');
                break;
            case 'home':
                this.router.navigateByUrl('');
                break;
            default:
                this.router.navigateByUrl('/login');
                return;
        }
    }

    public logEmailOut() {
        this.removeAuthUser();
        Cache.clear();
        localStorage.clear();
    }

}
