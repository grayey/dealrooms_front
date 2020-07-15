import {UserService} from '../services/user.service';
import {DateFormatting} from './util';
import {environment} from '../environments/environment';
import {Cache} from './cache';
import {HttpHeaders} from '@angular/common/http';


/**
 *  Environment type configuration
 */


export class ApiConfig extends DateFormatting {


  static API_DEFAULT_URL = ApiConfig.CacheHostname();
  static API_KEY = environment.API_KEY;
  public headers = {headers: this.setHeaders()};
  public authToken: any;

  constructor(private myUserService: UserService) {
    super();
  }

  static CacheHostname() {
    return environment.API_URL.base;
  }

  /**
   * This is used to Set Headers on before request
   * @returns {Headers}
   */
  public setHeaders(): HttpHeaders {
    this.authToken = this.myUserService.getAuthUser();
    const headersConfig = new HttpHeaders();
    headersConfig.append('Content-Type', 'application/json');
    headersConfig.append('Accept', 'application/json');

    if (this.myUserService.isLoggedIn()) {
      headersConfig['Authorization'] = `${this.myUserService.getAuthUserToken()}`;
    }
    if (ApiConfig.API_KEY) {
      headersConfig['API-KEY'] = ApiConfig.API_KEY;
    }

    if (Cache.get('XHREF')) {
      headersConfig.append('API-KEY', Cache.get('XHREF'));
    }
    // if (ApiConfig.API_KEY) {
    //   headersConfig['API-KEY'] = ApiConfig.API_KEY;
    // }
    //console.log('HEADERS CONFIG ', headersConfig);
    return headersConfig;
  }

  public setFileHeaders(): HttpHeaders {
    this.authToken = this.myUserService.getAuthUser();
    const headersConfig = new HttpHeaders();
    headersConfig['Content-Type'] = 'application/octet-stream';
    headersConfig['Accept'] = 'application/octet-stream';
    // headersConfig.append('Accept', 'application/json');
    //
    if (this.myUserService.isLoggedIn()) {
      headersConfig['Authorization'] = `${this.myUserService.getAuthUserToken()}`;
    }
    if (ApiConfig.API_KEY) {
      headersConfig['API-KEY'] = ApiConfig.API_KEY;
    }
    // if (ApiConfig.API_KEY) {
    //   headersConfig['API-KEY'] = ApiConfig.API_KEY;
    // }

    return headersConfig;
  }


}

