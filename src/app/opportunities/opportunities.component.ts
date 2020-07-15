import {Component, OnInit} from '@angular/core';
import {MagicClasses} from '../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../services/apis/report.service';
import {Cache} from '../../utils/cache';
import {NotificationService} from '../../services/notification.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent extends MagicClasses implements OnInit {

  public allActiveDeals: any[] = [];
  public authUser: any;

  constructor(private dealsRequestService: DealroomsRequestService, private notification: NotificationService, private router: Router) {
    super();
    this.authUser = Cache.get('AUTH_USER');
  }

  ngOnInit() {
    // this.getActiveDeals();
    this.getActiveDealsByUserCategory();
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

        this.dealsRequestService.watchDeal(watchData).subscribe((watchResponse) => {
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

        this.dealsRequestService.investDeal(investData).subscribe((investResponse) => {
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
      const deals = this.allActiveDeals.filter((r, index) => {
        return r['id'] !== deal['id'];
      });
      setTimeout(() => {
        this.allActiveDeals = this.deepCopy(deals);
      }, 100);
    }
    //console.log('logging deal and data ', deal, data);
    this.allActiveDeals.forEach((rl, index) => {
      if (rl['id'] === deal['id']) {
        this.allActiveDeals[index] = data;
      }
    });

    // UI.rerender(this.allDeals, 'deals_table', this.tableName);
    this.allActiveDeals = this.filterDealActivites(this.allActiveDeals);

  }

  private getActiveDeals() {
    this.resetLoaderAndMessage();

    this.dealsRequestService.getActiveDeals().subscribe((dealsResponse) => {
        this.resetLoaderAndMessage();
        const allActiveDeals = dealsResponse.data;
        this.allActiveDeals = this.filterDealActivites(allActiveDeals).reverse();

        console.log('Active Deals', this.allActiveDeals);
      },
      (error) => {
        console.log('Error', error);
        this.resetLoaderAndMessage();

      }
    )
  }
  private getActiveDealsByUserCategory() {
    this.resetLoaderAndMessage();

    this.dealsRequestService.getActiveDealsByUserCategory(this.authUser['user_ref']).subscribe((dealsResponse) => {
        this.resetLoaderAndMessage();
        const allActiveDeals = dealsResponse.data;
        this.allActiveDeals = this.filterDealActivites(allActiveDeals).reverse();

        console.log('Active Deals', this.allActiveDeals);
      },
      (error) => {
        console.log('Error', error);
        this.resetLoaderAndMessage();

      }
    )
  }


}
