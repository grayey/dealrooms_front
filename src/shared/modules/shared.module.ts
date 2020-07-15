import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ValidateHashModule} from './validate-hash.module';
import {NotificationModule} from './notification.module';
import {SwitchComponent} from '../components/switch/switch.component';
import {SearchFilterComponent} from '../components/search-filter/search-filter.component';
import {SearchFilterService} from '../../services/apis/search-filter.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidateHashModule,
    NotificationModule,
  ],
  declarations: [
    // CartSlotsComponent
    SwitchComponent,
    SearchFilterComponent
  ],
  exports: [
    SwitchComponent,

    SearchFilterComponent,
    // CartSlotsComponent
  ],
  providers: [
    SearchFilterService
  ]
})
export class SharedModule {
}
