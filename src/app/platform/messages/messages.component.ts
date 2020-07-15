import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Cache} from '../../../utils/cache';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../services/notification.service';

declare const $: any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends MagicClasses implements OnInit, AfterViewInit {

  private static messageForm = () => {
    return {
      recipient_id: ['', Validators.compose([Validators.required])],
      subject: ['', Validators.compose([Validators.required])],
      msg_body: ['', Validators.compose([Validators.required])],
    };
  }
  public allMessages: any[] = [];
  public mentions: any[] = [];
  public allRecipients: any[] = [];
  public authUser: any;
  public messageForm: FormGroup;
  public allDealMessages: any[] = [];
  public allAppMessages: any[] = [];
  public sending: boolean = false;
  public msgError: string = '';
  public focusItem: boolean = false;
  userActivities:any;

  constructor(private  dealRoomsRequestService: DealroomsRequestService, private notification: NotificationService,
              private fb: FormBuilder) {
    super();
    this.messageForm = this.fb.group(MessagesComponent.messageForm());
    this.authUser = Cache.get('AUTH_USER');
  }

  ngOnInit() {
    this.listUser();
    this.getAppMessages();
  }

  ngAfterViewInit() {

    setTimeout(() => {
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
      $('.select2_list').select2();
    }, 100);


  }


  public async listUser() {
    if (this.authUser['user_type'] !== 'admin') {
      return;
    }
    DealroomsRequestService.entity = 'user';
    this.resetLoaderAndMessage();
    await  this.dealRoomsRequestService.list().subscribe(
      (userResponse) => {
        this.resetLoaderAndMessage();
        this.allRecipients = userResponse.data;

        console.log('Liste response', userResponse);
      },
      (error) => {
        this.notification.error('An error ocuured', error);
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
  }


  public setMessage(message) {


    if (this.focusItem) {
      message['focused'] = !message['focused'];
    } else {
      message['focused'] = false;
    }
    message['viewing'] = !message['viewing'];
  }

  public async getAppMessages() {
    this.resetLoaderAndMessage();
    const userId = this.authUser['user_type'] == 'admin' ? null : this.authUser['id'];
    await  this.dealRoomsRequestService.getAllMessages(userId).subscribe(
      (appMessagesResponse) => {
        this.resetLoaderAndMessage();
        const allMessages = appMessagesResponse.data;
        if (this.authUser['user_type'] == 'admin') {
          this.allAppMessages = allMessages;
        }else{
          this.allAppMessages = allMessages['app_msgs'];
        }
        console.log('app messaages', this.allAppMessages)

        // this.allAppMessages = appMessagesResponse.data;
        // this.allDealMessages = appMessagesResponse.data;
      },
      (error) => {
        this.notification.error(this.processErrors(error));
        this.resetLoaderAndMessage();
        console.log('An Error Occurred', error);
      }
    );
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
      return r.split(':')[1].trim();
    });
    if (recipients.includes(`'all'`)) {
      recipients = this.allRecipients.map((rcp) => {
        return rcp.id;
      })
    }
    console.log(recipients, 'recipients')


    this.messageForm.patchValue({msg_body});

    this.sending = true;
    const messageData = this.messageForm.value;
    messageData['recipients'] = recipients;
    delete messageData['recipient_id'];


    this.dealRoomsRequestService.createAppMessage(messageData).subscribe(
      (messageResponse) => {
        this.sending = false;
        this.ngOnInit();
        this.notification.success(`Message successfully sent`);
      },
      (error) => {
        this.sending = false;
        this.notification.error(this.processErrors(error));
      }
    )


  }

}
