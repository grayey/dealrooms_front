import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {APP_ROUTES} from './app.routing';
import {HomeComponent} from './home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {ApiHandlerService} from '../services/api-handler.service';
import {EventsService} from '../services/event.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TokenService} from '../services/token.service';
import {NotificationModule} from '../shared/modules/notification.module';
import {ValidationErrorService} from '../services/validation-error.service';
import {UserService} from '../services/user.service';
import {DealroomsRequestService} from '../services/apis/report.service';
import {LoginComponent} from './admin/login/login.component';

import {ApiInterceptorService} from '../services/api-interceptor.service';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {DeniedComponent} from './denied/denied.component';
import {AuthUrlGuardService} from '../services/auth-url-guard.service';
import {RegisterComponent} from './register/register.component';
import {LayoutModule} from './admin/layout/layout.module';
import {ScriptLoaderService} from '../assets/js/script-loader.service';
import { PublicOpportunitiesComponent } from './public-opportunities/public-opportunities.component';
import { HiwComponent } from './hiw/hiw.component';
import { AboutComponent } from './about/about.component';
import { GalleryComponent } from './gallery/gallery.component';
import { PublicDealViewComponent } from './public-deal-view/public-deal-view.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    DeniedComponent,
    RegisterComponent,
    PublicOpportunitiesComponent,
    HiwComponent,
    AboutComponent,
    GalleryComponent,
    PublicDealViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NotificationModule,
    LayoutModule,
    HttpClientModule,

    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true
    },
    AuthenticationService,
    ApiHandlerService,
    TokenService,
    EventsService,
    ValidationErrorService,
    UserService,
    AuthUrlGuardService,
    ScriptLoaderService,
    DealroomsRequestService]
  ,
  bootstrap: [AppComponent],
})

export class AppModule {
}
