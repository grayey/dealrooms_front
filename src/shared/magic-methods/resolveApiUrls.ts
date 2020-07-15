// import {environment} from "../../environments/environment";
//
// export class ResolveApiUrls {
//
//     private Urls = environment.API_URL.urls;
//
//     public resolveSetUpEntityUrl(entityObject: string | object): any {
//         let entityUrlObject;
//         if (typeof entityObject === 'string') {
//             entityUrlObject = {
//                 url: this.Urls[entityObject]
//             };
//             return entityUrlObject;
//         }
//
//         const entityModule = entityObject['module'];
//         const entityName = entityObject['name'];
//         entityUrlObject = {
//             url: this.Urls[entityModule][entityName],
//             limit: entityObject['limit'] || null
//         };
//         return entityUrlObject;
//     }
//
//
// }
