// import {Directive, Input} from '@angular/core';
// import {AbstractControl, AsyncValidator, AsyncValidatorFn, NG_ASYNC_VALIDATORS, ValidationErrors} from '@angular/forms';
// import {Observable} from 'rxjs';
// import {UsersService} from '../../services/apis/users.service';
// import {map} from 'rxjs/operators';
//
// @Directive({
//   selector: '[appUniqueValue]',
//   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueValueDirective, multi: true}]
// })
//
// /**
//  * Use this class for Template driven forms as Directive like using appUniqueValue
//  */
// export class UniqueValueDirective implements AsyncValidator {
//
//   constructor(private _userService: UsersService) { }
//
//   validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
//    return this._userService.getAllUsers().pipe(
//       map( res => {
//         const user = res.filter((data) => data.emailAddress === c.value);
//         return user && user.length > 0 ? {'appUniqueValue': true} : null;
//       })
//     );
//   }
// }
//
// /**
//  * Custom validator for Reactive forms
//  * @param classAndMethod
//  * @param {string} uniqueField
//  * @returns {AsyncValidatorFn}
//  */
// export function uniqueValueValidator(classAndMethod: any, uniqueField: string): AsyncValidatorFn {
//   return (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
//     return classAndMethod.pipe(
//       map( res => {
//         const user = uFilter(res, uniqueField, c.value);
//         return user && user.length > 0 ? {'appUniqueValue': true} : null;
//       })
//     );
//   };
// }
//
// /**
//  * Function that performs the filter logic
//  * @param res
//  * @param ufield
//  * @param val
//  */
// function uFilter(res, ufield, val) {
//   return res.filter((data) => data[ufield] === val);
// }
//
