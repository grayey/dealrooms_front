import {Routes} from '@angular/router';
import {IndexComponent} from './index/index.component';
import {UsersComponent} from './users/users.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RolesComponent} from './roles/roles.component';
import {TasksComponent} from './tasks/tasks.component';
import {RoleViewComponent} from './roles/role-view/role-view.component';
import {UserViewComponent} from './users/user-view/user-view.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {AuthUrlGuardService as AuthGuard} from '../../services/auth-url-guard.service';
import {SectorsComponent} from './sectors/sectors.component';
import {DealRunnersComponent} from './deal-runners/deal-runners.component';
import {DealOwnersComponent} from './deal-owners/deal-owners.component';
import {InvestorsComponent} from './investors/investors.component';
import {CompaniesComponent} from './companies/companies.component';
import {StartScaleComponent} from './start-scale/start-scale.component';
import {CreateCompanyComponent} from './create-company/create-company.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: '', component: IndexComponent, children: [
      {
        path: '', component: DashboardComponent
      },
      {
        path: 'users', component: UsersComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_users'
        }
      },
      {
        path: 'user-profile', component: UserViewComponent
      },
      {
        path: 'people.deal-runners', component: DealRunnersComponent
      },
      {
        path: 'people.deal-owners', component: DealOwnersComponent
      },
      {
        path: 'people.financiers', component: InvestorsComponent
      },
      {
        path: 'companies.corporates', component: CompaniesComponent
      },
      {
        path: 'companies.start-scale', component: StartScaleComponent
      },
      {
        path: 'companies.create', component: CreateCompanyComponent
      },

      {
        path: 'users/:id', component: UserViewComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_users'
        }
      },

      {
        path: 'roles', component: RolesComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_roles'
        }
      },
      {
        path: 'roles/:id', component: RoleViewComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_roles'
        }
      },
      {
        path: 'tasks', component: TasksComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_tasks'
        }

      },
      {
        path: 'sectors', component: SectorsComponent, canActivate: [AuthGuard],
        data: {
          task: 'list_sectors'
        }

      },
      {
        path: 'my-notifications', component: NotificationsComponent
      },
    ]
  }
];
