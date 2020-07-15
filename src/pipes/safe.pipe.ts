import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}


@Pipe({
  name: 'allow'
})
export class AllowHtmlPipe implements PipeTransform {

  constructor(private allower: DomSanitizer) {
  }

  transform(html) {
    return this.allower.bypassSecurityTrustHtml(html);
  }

}
