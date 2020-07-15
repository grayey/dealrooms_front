import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DealsComponent} from './deals/deals.component';
import {RouterModule} from '@angular/router';
import {PLATFORM_ROUTING} from './platform.routing';
import {IndexComponent} from './index/index.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LayoutModule} from '../admin/layout/layout.module';
import {AngularFireModule} from '@angular/fire';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {environment} from '../../environments/environment';
import {GalleryComponent} from './gallery/gallery.component';
import {ProfilesComponent} from './profiles/profiles.component';
import {DealOwnerComponent} from './profiles/deal-owner/deal-owner.component';
import {RunnerFinancierComponent} from './profiles/runner-financier/runner-financier.component';
import {DealViewComponent} from './deal-view/deal-view.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {SharedModule} from '../../shared/modules/shared.module';
import { CreateDealComponent } from './create-deal/create-deal.component';
import { MatchingToolComponent } from './matching-tool/matching-tool.component';
import { OwnerComponent } from './profile-view/owner/owner.component';
import { RunFinanceComponent } from './profile-view/run-finance/run-finance.component';
import { TimelineComponent } from './timeline/timeline.component';
import { MessagesComponent } from './messages/messages.component';
import { DealUpdateComponent } from './deal-update/deal-update.component';


@NgModule({
  declarations: [DealsComponent, IndexComponent, GalleryComponent, ProfilesComponent, DealOwnerComponent, RunnerFinancierComponent, DealViewComponent, ProfileViewComponent, CreateDealComponent, MatchingToolComponent, OwnerComponent, RunFinanceComponent, TimelineComponent, MessagesComponent, DealUpdateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    RouterModule.forChild(PLATFORM_ROUTING)
  ]
})
export class PlatformModule {
}
