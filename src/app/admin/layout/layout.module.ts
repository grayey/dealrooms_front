import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {OpportunitiesComponent} from '../../opportunities/opportunities.component';
import {PipeModule} from '../../../shared/modules/pipe.module';
import {FrontHeaderComponent} from './front-header/front-header.component';
import {FrontFooterComponent} from './front-footer/front-footer.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipeModule,
  ],
  declarations: [FooterComponent, HeaderComponent, OpportunitiesComponent, FrontHeaderComponent, FrontFooterComponent],
  exports: [RouterModule, FooterComponent, HeaderComponent, FrontFooterComponent, FrontHeaderComponent, OpportunitiesComponent, PipeModule],
})
export class LayoutModule {
}
