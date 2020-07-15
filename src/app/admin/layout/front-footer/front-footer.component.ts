import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ScriptLoaderService} from '../../../../assets/js/script-loader.service';
// import {ScriptLoaderService} from '../../../../services/script-loader.service';

@Component({
  selector: 'app-front-footer',
  templateUrl: './front-footer.component.html',
  styleUrls: ['./front-footer.component.css']
})
export class FrontFooterComponent implements OnInit, AfterViewInit {

  constructor(private scriptLoader: ScriptLoaderService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.scriptLoader.loadScripts('app-front-footer', [
      '../../../../assets/front/newdeal/plugins/revolution/js/jquery.themepunch.revolution.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/jquery.themepunch.tools.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.actions.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.carousel.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.kenburn.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.layeranimation.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.migration.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.navigation.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.parallax.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.slideanims.min.js',
      '../../../../assets/front/newdeal/plugins/revolution/js/extensions/revolution.extension.video.min.js',
      '../../../../assets/front/newdeal/js/main-slider-script.js',
      '../../../../assets/front/newdeal/js/jquery.fancybox.js',
      '../../../../assets/front/newdeal/js/owl.js',
      '../../../../assets/front/newdeal/js/wow.js',
      '../../../../assets/front/newdeal/js/appear.js',
      '../../../../assets/front/newdeal/js/script.js',

    ], false);
  }
}
