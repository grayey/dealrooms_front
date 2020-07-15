import {Component, OnInit} from '@angular/core';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {TokenService} from '../../../services/token.service';
import {NotificationService} from '../../../services/notification.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Cache} from '../../../utils/cache';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends MagicClasses implements OnInit {


  static userLoginForm = () => {
    return {
      username: ['', Validators.required],
      password: ['', Validators.required],
      // user_type: ['', Validators.required],

    };
  };

  public userLoginForm: FormGroup;
  public viewPassword = true;
  public year;

  constructor(private requestService: DealroomsRequestService,
              private tokenService: TokenService,
              private notification: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
    super();
    this.userLoginForm = this.fb.group(LoginComponent.userLoginForm());
    const year = new Date().toDateString()
    this.year = year.split(' ')[3];
  }

  ngOnInit() {
  }

  public logUserIn() {
    this.resetLoaderAndMessage();
    DealroomsRequestService.entity = 'auth';

    const {username, password} = this.userLoginForm.value;
    const data = {
      email: username,
      password: password
    };

    this.requestService.create(data).subscribe((loginResponse) => {
      this.tokenService.setAuthUser(loginResponse.access_token);
      const user = loginResponse.user;
      Cache.set('AUTH_USER', user);
      this.getUserTasksById(user);
      //
      // console.log('Login respinse', loginResponse);
    }, (error) => {
      this.resetLoaderAndMessage();
      this.notification.error('Invalid credentials!', error);
    });
  }

  public showPass(name: string) {
    const passwordTag = document.getElementById('userpassword');
    if (name === 'show') {
      this.viewPassword = !this.viewPassword;
      passwordTag.setAttribute('type', 'text');
    } else {
      this.viewPassword = true;
      passwordTag.setAttribute('type', 'password');
    }
  }

  private getUserTasksById(user) {
    const {id, user_type, is_super_admin, first_login, user_ref} = user;
    const isFirstLogin = first_login.toString() === '1';
    const portalUrl = isFirstLogin ? '/change-password' : '/dashboard';
    this.notifyIfFirstLogin(isFirstLogin);

    DealroomsRequestService.entity = 'user';
    // if (user_type === 'customer') {
    //   Cache.set('USER_TASKS', []);
    //   return this.router.navigateByUrl(portalUrl);
    // }
    if (!is_super_admin) {
      Cache.set('USER_TASKS', []);
      return this.router.navigateByUrl(portalUrl);
    }
    this.requestService.getUserTasksById(user_ref).subscribe(
      (tasksResponse) => {
        const userRole = tasksResponse.data.role;
        let userTasks = [];
        if (is_super_admin) {
          userTasks = ['*'];
        } else if (userRole['enabled']) {
          userTasks = userRole.tasks;
        } else {
          this.notification.info(`Your role: "${userRole.name}" is disabled. Your profile is now basic.`);
        }

        // const userTasks = (is_super_admin) ? ['*'] : userRole.tasks;
        Cache.set('USER_TASKS', userTasks); // so you can use these tasks in your dashboard
        // console.log(userTasks);
        this.router.navigateByUrl(portalUrl);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred. Could not determine your permissions');
      });
  }

  private notifyIfFirstLogin(isFirstLogin) {
    if (isFirstLogin) {
      this.notification.info('Please change your default password before you proceed.');
      Cache.set('JUST_LOGGED_ON', 'TRUE');
    }

  }

  public goHome(){
    this.router.navigateByUrl('');
  }
}
