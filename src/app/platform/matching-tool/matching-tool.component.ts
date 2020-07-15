import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cache} from '../../../utils/cache';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {NotificationService} from '../../../services/notification.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {SearchFilterService} from '../../../services/apis/search-filter.service';
import {Subscription} from 'rxjs';
import * as UI from '../../../shared/magic-methods/ui';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';


@Component({
  selector: 'app-matching-tool',
  templateUrl: './matching-tool.component.html',
  styleUrls: ['./matching-tool.component.css']
})
export class MatchingToolComponent extends MagicClasses implements OnInit, OnDestroy {

  public authUser: any;
  public userType: any;
  public matchType: string;
  public userIsDealRunnerOrOwner: boolean = false;
  public componentName = 'matching_tool';
  public allSectors: any[] = [];
  public allFundTypes: any[] = [];
  public allDeals: any[] = [];
  public allFinanciers: any[] = [];
  public viewedDealForActivity: any;
  private filterSubscription: Subscription;
  private interestedDealers: any = [];
  public filteredDataLength = 0;

  constructor(private dealroomsRequestService: DealroomsRequestService,
              private notification: NotificationService,
              private filterService: SearchFilterService,
              private router: Router) {
    super()
    this.authUser = Cache.get('AUTH_USER');
    this.userType = this.authUser['user_type'];
    this.userIsDealRunnerOrOwner = this.userType.includes('deal_');
    this.filterSubscription = filterService.changeEmitted$.subscribe(response => {
      // if (response === true) {
      //   UI.run('fraudReport');
      //   this.resetLoaderAndMessage();
      // } else if (response === false) {
      //   UI.run('fraudReport');
      //   this.resetLoaderAndMessage();
      // }

      // this.resetLoaderAndMessage();
    });
    this.getFilteredDealsOrFinanciers();
  }

  ngOnInit() {
    this.listSectors();
    this.listFundTypes();
  }

  ngOnDestroy() {

    this.filterSubscription.unsubscribe();
  }

  public toggleView(isCard) {
    this.isCard = isCard;
    if (!this.isCard) {
      UI.rerender(this.allDeals, 'filtered_deals_table', `Investment opportunities`);

    }

  }

  public viewDealActivities(deal) {
    deal['process_interests'] = true;


    this.dealroomsRequestService.viewDealInterests(deal).subscribe((dealInterestResponse) => {
        deal['process_interests'] = false;

        this.viewedDealForActivity = deal;
        this.interestedDealers = dealInterestResponse.data;
        this.triggerModal('open', 'view_activities_modal', 'static');
        UI.rerender(this.interestedDealers, 'interested_dealers_table', `Interests in ${deal.project_name}`);

      },
      (error) => {
        deal['process_interests'] = false;
        this.notification.error(this.processErrors(error));
      }
    )
    console.log('this veoejje', this.viewedDealForActivity)

  }

  public watchDeal(deal) {

    Swal.fire({
      title: `<span class="text-purple">Watch '${deal.project_name}'? <em>You are requesting access.</em></span>`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deal['process_watch'] = true;
        const watchData = {...deal};
        watchData['interested_user'] = this.authUser.id;
        watchData['tracker'] = `${this.authUser.user_ref.toLowerCase()}-${deal.slug}`;

        this.dealroomsRequestService.watchDeal(watchData).subscribe((watchResponse) => {
            deal['process_watch'] = false;
            this.notification.success(`You are now watching ${deal.project_name}`)
            this.reassignRow(deal, watchResponse.data);
            console.log('Active Deals', watchResponse);
          },
          (error) => {
            deal['process_watch'] = false;
            this.notification.error(this.processErrors(error));
          }
        )
      }
    });


  }

  public viewDeal(slug) {

    const url = 'panel/deals/' + slug;
    return this.router.navigateByUrl(url);
  }
  public viewFinancier(userRef) {

    const url = 'panel/profile-view/' + userRef;
    return this.router.navigateByUrl(url);
  }

  public investDeal(deal) {

    Swal.fire({
      title: `<span class="text-success">Register investment interest in '${deal.project_name}'? <em>You will receive notifications.</em></span>`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deal['process_invest'] = true;
        const investData = {...deal};
        investData['interested_user'] = this.authUser.id;
        investData['tracker'] = `${this.authUser.user_ref.toLowerCase()}-${deal.slug}`;

        this.dealroomsRequestService.investDeal(investData).subscribe((investResponse) => {
            deal['process_invest'] = false;
            this.notification.success(`Your investment interest in ${deal.project_name} is now logged`)
            this.reassignRow(deal, investResponse.data);
            console.log('Active Deals', investResponse);
          },
          (error) => {
            deal['process_invest'] = false;
            this.notification.error(this.processErrors(error));
          }
        )
      }
    });

  }

  public reassignRow(deal, data, update = true) {
    if (!update) {
      const deals = this.allDeals.filter((r, index) => {
        return r['id'] !== deal['id'];
      });
      setTimeout(() => {
        this.allDeals = this.deepCopy(deals);
      }, 100);
    }
    //console.log('logging deal and data ', deal, data);
    this.allDeals.forEach((rl, index) => {
      if (rl['id'] === deal['id']) {
        this.allDeals[index] = data;
      }
    });

    // UI.rerender(this.allDeals, 'deals_table', this.tableName);
    this.allDeals = this.filterDealActivites(this.allDeals);

  }

  private listSectors() {
    this.dealroomsRequestService.listSectors().subscribe((sectorsResponse) => {
        this.allSectors = sectorsResponse.data;
      },
      (error) => {
        this.notification.error(this.processErrors(error));
      }
    )
  }

  private listFundTypes() {
    this.dealroomsRequestService.listFundTypes().subscribe((fundTypesResponse) => {
        this.allFundTypes = fundTypesResponse.data;
      },
      (error) => {
        this.notification.error(this.processErrors(error));
      }
    )
  }

  private getFilteredDealsOrFinanciers() {
    const response = this.filterService.getFilteredData();
    response.subscribe(res => {
      if (res['whoCalled'] === this.componentName) {
        const allDealsOrFinanciers = res['data'];
        this.matchType = res['match_type'];
        if (this.matchType == 'deal') {
          this.allDeals = this.filterDealActivites(allDealsOrFinanciers['data']);
          this.filteredDataLength = this.allDeals.length;
          UI.rerender(this.allDeals, 'filtered_deals_table', `Investment opportunities`);
        }if(this.matchType == 'financier'){
          this.allFinanciers = allDealsOrFinanciers['data'];
          this.filteredDataLength = this.allFinanciers.length;
          console.log('Theis financiers', this.allFinanciers)

        }


      }


    });
  }

}
