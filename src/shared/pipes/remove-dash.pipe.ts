import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'removeDash'
})
export class RemoveDashPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return value.split('-').join(' ');

    }
    return value;
  }

}
