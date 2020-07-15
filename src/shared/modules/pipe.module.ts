/**
 * Created by K-DEVS on 29/07/2017.
 */
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {ReminderPipe} from '../pipes/reminderPipe';
import {FormatNumberPipe} from '../pipes/format-number';
import {RemoveUnderscorePipe} from '../pipes/remove-underscore.pipe';
import {PluckOutSelectedPipe} from '../pipes/pluck-out-selected-pipe';
import {UcwordsPipe} from '../pipes/ucwords.pipe';
import {RemoveDashPipe} from '../pipes/remove-dash.pipe';
import {FirstLetterTopUpperCase} from '../pipes/firstLetterTopUpperCase.pipe';
import {AllowHtmlPipe, SafePipe} from '../../pipes/safe.pipe';
import {SummarizeNumberPipe} from '../pipes/summarize-number.pipe';


@NgModule({
  imports: [CommonModule],
  declarations: [ReminderPipe, SummarizeNumberPipe, AllowHtmlPipe, SafePipe, FormatNumberPipe, RemoveUnderscorePipe, PluckOutSelectedPipe, UcwordsPipe, RemoveDashPipe, FirstLetterTopUpperCase],
  exports: [ReminderPipe, SummarizeNumberPipe, FormatNumberPipe, AllowHtmlPipe, SafePipe, RemoveUnderscorePipe, PluckOutSelectedPipe, UcwordsPipe, RemoveDashPipe, FirstLetterTopUpperCase],
  providers: [DatePipe]
})

export class PipeModule {

  static forRoot() {
    return {
      ngModule: PipeModule,
      providers: [],
    };
  }
}
