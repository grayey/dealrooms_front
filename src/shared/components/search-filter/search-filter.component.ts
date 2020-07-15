import {Component, Input, OnChanges} from '@angular/core';
import {SearchFilterService} from '../../../services/apis/search-filter.service';
import {MagicClasses} from '../../magic-methods/classes';

// import {link} from 'fs';
declare const $: any;

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent extends MagicClasses implements OnChanges {

  @Input() categoryList: any[];
  @Input() sectorList: any[];
  @Input() fundTypeList: any[];
  @Input() component: string;
  @Input() userType: string;
  public loadingFilter: boolean;
  public loadExport: boolean = false;
  public templateUrl;
  public dateParams = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate()
  };
  //
  public startDate = {year: this.dateParams.year, month: this.dateParams.month, day: this.dateParams.day};
  public search = (dataValue: any) => {

    this.resetLoaderAndMessage();
    const value = JSON.parse(JSON.stringify(dataValue));
    if (!value['match_type']) {
      if (this.userType.includes('deal')) {
        value['match_type'] = 'financier';
      }
      if (this.userType.includes('financier')) {
        value['match_type'] = 'deal';
      }
    }

    console.log('Search Value', value);
    // const from = (value.fromDate) ? `${value.fromDate.year}-${value.fromDate.month}-${value.fromDate.day}` : '';
    // const to = (value.toDate) ? `${value.toDate.year}-${value.toDate.month}-${value.toDate.day}` : '';
    // value['from'] = from;
    // value['to'] = to;
    // send search parameter to the search helper function
    this.searchHelper(value);
  }

  constructor(private _filterService: SearchFilterService) {
    super();
    _filterService.changeEmitted$.subscribe(response => {
      if (response === true) {
        this.loadingFilter = true;
      } else if (response === false) {
        this.loadingFilter = false;

      }
    });

  }

  //
  // private endPointUrl = {
  //   fraud: 'fraud',
  //   securityBreach: 'securitybreach',
  //   cae: {
  //     base: environment.API_URL.base_cae,
  //     robbery: 'cae/report/robbery',
  //     staff_dismissal: 'cae/report/staffdismissaltermination',
  //     fraud_fogery: 'cae/report/fraud'
  //   },
  //   audit: 'audit'
  // };
  //
  // private exportUrl = {
  //   fraud: 'fraud/report',
  //   securityBreach: 'securitybreach/report',
  //   cae: {
  //     base: environment.API_URL.base_cae,
  //     robbery: 'cae/report/robbery',
  //     staff_dismissal: 'cae/report/staffdismissaltermination',
  //     fraud_fogery: 'cae/report/fraud'
  //   },
  //   audit: 'audit/report'
  // }
  //
  // public today: NgbDateStruct;
  // public downloadBtn = false;
  //
  // /**
  //  * @Desc enable format download btn
  //  * @param val
  //  */
  // public enableBtn = (val: string): void => {
  //   if (val === '') {
  //     this.downloadBtn = !this.downloadBtn;
  //     return;
  //   } else {
  //     this.downloadBtn = true;
  //   }
  //
  // }

  //
  /**
   * @Desc search method
   * @param value
   */

  ngOnChanges() {
    if (this.sectorList && this.sectorList.length > 0) {
      // $('#sector_seacrh_list').select2();
    }
  }

  /**
   * @Desc Search helper function
   * @param searchParams
   */
  private async searchHelper(searchParams: any) {
    const url = 'search';

    this._filterService.emitChange(true);
    // console.log(searchParams);
    switch (this.component) {
      // case 'matching_tool':
      //   url += 'matching_tool';
      //   break;
      // case 'opportunities':
      //   url += `opportunities`;
      //   break;
      //
      // default:
      //   return url;
    }
    this._filterService.search(url, searchParams, this.component);

  }

  //
  // /**
  //  * @Desc download Filter params
  //  * @param filterValue
  //  */
  // public download = (filterValue: any) => {
  //   const value = JSON.parse(JSON.stringify(filterValue));
  //   const from = (value.fromDate) ? `${value.fromDate.year}-${value.fromDate.month}-${value.fromDate.day}` : '';
  //   const to = (value.toDate) ? `${value.toDate.year}-${value.toDate.month}-${value.toDate.day}` : '';
  //   value['from'] = from;
  //   value['to'] = to;
  //   value['downloadType'] = value.format;
  //   console.log(value);
  //   this.getExportLink(value);
  // }
  //
  // /**
  //  *
  //  * @param params
  //  */
  // private getExportLink = (params) => {
  //   const urlCaller = {
  //     name: '',
  //     url: ''
  //   }
  //   switch (this.component) {
  //     case 'fraud_report':
  //       urlCaller.name = 'fraud';
  //       urlCaller.url = this.exportUrl.fraud;
  //       break;
  //     case 'security_breach':
  //       urlCaller.url = this.exportUrl.securityBreach;
  //       break;
  //     case 'cae_robbery':
  //       urlCaller.name = 'cae';
  //       urlCaller.url = this.exportUrl.cae.robbery;
  //       break;
  //     case 'cae_fraud':
  //       urlCaller.name = 'cae';
  //       urlCaller.url = this.exportUrl.cae.fraud_fogery;
  //       break;
  //     case 'cae_dismissal':
  //       urlCaller.name = 'cae';
  //       urlCaller.url = this.exportUrl.cae.staff_dismissal;
  //       break;
  //     case 'audit':
  //       urlCaller.url = this.exportUrl.audit;
  //       urlCaller.name = 'audit';
  //       break;
  //   }
  //   this._filterService.exportUrl(urlCaller, params).subscribe(
  //     (res) => {
  //       this.templateUrl = res;
  //       this.loadExport = true
  //       setTimeout(() => {
  //         $('#exportLink')[0].click();
  //       }, 2);
  //       setTimeout(()=>{
  //           this.loadExport = false;
  //       },3000);
  //
  //     },
  //     (error) => {
  //       console.log('File download error', error);
  //     }
  //   );
  // }
}
