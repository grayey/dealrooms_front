import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ADMIN_ROUTES} from './admin.routing';
import {IndexComponent} from './index/index.component';
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LayoutModule} from './layout/layout.module';
import {RolesComponent} from './roles/roles.component';
import {TasksComponent} from './tasks/tasks.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {RoleViewComponent} from './roles/role-view/role-view.component';
import {UserViewComponent} from './users/user-view/user-view.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {AuthUrlGuardService} from '../../services/auth-url-guard.service';
import { SectorsComponent } from './sectors/sectors.component';
import { DealRunnersComponent } from './deal-runners/deal-runners.component';
import { DealOwnersComponent } from './deal-owners/deal-owners.component';
import { InvestorsComponent } from './investors/investors.component';
import { CompaniesComponent } from './companies/companies.component';
import { StartScaleComponent } from './start-scale/start-scale.component';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { FundTypesComponent } from './fund-types/fund-types.component';
import {PipeModule} from '../../shared/modules/pipe.module';


@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  declarations: [IndexComponent, UsersComponent, DashboardComponent, RolesComponent, TasksComponent, RoleViewComponent, UserViewComponent, NotificationsComponent, SectorsComponent, DealRunnersComponent, DealOwnersComponent, InvestorsComponent, CompaniesComponent, StartScaleComponent, CreateCompanyComponent, FundTypesComponent],
  exports: [LayoutModule, IndexComponent, UsersComponent]

})
export class AdminModule {

  constructor() {}

}
