import {Component, OnInit} from '@angular/core';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {NotificationService} from '../../../services/notification.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {UserHasTask} from '../../../shared/magic-methods/resolveUserTasks';
import {Cache} from '../../../utils/cache';
import * as UI from '../../../shared/magic-methods/ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends MagicClasses implements OnInit {

  public dashboardData: any;
  public allUsers: any[] = [];
  public ongoingDeals: any[] = [];
  public defaultTitle = 'Overall';
  public userCanViewAll = false;
  public authUser: any;
  public userType: any;
  public userIsDealRunnerOrOwner: boolean = false;

  constructor(private requestService: DealroomsRequestService,
              private notification: NotificationService) {
    super();
    const userCanView = new UserHasTask('overall_dashboard');
    this.userCanViewAll = userCanView.hasTask();
    this.authUser = Cache.get('AUTH_USER');
    this.userType = this.authUser['user_type'];
    this.userIsDealRunnerOrOwner = this.userType.includes('deal_');
  }

  ngOnInit() {

    if (this.userCanViewAll) {
      this.getOverAllDashboardData();
      this.getAllUsers();
    } else {

      const userId = this.authUser ['id'];
      this.getDashboardByUser(userId);
    }


  }

  public getOverAllDashboardData() {
    this.removeChartElements();
    this.resetLoaderAndMessage();
    this.requestService.getOverallDashboard().subscribe(
      (dashboardResponse) => {
        this.resetLoaderAndMessage();
        this.dashboardData = dashboardResponse;
        const ongoingDeals = this.dashboardData['ongoing_deals'];
        this.ongoingDeals = this.filterDealActivites(ongoingDeals).reverse();
        UI.run(this.ongoingDeals,'dashboard_table', `${this.userType.split('_').join(' ')} Dashboard`)

        // this.plotDashboardData(this.dashboardData);
        console.log('Dashboard Response', dashboardResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('Could not fetch dashboard data');
      }
    );
  }

  public getDashboardByUser(id) {
    if (!parseInt(id)) {
      return this.getOverAllDashboardData();
    }
    this.removeChartElements();
    this.resetLoaderAndMessage();
    this.requestService.getDashboardByUer(id).subscribe(
      (dashboardResponse) => {
        this.resetLoaderAndMessage();
        this.dashboardData = dashboardResponse;
        const ongoingDeals = this.dashboardData['ongoing_deals'];
        this.ongoingDeals = this.filterDealActivites(ongoingDeals).reverse();

        // this.plotDashboardData(this.dashboardData);
        UI.run(this.ongoingDeals,'dashboard_table', `${this.userType.split('_').join(' ')} Dashboard`)
        console.log('Dashboard Responsess', dashboardResponse, this.ongoingDeals );
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('Could not fetch dashboard data');
      }
    );
  }

  public toggleDeal(event, deal){

  }

  public viewDealActivities(deal){

  }

  private plotDashboardData(data) {
    this.createChartElements();
    const graphData = data.graphData;
    const dashboardObject = {};
    graphData.forEach((datum) => {
      const key = Object.keys(datum)[0];
      dashboardObject[key] = datum[key];
    });
  }

  private removeChartElements() {
    const ChartIds = [
      'morris-bar-example'
    ];
    ChartIds.forEach(chartId => {
      const chartElement = document.getElementById(chartId);
      if (chartElement) {
        chartElement.parentNode.removeChild(chartElement);
      }
    });


  }

  private createChartElements() {

    const morrisDiv = $('<div></div>', {id: 'morris-bar-example', class: 'dash-chart'});
    $('#chiMorrisBox').append(morrisDiv);


  }

  private getAllUsers() {
    DealroomsRequestService.entity = 'user';
    this.requestService.list().subscribe((usersResponse) => {
      this.allUsers = usersResponse.data;
      // console.log('All Users', usersResponse);
    });
  }
}
