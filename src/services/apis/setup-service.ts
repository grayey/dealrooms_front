import {Injectable} from '@angular/core';
import {ApiHandlerService} from '../api-handler.service';
import {Observable} from 'rxjs';

@Injectable()
export class SharedService {

  constructor(private setupService: ApiHandlerService) {

  }

}
