export class SubProductTypeResponse {
  dsSubTipoProducto: string;
  idReg: string;
}

export class productsAvailableRequest {
  effectDate: string;
  subProductTypeID: string;
}

export class QuoteResponse {

}

export class QuotePolicyData {
  policyData: PolicyData;
  riskData: RiskData;
  insuredData: InsuredData[]; //an array
  tomadorData: TomadorData;
  coberData: CoberData;
  ecasData: {};
  parameters: {
    posicionTomador: string;// '1',
    tipoTomadorJuridico: string;//'0'
  };
  tomadorJuridicoData: {};

}

export class PolicyData {
  txtSufijo: string; //STNDRD
  txtFhInicio: string; //22/09/2014
  txtFhFin: string; //23/09/2014
  txtNpoliza: string; //43212
  idRegDivisaProducto: string; //,
  idRegProducto: string; //879,
  txtComentario: string; //,
  tipoPagador: string; //,
  idRegRegion: string; //-1,
  txtDuracion: string; //2,
  idRegFranquicia: string; //-1,
  txtPrecioBrutoTotal: string; //0,
  txtDivisaProducto: string; //,
  txtCodPromocion: string; //-1,
  txtProducto: string; //TEST_STANDARD
  txtFHExpiracion: string;
  txtCodDealer: string;

}

export class RiskData {
  CMBDESTINOSV: string;
}

export class InsuredData {
  txtNmAsegurado: string; //PABLO,
  txtApeAsegurado: string; //'RAMOS',
  txtFhNacimiento: string; //'12/01/1984',
  TXTEDADSV: string; //'27',
  txtIdFiscal: string; //'paspport',
  txtDirAsegurado: string; //'address',
  txtTelefono: string; //'phone',
  txtEmail: string; //'phone',

  // insData: {
  //   txtPremium: string; //'325.00'
  // };


}

// export class TomadorDataOld {
//   txtNmAsegurado_policyHolder: string;
//   txtApeAsegurado_policyHolder: string;
//   txtDirAsegurado_policyHolder: string;
//   txtCdPostal_policyHolder: string;
//   txtTelefono_policyHolider: string;
//   txtMovil_policyHolder: string;
//   txtEmail_policyHolder: string;
// }
export class TomadorData {
  txtNmAsegurado_policyHolder: string;
  txtApeAsegurado_policyHolder: string;
  txtIdFiscal_policyHolder: string;
  txtFhNacimiento_policyHolder: string;
  TXTEDADSV_policyHolder: string;
 txtDirAsegurado_policyHolder:string; //House Address
  txtTelefono_policyHolider:string;
  txtEmail_policyHolder:string;
}

export class IssuingResponse {
  idRegContrato: string;
  numContrato: string;
  guid: string;
  file: string;
}


export class Parameters {
  posicionTomador: string;
  tipoTomadorJuridico: string;
}


export class CoberData {
  chk_D0001: string;//'1'
  chk_G0000: string; //'3'
  chk_B0000: string; //'3'
  chk_F0000: string; //'3'
  chk_I0000: string; //'3'
  chk_B0002: string; //'3'
  chk_D0000: string; //'3'
  chk_C0000: string; //'3'
  CoberturaLimites: {};
}


export class GibssTransactionData {
  Title: string;
  LastName: string;
  FirstName: string;
  ContactAddress: string;
  DOB: string;
  PhoneNo: string;
  Email: string;
  Gender: string;
  NoK_Name: string;
  NoK_Email: string;
  NoK_PhoneNo: string;
  NoK_Address: string;
  NoK_Relationship: string;
  PolicyStartDate: string;
  PolicyEndDate: string;
  PackageID: string;
  Package: string;
  Destination: string;
  TravelPurpose: string;
  PassportNo: string;
  Premium: string;
  Map_PolicyNo: string;
  Payment_Ref: string;
}

export class GibssResponseData {
  CertificateNos: string;
  PolicyNumber: string;
  Premium: string;
  Fullname: string;
  Risktype: string;
  StartDate: string;
  ExpiryDate: string;
  InvoiceID: string;
  PassportNo: string;
  StatusmSG: string;
}
