import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'summarize'
})
export class SummarizeNumberPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const maps = {
      '2': 'M',
      '3': 'B',
      '4': 'T',
      '5': 'Z'
    };
    if (value) {
      let newValue = value;
      const commas = value.split(',').length - 1;
      let suffix = '';
      if (commas > 1) {
        newValue = +newValue.split(',').join(''); //remove commas and numerize
        const power = 3 * commas;
        const exponent = 10 ** power;
        suffix = maps[commas.toString()];
        newValue = newValue / (exponent);
        newValue = newValue.toFixed(2);
        if (newValue.endsWith('.00')) {
          newValue = newValue.replace('.00', '');
        }
      }
      newValue = `${newValue.toString()}${suffix}`
      return newValue;
    }
    return value;
  }


}
