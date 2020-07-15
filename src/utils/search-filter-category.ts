
export const fraudFilter = [
    {displayName: 'Institution', columnName: 'institutionName'},
  {displayName: 'Customer Account Number', columnName: 'sourceAccountNumber'},
  {displayName: 'Customer BVN', columnName: 'sourceBVN'},
  {displayName: 'Platform Involved', columnName: 'aggregatorPlatformInvolved'},
  {displayName: 'Fraud Channel', columnName: 'fraudChannel'},
  {displayName: 'Customer Bank', columnName: 'sourceBank'}

];

export const securityBreachFilter = [

  {displayName: 'Institution', columnName: 'institutionName'},
  {displayName: 'Data Affected', columnName: 'affectedData'},
  {displayName: 'Source of Breach', columnName: 'sourceOfBreach'},
  {displayName: 'Action Taken', columnName: 'actionTakenBriefDescription'},

];

export const ROBBERYFILTER = [

    {displayName: 'Institution', columnName: 'institutionName'},
    {displayName: 'Data Affected', columnName: 'affectedData'},
    {displayName: 'Source of Breach', columnName: 'sourceOfBreach'},
    {displayName: 'Action Taken', columnName: 'actionTakenBriefDescription'},

];


export const CAE_FRAUD_FILTER = [

    {displayName: 'Institution', columnName: 'institutionName'},
    {displayName: 'Staff Involved', columnName: 'staffInvolved'},
    {displayName: 'Business Office Name', columnName: 'businessOfficeName'},
    {displayName: 'Bussiness Office Code', columnName: 'businessOfficeCode'},

];

export const CAE_DISMISSAL_FILTER = [

    {displayName: 'Institution', columnName: 'institutionName'},
    {displayName: 'State', columnName: 'stateOfOrigin'},
    {displayName: 'Offence Type', columnName: 'offenceType'},
    {displayName: 'Termination Type', columnName: 'terminationType'},

];
