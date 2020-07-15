import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './admin/login/login.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {DeniedComponent} from './denied/denied.component';
import {AuthUrlGuardService as AuthGuard} from '../services/auth-url-guard.service';
import {RegisterComponent} from './register/register.component';
import {GalleryComponent} from './gallery/gallery.component';
import {HiwComponent} from './hiw/hiw.component';
import {AboutComponent} from './about/about.component';
import {PublicDealViewComponent} from './public-deal-view/public-deal-view.component';


export const APP_ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: RegisterComponent},
  {path: 'forgot-password', component: ChangePasswordComponent}, // forgive the switch in routes (:-:)
  {path: 'change-password', component: ForgotPasswordComponent}, // forgive the switch in routes (:-:)
  {path: '403-denied', component: DeniedComponent},
  {path: 'gallery', component: GalleryComponent},
  {path: 'how-it-works', component: HiwComponent},
  {path: 'about', component: AboutComponent},
  {path: 'view-deal/:slug', component: PublicDealViewComponent},
  {path: 'dashboard', loadChildren: 'src/app/admin/admin.module#AdminModule'}, //, canActivate: [AuthGuard]
  {path: 'panel', loadChildren: 'src/app/platform/platform.module#PlatformModule'} //, canActivate: [AuthGuard]
];

