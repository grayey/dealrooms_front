// import {Injectable} from '@angular/core';
// import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
//
// import * as firebaseAdmin from 'firebase-admin';
// import serviceAccount from './fire_base/service_account.json';
// import {Upload} from '../utils/firebaseUploadClass';
// import {Observable} from 'rxjs';
// import {map} from 'rxjs/operators';
//
//
// @Injectable()
// export class UploadService {
//
//   itemsRef: AngularFireList<Upload>;
//   items: Observable<any>;
//   private basePath = '/uploads';
//
//   constructor(db: AngularFireDatabase) {
//
//     console.log('Service Account', serviceAccount);
//     firebaseAdmin.initializeApp({
//       credential: firebaseAdmin.credential.cert(serviceAccount),
//       databaseURL: 'https://chi-insurance.firebaseio.com'
//     });
//
//     this.itemsRef = db.list('messages');
//     // Use snapshotChanges().map() to store the key
//     this.items = this.itemsRef.snapshotChanges().pipe(
//       map(changes =>
//         changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
//       )
//     );
//   }
//
//   addItem(newFile: Upload) {
//     this.itemsRef.push(newFile);
//   }
//
//   updateItem(key: string, newFile: Upload) {
//     this.itemsRef.update(key, newFile);
//   }
//
//   deleteItem(key: string) {
//     this.itemsRef.remove(key);
//   }
//
//   deleteEverything() {
//     this.itemsRef.remove();
//   }
// }
