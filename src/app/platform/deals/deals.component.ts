import {Component, OnInit} from '@angular/core';
import * as UI from '../../../shared/magic-methods/ui';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DealroomsRequestService} from '../../../services/apis/report.service';
import {MagicClasses} from '../../../shared/magic-methods/classes';
import Swal from 'sweetalert2';
import {finalize} from 'rxjs/operators';
import {AngularFireStorage} from '@angular/fire/storage';
import {NotificationService} from '../../../services/notification.service';
import {UserHasTask} from '../../../shared/magic-methods/resolveUserTasks';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Cache} from '../../../utils/cache';
import {Router} from '@angular/router';


declare const $: any;

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent extends MagicClasses implements OnInit {


  private static createDealForm = () => {
    return {
      project_name: ['', Validators.compose([Validators.required])],
      project_type: ['', Validators.compose([Validators.required])],
      sector_id: ['', Validators.compose([Validators.required])],
      fund_type_id: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
      funding_amount: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      website: ['', Validators.compose([])], // is this nullable
      telephone: ['', Validators.compose([Validators.required])],
      problem_situation: ['', Validators.compose([])],
      business_model: ['', Validators.compose([])],
      operating_model: ['', Validators.compose([])],
      current_status_achievements: ['', Validators.compose([])],
      future_plans: ['', Validators.compose([])],
      competition: ['', Validators.compose([])],
      target_market: ['', Validators.compose([])],
      revenue_streams: ['', Validators.compose([])],
      financials: ['', Validators.compose([])],
      fund_usage: ['', Validators.compose([])],
      fund_infused_current_indicative: ['', Validators.compose([])],
      ownership_structure: ['', Validators.compose([])],
      team: ['', Validators.compose([])],
      key_challenges: ['', Validators.compose([])],

      // $table->longText('documents')->nullable();

    };
  };
  private static updateDealForm = () => {
    return {
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],

    };
  };
  public createDealForm: FormGroup;
  public updateDealForm: FormGroup;
  public allDeals: any[] = [];
  public allFundTypes: any[] = [];
  public allSectors: any[] = [];
  public interestedDealers: any[] = [];
  public dealToEdit: any;
  public userActivities = {...this.staffActivities};
  public uploadInProgress = false;
  public percentageUpload = '0%';
  public imageUrl: string | ArrayBuffer | null;
  public manualPaymentFileUrl: any;
  public isBlankPhoto = true;
  public selectedPassportFile: any;
  public selectedPaymentFile: any;
  public manualPaymentFileName;
  public fileName: any;
  public allDocuments: any[] = [];
  public allDocsToUpload: any[] = [];
  public openingOverlay = false;
  public viewedDealForActivity: any;
  public dealLevelMsg: any;
  public userType: any;
  public userIsDealRunnerOrOwner: boolean = false;
  public authUser: any;
  public selectedSector: any;
  public selectedFundType: any;
  public isVowel: boolean = false;
  private tableName = 'Deals';
  private fileType: string;
  private selectedDocumentFile: any;

  constructor(private fb: FormBuilder,
              private dealroomsRequestService: DealroomsRequestService,
              private notification: NotificationService,
              private storage: AngularFireStorage,
              private sanitizer: DomSanitizer,
              private router: Router) {
    super();
    DealroomsRequestService.entity = 'deal';
    this.createDealForm = this.fb.group(DealsComponent.createDealForm());
    this.updateDealForm = this.fb.group(DealsComponent.updateDealForm());
    const userTasks = new UserHasTask('list_deals');
    const screenActivities = userTasks.userScreenActivities(['list_deals', 'create_deal', 'delete_deal', 'toggle_deal', 'update_deal']);
    this.userActivities = {
      create: screenActivities.includes('create'),
      _delete: screenActivities.includes('delete'),
      toggle: screenActivities.includes('toggle'),
      update: screenActivities.includes('update')
    };
    this.authUser = Cache.get('AUTH_USER');
    this.userType = this.authUser['user_type'];
    this.userIsDealRunnerOrOwner = this.userType.includes('deal_');
  }

  ngOnInit() {
    if (this.userType !== 'financier') {
      this.listDeal();
    } else {
      this.listInvestorDeals();
    }

    this.listFundTypes();
    this.listSectors();
    // this.getAllDocuments();

  }


  public async listDeal() {
    this.resetLoaderAndMessage();
    const userId = this.userType.includes('admin') ? null : this.authUser['id'];
    await  this.dealroomsRequestService.list(userId).subscribe(
      (dealResponse) => {
        this.resetLoaderAndMessage();
        const allDeals = dealResponse.data
        this.allDeals = this.filterDealActivites(allDeals).reverse();
        if (this.allDeals.length > 0) {
          UI.rerender(this.allDeals, 'deals_table', this.tableName);
        }
        //console.log('Liste response', dealResponse);
      },
      (error) => {
        this.notification.error(this.processErrors(error));
        this.resetLoaderAndMessage();
        //console.log('An Error Occurred', error);
      },
      () => {
        setTimeout(() => {
          this.dealLevelMsg = null;
        }, 3000);
      }
    );
  }

  public async listInvestorDeals() {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequestService.listInvestorDeals(this.authUser['id']).subscribe(
      (dealResponse) => {
        this.resetLoaderAndMessage();
        const allDeals = dealResponse.data
        this.allDeals = this.filterDealActivites(allDeals).reverse();
        if (this.allDeals.length > 0) {
          UI.rerender(this.allDeals, 'deals_table', this.tableName);
        }
        //console.log('Liste response', dealResponse);
      },
      (error) => {
        this.notification.error(this.processErrors(error));
        this.resetLoaderAndMessage();
        //console.log('An Error Occurred', error);
      },
      () => {
        setTimeout(() => {
          this.dealLevelMsg = null;
        }, 3000);
      }
    );
  }


  public viewDealActivities(deal) {
    deal['process_interests'] = true;


    this.dealroomsRequestService.viewDealInterests(deal).subscribe((dealInterestResponse) => {
        deal['process_interests'] = false;

        this.viewedDealForActivity = deal;
        this.interestedDealers = this.formatInterestedDealers(dealInterestResponse.data || []);

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

  public createDeal() {
    this.resetLoaderAndMessage();

    this.setFormValues();
    setTimeout(() => {
      const dealData = this.createDealForm.value;
      dealData['documents'] = [...this.allDocuments];
      dealData['user_id'] = this.authUser['id'];
      this.storeDeal(dealData);
    }, 1000);


    //wait for appendment
  }


  public setFundType(event) {

    let fundType = event.target.value;
    if (!fundType) {
      return;
    }
    fundType = JSON.parse(fundType);
    this.selectedFundType = fundType;


  }

  public findFinancier(ref) {
    const url = `/panel/profile-view/${ref}`;
    this.triggerModal('close', 'view_activities_modal');
    this.router.navigateByUrl(url);
  }

  public setSector(event) {
    let sector = event.target.value;
    if (!sector) {
      return;
    }
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    sector = JSON.parse(sector);
    this.selectedSector = sector;
    const name = this.selectedSector['name'];
    this.isVowel = vowels.includes(name[0].toLowerCase());


  }

  public async updateDeal() {
    this.resetLoaderAndMessage();
    await  this.dealroomsRequestService.update(this.dealToEdit['id'], this.updateDealForm.value).subscribe(
      (dealResponse) => {

        this.resetLoaderAndMessage();
        this.triggerModal('close', 'update_deal_modal');
        this.reassignRow(this.dealToEdit, dealResponse.data);
        this.notification.success(`${this.dealToEdit.name}  updated!`);

      },
      (error) => {

        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  public async toggleDeal(event, deal) {

    event.preventDefault();
    const toggleValue = event.target.value;
    const dealData = {...deal};
    dealData['status'] = toggleValue;
    const stringValue = toggleValue.toString();
    const toggleMsg = stringValue === '0' ? 'Deactivate' : stringValue === '1' ? 'Open' : 'Close';
    const swalClass = stringValue === '0' ? 'text-danger' : stringValue === '1' ? 'text-info ' : 'text-success';
    Swal.fire({
      title: `<span class="${swalClass}">You are about to ${toggleMsg} ${deal.project_name}!</span>`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deal['toggling'] = stringValue === '0' ? 'Deactivating' : stringValue === '1' ? 'opening' : 'closing';
        this.dealroomsRequestService.toggleEntity(dealData).subscribe(
          (dealResponse) => {
            this.reassignRow(deal, dealResponse.data);
            const suffix = stringValue === '1' ? 'ed' : 'd';
            this.notification.success(`${deal.project_name} successfully ${toggleMsg}${suffix}`);
            deal['toggling'] = null;

          },
          (error) => {
            // $(`#${event.target.id}`)[0].click();
            this.notification.error(this.processErrors(error));
            deal['toggling'] = null;
            //console.log('An Error Occurred', error);
          }
        );
      } else {
        $(`#${event.target.id}`).val(deal.status); // set back old status
        deal['toggling'] = null;
      }
    });


  }


 public async grantUserAccess(event, deal, interestedDealer) {

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

  // public async grantUserAccess(event, deal, interestedDealer) {
  //
  //   event.preventDefault();
  //   const toggleValue = event.target.value;
  //   const accessData = {
  //     id: interestedDealer['id'],
  //     access: toggleValue
  //   };
  //   const stringValue = toggleValue.toString();
  //   const toggleMsg = stringValue === '1' ? 'Enable' : 'Disable';
  //   const swalClass = stringValue === '1' ? 'text-success' : 'text-danger';
  //   Swal.fire({
  //     title: `<span class="${swalClass}">You are about to <small><em>${toggleMsg} ${interestedDealer.user.full_name}'s</em></small>  access to <small><em>${deal.project_name}</em></small>!</span>`,
  //     text: 'Continue?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.value) {
  //       interestedDealer['toggling'] = stringValue === '1' ? 'enabling' : 'disabling';
  //       this.dealroomsRequestService.grantUserAccess(accessData).subscribe(
  //         (accessResponse) => {
  //           const accessResponseData = accessResponse.data;
  //           this.dealLevelMsg = accessResponse.levelMsg;
  //
  //           this.notification.success(`${interestedDealer.user.full_name}'s access to ${deal.project_name} is now ${toggleMsg}d!`);
  //           interestedDealer['toggling'] = null;
  //           this.interestedDealers.forEach((rl, index) => {
  //             if (rl['id'] === interestedDealer['id']) {
  //               this.interestedDealers[index] = accessResponseData;
  //             }
  //           });
  //           UI.rerender(this.interestedDealers, 'interested_dealers_table', `Interests in ${deal.project_name}`);
  //           this.listDeal();
  //
  //         },
  //         (error) => {
  //           // $(`#${event.target.id}`)[0].click();
  //           this.notification.error(this.processErrors(error));
  //           interestedDealer['toggling'] = null;
  //           //console.log('An Error Occurred', error);
  //         }
  //       );
  //     } else {
  //       const accessing = interestedDealer.accessing || '';
  //       $(`#${event.target.id}`).val(accessing); // set back old status
  //       interestedDealer['toggling'] = null;
  //     }
  //   });
  //
  //
  // }

  public async deleteDeal(deal) {
    Swal.fire({
      title: `You are about to delete ${deal.name}!`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deal['deleting'] = true;
        this.dealroomsRequestService.deleteEntity(deal['id']).subscribe(
          (dealDeletedResponse) => {
            this.reassignRow(deal, dealDeletedResponse, false);
            this.notification.success(`${deal.name} successfully deleted!`);

          },
          (error) => {
            deal['deleting'] = false;
            // $(`#${event.target.id}`)[0].click();
            //console.log('An Error Occurred', error);
            this.notification.error(`${deal.name} could not be deleted`, error);

          }
        );
      }
    });


  }
  public async closeDeal(deal) {

    const accessData = {
      id: deal['id'],
      access: '3',
      closed_by: this.authUser['id']
    };

    Swal.fire({
      title: `You are about to request closure of ${deal.project_name}!`,
      text: 'Continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        deal['deleting'] = true;
        this.dealroomsRequestService.grantUserAccess(accessData).subscribe(
          (dealDeletedResponse) => {
            this.reassignRow(deal, dealDeletedResponse, false);
            this.notification.success(`${deal.name} successfully deleted!`);

          },
          (error) => {
            deal['deleting'] = false;
            // $(`#${event.target.id}`)[0].click();
            //console.log('An Error Occurred', error);
            this.notification.error(`${deal.name} could not be deleted`, error);

          }
        );
      }
    });


  }

  public openEditModal(deal) {
    this.updateDealForm.patchValue(deal);
    this.dealToEdit = {...deal};
    this.triggerModal('open', 'update_deal_modal');
  }

  public openOverlay(overlayId) {
    this.openingOverlay = true;

    super.openOverlay(overlayId);
    setTimeout(() => {
      $('.summernote').summernote({
        height: 350, // set editor height
        minHeight: null, // set minimum height of editor
        maxHeight: null, // set maximum height of editor
        focus: true // set focus to editable area after initializing summernote
      });
      this.openingOverlay = false;
    }, 1000);
  }

  public closeOverlay(overlayId) {

    setTimeout(() => {
      $('.summernote').each((index) => {
        $('.summernote').eq(index).summernote('destroy');
      });
    }, 100)

    super.closeOverlay(overlayId);
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

    UI.rerender(this.allDeals, 'deals_table', this.tableName);

  }

  public async uploadDocumentFile(name) {
    this.uploadInProgress = true;
    this.messages.update = 'Uploading';
    const date = new Date();
    const path = `documents/${name.split(' ').join('')}-${date.getTime()}`;
    const fileRef = this.storage.ref(path);
    // console.log('File ref',fileRef)
    await  this.storage.upload(path, this.selectedDocumentFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.uploadInProgress = false;
          const icon = this.setDoctypeIcon(this.fileType);
          const documentObject = {name, url, icon, created_at: date.toString()};
          this.allDocuments.push(documentObject);
          UI.rerender(this.allDocuments, 'create_documents_table', 'Create Documents');

          //Reset Document Form
          this.manualPaymentFileName = null;
          $('#document_file').val(null);
          $('#document_name').val(null);
        });
      })
    ).subscribe((urlData) => {
      this.setPercentageUpload(urlData);
      //console.log('URL Data ', urlData);
    }, (error) => {
      this.uploadInProgress = false;
      this.notification.error('An upload error occurred', error);
      this.loaders.processing = false;
    });
  }

  public setDoctypeIcon(docType: string): string {
    const fileTypes = {
      'pdf': 'pdf-o',
      'xlsx': 'excel-o',
      'xls': 'excel-o',
      'doc': 'word-o',
      'docx': 'word-o',
      'default': ''
    };
    return fileTypes[docType];
  }

  public uploadFile(event, payment = false) {
    const reader = new FileReader(); // HTML5 FileReader API
    const file = event.target.files[0];
    let fileType = 'default';
    if (file) {
      fileType = file.name.split('.');
      fileType = fileType[fileType.length - 1];
    }
    this.fileType = fileType;


    if (event.target.files && event.target.files[0]) {
      reader.onload = () => {
        if (!payment) {
          this.imageUrl = reader.result;
          this.fileName = file['name'];
          this.selectedPassportFile = this.selectedDocumentFile = file;
          this.isBlankPhoto = true;

        } else {
          this.manualPaymentFileUrl = reader.result;
          this.manualPaymentFileName = file['name'];
          this.selectedPaymentFile = this.selectedDocumentFile = file;
        }

        // this.uploadForm.patchValue({
        //   passport_image: reader.result
        // });
        // this.editFile = false;
        // this.removeUpload = true;
      };
      reader.readAsDataURL(file);
      // ChangeDetectorRef since file is loading outside the zone
      // this.cd.markForCheck();
    }
  }

  public cleanURL(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private async storeDeal(data) {
    const dealData = {...this.createDealForm.value};
    dealData['user_id'] = this.authUser['id'];
    dealData['sector_id'] = this.selectedSector['id'];
    dealData['fund_type_id'] = this.selectedFundType['id'];
    await this.dealroomsRequestService.create(dealData).subscribe(
      (dealResponse) => {

        this.resetLoaderAndMessage();
        this.closeOverlay('create_deal_overlay');
        this.createDealForm.reset();
        setTimeout(() => {
          this.allDeals.unshift(dealResponse.data);
          UI.rerender(this.allDeals, 'deals_table', this.tableName);
          this.allDocuments = [];
        }, 500)

        this.notification.success(`${dealResponse.data.project_name} successfully created!`);

        //console.log('Create response', dealResponse);
      },
      (error) => {
        this.resetLoaderAndMessage();
        this.notification.error('An error occurred', error);
        //console.log('An Error Occurred', error);
      }
    );
  }

  private async setFormValues(create = true) {

    const summerNoteObject = {
      'problem_situation_value': 'problem_situation_note',
      'business_model_value': 'business_model_note',
      'operating_model_value': 'operating_model_note',
      'target_market_value': 'target_market_note',
      'current_status_value': 'current_status_note',
      'future_plans_value': 'future_plans_note',
      'competition_value': 'competition_note',
      'revenue_streams_value': 'revenue_streams_note',
      'financial_value': 'financial_note',
      'fund_usage_value': 'fund_usage_note',
      'fund_infused_current_indicative_value': 'fund_infused_current_indicative_note',
      'ownership_structure_value': 'ownership_structure_note',
      'team_value': 'team_note',
      'key_challenge_value': 'key_challenge_note',
    };

    const mirror = {
      'problem_situation_value': 'problem_situation',
      'business_model_value': 'business_model',
      'operating_model_value': 'operating_model',
      'target_market_value': 'target_market',
      'current_status_value': 'current_status_achievements',
      'future_plans_value': 'future_plans',
      'competition_value': 'competition',
      'revenue_streams_value': 'revenue_streams',
      'financial_value': 'financials',
      'fund_usage_value': 'fund_usage',
      'fund_infused_current_indicative_value': 'fund_infused_current_indicative',
      'ownership_structure_value': 'ownership_structure',
      'team_value': 'team',
      'key_challenge_value': 'key_challenges',
    };
    const dealObject = {};
    const prefix = create ? '' : 'update_'; // take care of update: Remember to append 'update_' to all update ids
    for (const key in summerNoteObject) {
      const inputId = `${prefix}${key}`;
      const formControlValue = $(`#${summerNoteObject[inputId]}`).summernote('code');
      const mirrorKey = mirror[key];
      dealObject[mirrorKey] = formControlValue;
    }

    setTimeout(() => {
      create ? this.createDealForm.patchValue(dealObject) : this.updateDealForm.patchValue(dealObject);
    }, 100);

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

  private listSectors() {
    this.dealroomsRequestService.listSectors().subscribe((sectorsResponse) => {
        this.allSectors = sectorsResponse.data;
      },
      (error) => {
        this.notification.error(this.processErrors(error));
      }
    )
  }
  private getAllDocuments() {
    this.dealroomsRequestService.getAllDocuments().subscribe((documentsResponse) => {
        this.allDocsToUpload = documentsResponse.data;
      },
      (error) => {
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
}
