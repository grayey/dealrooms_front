import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class EmitPaymentService {
  private emitChangeSource = new Subject<any>();     // Observable string sources
  public changeEmitted$ = this.emitChangeSource.asObservable(); // Observable string streams
  public emitChange(change: any) {
    this.emitChangeSource.next(change);  // Service message commands
  }
}
