import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {ActivatedRoute, Router} from '@angular/router';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {NotificationService} from '../../../services/notification.service';
import {Cache} from '../../../utils/cache';
import Swal from 'sweetalert2';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-deal-view',
  templateUrl: './deal-view.component.html',
  styleUrls: ['./deal-view.component.css']
})
export class DealViewComponent extends MagicClasses implements OnInit, AfterViewInit {


  private static messageForm = () => {
    return {
      recipient_id: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      msg_body: ['', Validators.compose([Validators.required])],
    };
  }
  public dealSlug: any;
  public viewedDeal: any;
  public interestedDealers: any[] = [];
  public allDocuments: any[] = [];
  public allRecipients: any[] = [];
  public allMessages: any[] = [];
  public authUser: any;
  public dealLevelMsg: any;
  public viewedDealForActivity: any;
  public businessLogo = 'assets/images/small/img-3.jpg';
  public isVowel: boolean = false;
  public isOwner = false;
  public focusItem = false;
  public sending = false;
  public messageForm: FormGroup;
  public msgError = '';
  public userCanAccess = false;
  public userIsWaiting = false;
  public messageOpened = false;
  public finished = false;
  private mentions = [];

  constructor(private activeRoute: ActivatedRoute, private fb: FormBuilder, private dealroomsRequestService: DealroomsRequestService,
              private  notification: NotificationService, private router: Router
  ) {
    super();
    this.messageForm = this.fb.group(DealViewComponent.messageForm());
    this.activeRoute.params.subscribe((param) => {
      this.dealSlug = param['slug'];
    });
    this.authUser = Cache.get('AUTH_USER');

  }

  ngOnInit() {
    this.getDealBySlug();

  }

  ngAfterViewInit() {


  }

