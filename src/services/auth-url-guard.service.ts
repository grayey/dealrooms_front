import {Injectable} from '@angular/core';
import {TokenService} from './token.service';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {UserService} from './user.service';
import {UserHasTask} from '../shared/magic-methods/resolveUserTasks';
import {NotificationService} from './notification.service';
import {Location} from '@angular/common';


@Injectable()
export class AuthUrlGuardService implements CanActivate {
  constructor(private  tokenService: TokenService, private userService: UserService,
              private notification: NotificationService, private _location: Location) {
  }


  public isAuthenticated(): boolean {
    const token = this.tokenService.getAuthUserToken();
    return !!token;
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isAuthenticated()) {
      this.userService.logout();
      return false;
    }
    const expectedTask = route.data;

    if (Object.keys(expectedTask).length > 0) {
      const userTask = new UserHasTask(expectedTask.task);
      const canAccess = userTask.hasTask();
      if (!canAccess) {
        this.notification.warning('Forbidden Access!');
        this.userService.logout();
      }
      return canAccess;
    }

    return true;
  }


}
