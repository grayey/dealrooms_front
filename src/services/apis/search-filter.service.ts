import {EventEmitter, Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {Subject} from 'rxjs/Subject';
import {NotificationService} from '../notification.service';
import {TokenService} from '../token.service';
import {Observable} from 'rxjs';

@Injectable()
export class SearchFilterService {

  filterResponse: EventEmitter<any> = new EventEmitter();
  public getFilteredData = () => {
    return this.filterResponse;
  }
  private matchType: string;
  private emitChangeSource = new Subject<any>();     // Observable string sources
  public changeEmitted$ = this.emitChangeSource.asObservable(); // Observable string streams
  private searchEvent = (response, caller) => {
    const filterRes = {
      whoCalled: caller,
      data: response,
      match_type: this.matchType
    };
    const responseData = filterRes.data.data;
    let record = 'record';
    let recordsMessage = 'No';
    if (responseData) {
      record += (responseData.length <= 1) ? '' : 's';
      recordsMessage = (responseData.length === 0) ? recordsMessage : responseData.length;
    }

    this.Alert.success(`${recordsMessage} ${record} found!`);
    this.emitChange(false);
    this.filterResponse.emit(filterRes);
  }
  //
  private callBack = (url, name, parameters): Observable<any> => {
    const paramUrl = this.buildFilterParams(parameters);
    return this.apiHandler.get(`${url}?${paramUrl}`, parameters);
  }

  constructor(private apiHandler: ApiHandlerService,
              private Alert: NotificationService,
              private _tokenService: TokenService) {
  }

  emitChange(change: any) {
    this.emitChangeSource.next(change);  // Service message commands
  }

  public async search(url, params, caller) {
    this.matchType = params['match_type'];

    this.callBack(url, caller, params).subscribe((res) => {
        this.searchEvent(res, caller);
      }, (err) => {
        this.emitChange(false);
        this.Alert.error('An error occurred. Could not filter!', err);
      }
    );
  }

  private buildFilterParams(params): string {
    delete params['fromDate'];
    delete params['toDate'];
    delete params['format'];
    let i = 0;
    const paramLength = Object.keys(params).length;
    let paramUrl = '';
    for (const key in params) {
      i++;
      if (params[key]) {
        const ampersand = (i < paramLength) ? '&' : '';
        paramUrl += `${key}=${params[key]}${ampersand}`;
      }
    }
    return paramUrl;
  }

  //
  // public exportUrl = (urlCaller, params): any => {
  //     const paramUrl = this.buildFilterParams(params);
  //     const vim = this._tokenService.getAuthUserToken();
  //     // return this.apiHandler.sans_get(`http://197.255.63.146:9290/securitybreach/report/download?${paramUrl}&vim=${vim}`);
  //   return this.apiHandler.sans_getFile(`${urlCaller.url}/download?${paramUrl}&vim=${vim}`, urlCaller.name);
  // }
}

