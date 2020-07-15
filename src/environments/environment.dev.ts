// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  API_KEY: '',
  API_URL: {

    // base: 'http://197.255.63.146:9090/admin/',
    base: 'http://197.255.63.146:3030/appserver/admin/',
    // sans_admin: 'http://197.255.63.146:9290/',
    sans_admin: 'http://197.255.63.146:3030/appserver/securitybreach/',
    // base_fraud: 'http://197.255.63.146:9190/',
    base_fraud: 'http://197.255.63.146:3030/appserver/fraud/',
    // base_cae: 'http://197.255.63.146:9390/',
    base_cae: 'http://197.255.63.146:3030/appserver/cae/',
    login: 'auth/login',
    user: 'users',
    institution: 'institutions',
    task: 'task',
    role: 'role',
    config: 'config',
    report: 'report',
    fraud: 'fraud',
    cae: 'cae',
    bulk: {
      robbery: 'http://197.255.63.146:3030/appserver/cae/report/robbery/bulk',
      dismissal: 'http://197.255.63.146:3030/appserver/cae/report/staffdismissaltermination/bulk',
      cae_fraud: 'http://197.255.63.146:3030/appserver/cae/report/fraud/bulk',
      fraud: 'http://197.255.63.146:3030/appserver/fraud/report/bulk',
      security_breach: 'http://197.255.63.146:3030/appserver/securitybreach/report/bulk'
    },
    template: {
      robbery: 'http://197.255.63.146:3030/appserver/cae/report/robbery/template',
      dismissal: 'http://197.255.63.146:3030/appserver/cae/report/staffdismissaltermination/template',
      cae_fraud: 'http://197.255.63.146:3030/appserver/cae/report/fraud/template',
      fraud: 'http://197.255.63.146:3030/appserver/fraud/report/template',
      security_breach: 'http://197.255.63.146:3030/appserver/securitybreach/report/template'
    }
  }
}
