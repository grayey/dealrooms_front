import {Routes} from '@angular/router';
import {DealsComponent} from './deals/deals.component';
import {IndexComponent} from './index/index.component';
import {GalleryComponent} from './gallery/gallery.component';
import {ProfilesComponent} from './profiles/profiles.component';
import {ProfileViewComponent} from './profile-view/profile-view.component';
import {DealViewComponent} from './deal-view/deal-view.component';
import {CreateDealComponent} from './create-deal/create-deal.component';
import {MatchingToolComponent} from './matching-tool/matching-tool.component';
import {MessagesComponent} from './messages/messages.component';
import {TimelineComponent} from './timeline/timeline.component';
import {DealUpdateComponent} from './deal-update/deal-update.component';


export const PLATFORM_ROUTING: Routes = [

  {
    path: '', component: IndexComponent, children: [
      {path: 'deals', component: DealsComponent},
      {path: 'deals/create', component: CreateDealComponent},
      {path: 'deals/update/:slug', component: DealUpdateComponent},
      {path: 'deals/:slug', component: DealViewComponent},
      {path: 'opportunities', component: GalleryComponent},
      {path: 'matching-tool', component: MatchingToolComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'timeline', component: TimelineComponent},
      {path: 'profile-view/:slug', component: ProfileViewComponent},
      {path: 'profile-update/:slug', component: ProfilesComponent},

    ]
  },

]