  grantUserAccess(event, deal, interestedDealer) {

    event.preventDefault();
    const toggleValue = event.target.value;
    const accessData = {
      id: interestedDealer['id'],
      access: toggleValue,
      closed_by: interestedDealer.user['id']
    };
    const stringValue = toggleValue.toString();
    const toggleMsg = stringValue === '1' ? 'Enable' : stringValue === '2' ? 'Disable' : 'Close';
    const swalClass = stringValue === '1' ? 'text-info' : stringValue === '2' ? 'text-danger' : 'text-success';
    const swalTitle = stringValue !== '3' ?
      `<span class="${swalClass}">You are about to <small><em>${toggleMsg} ${interestedDealer.user.full_name}'s</em></small>  access to <small><em>${deal.project_name}</em></small>!</span>`
      :
      `<span class="${swalClass}">You are about to <small><em>${toggleMsg}  <small><em>${deal.project_name}</em></small> with ${interestedDealer.user.full_name}</em></small>!</span>`

    ;
    Swal.fire({
      title: swalTitle,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        interestedDealer['toggling'] = stringValue === '1' ? 'enabling' : stringValue === '2' ? 'disabling' : 'closing';
        if (stringValue !== '3') {
          delete accessData.closed_by;
        }
        this.dealroomsRequestService.grantUserAccess(accessData).subscribe(
          (accessResponse) => {
            const accessResponseData = accessResponse.data;
            this.dealLevelMsg = accessResponse.levelMsg;

            const successMsg = stringValue !== '3' ?
              `${interestedDealer.user.full_name}'s access to ${deal.project_name} is now ${toggleMsg}d!` :
              `You have requested to close this deal with ${interestedDealer.user.full_name}.`;
            this.notification.success(successMsg);
            interestedDealer['toggling'] = null;

            this.interestedDealers.forEach((rl, index) => {
              if (rl['id'] === interestedDealer['id']) {
                this.interestedDealers[index] = accessResponseData;
              }
            });

            console.log('Access Response Data', accessResponseData);

            UI.rerender(this.interestedDealers, 'interested_dealers_table', `Interests in ${deal.project_name}`);
            // if(stringValue=='3'){
            //   this.viewedDeal['stage']['step'] = 4;
            //   this.viewedDeal['stage']['percentage'] = 80;
            // }
            // this.listDeal();
          },
          (error) => {
            // $(`#${event.target.id}`)[0].click();
            this.notification.error(this.processErrors(error));
            interestedDealer['toggling'] = null;
            //console.log('An Error Occurred', error);
          }
        );
      } else {
        const accessing = interestedDealer.accessing || '';
        $(`#${event.target.id}`).val(accessing); // set back old status
        interestedDealer['toggling'] = null;
      }
    });


  }

  getDealBySlug() {
    this.resetLoaderAndMessage();
    this.dealroomsRequestService.getDealById(this.dealSlug).subscribe(
      (dealResponse) => {
        this.resetLoaderAndMessage();

        console.log('aggsgsgsgsg', dealResponse)

        const viewedDeal = this.filterDealActivites([dealResponse.data])[0];
        this.viewedDeal = viewedDeal;
        if (this.authUser) {
          this.isOwner = this.authUser.id == this.viewedDeal.user.id;
        }

        this.checkUserAccess(viewedDeal);
        let allMessages = viewedDeal['messages'] || [];
        console.log('All Messajja', allMessages);
        allMessages = this.isOwner ? allMessages : allMessages.filter((msg) => { // the owner sees all messages but others see only theirs
          const recipientIds = msg['recipient_id'] || [];
          return recipientIds.includes(this.authUser['id'] || 0);
        });
        this.allMessages = allMessages.reverse(); // LIFO

        if (this.viewedDeal.user.business_logo) {
          this.businessLogo = this.viewedDeal.user.business_logo;
        }
        const interesteData = {id: this.viewedDeal.id};
        this.allDocuments = this.deepCopy(this.viewedDeal['documents']);
        if (this.allDocuments.length > 0) {
          UI.rerender(this.allDocuments, 'all_documents_table', `Documents for ${viewedDeal.project_name}`);

        }
        const vowels = ['a', 'e', 'i', 'o', 'u'];
        const sectorName = this.viewedDeal['sector']['name'];
        this.isVowel = vowels.includes(sectorName[0].toLowerCase());

        //GET Reipients for messages

        if (this.isOwner) {
          this.getAllRecipients();
        } else {
          const owner = this.viewedDeal['user'];
          const recp = owner['user_type'] == 'deal_owner' ? owner['dealowner_profile'] : owner['financier_runner_profile'];
          this.allRecipients.unshift(recp);
          // $('#recipients_list').select2();
          console.log('ownennenneenne', recp, owner)
        }


        //Get interests
        this.dealroomsRequestService.viewDealInterests(interesteData).subscribe(
          (dealInterestResponse) => {
            this.interestedDealers = this.formatInterestedDealers(dealInterestResponse.data || []);
            console.log('Interested Dealers', this.interestedDealers)
            UI.rerender(this.interestedDealers, 'interested_dealers_table', `Interests in ${viewedDeal.project_name}`);
          },
          (error) => {
            this.resetLoaderAndMessage();

          }
        );

      },
      (error) => {
        this.resetLoaderAndMessage();

        this.notification.error(this.processErrors(error));
      }
    )
  }

  public createMessage() {

    this.msgError = '';
    const msg_body = $(`#message_note`)['summernote']('code');
    if (!msg_body || msg_body.includes('Clear this message to start.')) {
      this.msgError = 'Please type your own message';

      return this.notification.error('Please type your own message');
    }
    let recipients = $('#recipients_list').val() || [];
    recipients = recipients['map']((r) => {
      return +r.split(':')[1].trim();
    });

    this.messageForm.patchValue({msg_body});

    this.sending = true;
    const messageData = this.messageForm.value;
    messageData['deal_id'] = this.viewedDeal['id'];
    messageData['recipient_id'] = JSON.stringify(recipients);
    messageData['sender_id'] = this.authUser['id'];


    this.dealroomsRequestService.createMessage(messageData).subscribe(
      (messageResponse) => {
        this.sending = false;
        this.allMessages.unshift(messageResponse.data);
        this.notification.success(`Message successfully sent`);
      },
      (error) => {
        this.sending = false;
        this.notification.error(this.processErrors(error));
      }
    )


  }

  public setMessage(message) {


    if (this.focusItem) {
      message['focused'] = !message['focused'];
    } else {
      message['focused'] = false;
    }
    message['viewing'] = !message['viewing'];
  }

  public reRoute(url) {
    return this.router.navigateByUrl(url);
  }

  public findFinancier(userRef) {

  }

  public viewDealActivities() {

  }

  public requestAccess(deal) {
    Swal.fire({
      title: `<span class="text-purple"><em>You are requesting access to '${deal.project_name}'?</em></span>`,
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
            this.notification.success(`You are awaiting access to ${deal.project_name}`);
            this.userIsWaiting = true;
            const watchedDeal = this.filterDealActivites([watchResponse.data])[0];
            this.interestedDealers.unshift(watchedDeal);
            console.log(watchedDeal)
            UI.rerender(this.interestedDealers, 'interested_dealers_table', `Interests in ${this.viewedDeal.project_name}`);
          },
          (error) => {
            deal['process_watch'] = false;
            this.notification.error(this.processErrors(error));
          }
        )
      }
    });


  }

  public openMessages() {
    if (this.messageOpened) {
      return;
    }
    this.messageOpened = true;
    $('.summernote').summernote({
      height: 300, // set editor height
      minHeight: null, // set minimum height of editor
      maxHeight: null, // set maximum height of editor
      focus: true,// set focus to editable area after initializing summernote
      hint: {
        mentions: this.mentions,
        match: /\B@(\w*)$/,
        search: (keyword, callback) => {
          callback($.grep(this.mentions, (item) => {
            return item.indexOf(keyword) == 0;
          }));
        },
        content: (item) => {
          return '@' + item;
        }
      }
    });
    $('.select2_list')['select2']();
  }

  public shakeClosureHands() {

    const closureData = {
      id: this.viewedDeal['id'],
      closed_by: this.authUser['id'],
      tracker: this.getActivityTracker(this.viewedDeal, this.authUser['id'])
    }


    this.viewedDeal.finishing = true;

    this.dealroomsRequestService.closeDeal(closureData).subscribe(
      (recipientResponse) => {

        this.viewedDeal.finishing = false;
        this.finished = true;
        this.notification.success(`Congrats. You have successfully closed this deal! <i class="fa fa-smile-beam"></i>`)
        this.triggerModal('close', 'close_deal_terms');
        this.reassignInterest(true);

      },
      error => {
        console.log('Could not find recipients');
        this.viewedDeal.finishing = false;
        this.notification.error(this.processErrors(error));
      }
    )

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
            deal['user_is_investing'] = true;

            console.log(this.interestedDealers[0], 'hehe')
            this.reassignInterest();


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

  private reassignInterest(closure = false) {
    this.interestedDealers.forEach((dealer) => {
      if (dealer['user']['id'] == this.authUser.id) {
        dealer['investing'] = true;
        dealer['closing'] = true;
        if (closure) {
          dealer['temp_closed'] = true;
        }

      }
    });
    if (closure) {
      this.viewedDeal['status'] = 2;
      this.viewedDeal['stage']['step'] = 5;
      this.viewedDeal['stage']['percentage'] = 100;
    }
    ;
  }

  private getAllRecipients() {

    this.dealroomsRequestService.getAllRecipients(this.dealSlug).subscribe(
      (recipientResponse) => {
        const allRecipients = recipientResponse.data;
        this.allRecipients = allRecipients.map((recipient) => {
          const user = recipient['user']['financier_runner_profile'];
          if (user) {
            this.mentions.push(user['company_name']);
          }
          return user;
        });


        console.log('messages', allRecipients, 'memmeme');
      },
      error => {
        console.log('Could not find recipients');
      }
    )
  }

  private checkUserAccess(deal) {
    const dealActivities = this.filterDealActivites([deal]);
    const accessors = dealActivities[0]['accessors'];
    const watchers = dealActivities[0]['watchers'];
    this.userCanAccess = this.authUser ? accessors.includes(this.authUser['id']) || this.isOwner || this.authUser['user_type'] == 'admin' : false;
    this.userIsWaiting = this.authUser ? watchers.includes(this.authUser['id']) && !accessors.includes(this.authUser['id']) : false
    console.log('ACESSSSS', accessors);
  }
}
