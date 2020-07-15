// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  API_KEY: '',
  FIREBASE_CONFIG: {
    apiKey: 'AIzaSyClLcYR6FGz1RlszIB7CWBWvT17J08kJ1Y',
    authDomain: 'chi-insurance.firebaseapp.com',
    databaseURL: 'https://chi-insurance.firebaseio.com',
    projectId: 'chi-insurance',
    storageBucket: 'chi-insurance.appspot.com',
    messagingSenderId: '848048584328',
    appId: '1:848048584328:web:1485b40932a7b9e678913d',
    measurementId: 'G-12WYM2K6V0'
  },
  PAYSTACK_KEY: 'pk_test_e2048360b9d4e0b2bdd90b24b0bfa6d915d11486',
  FIREBASE_ADMIN: {
    'type': 'service_account',
    'project_id': 'chi-insurance',
    'private_key_id': 'c469e535d4ae75f289d13cd765062dee8d745eb5',
    'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCnk0gE2ThsSXBw\nu6DD8JHfey4lIjpabAj3D1DseShgM0VOowHl0znRq7IoI2HYX/HrygwEZgNeOjuq\ndOqnUTN9NeXyKbzBxG00omAAnNRfMYGEEU9qPLFG5UAYQCOWIJn0oZXPPuWVezcO\n2pcEopEIG5cCNtsaslg4/Ip1tSj3U965LxIOySfIPX1Qz1RHBkkRiy3CrXW+v34u\njR39vKe1hUYyeHCPE+XmlOo1O27OYjhzukJxE1/mRuPEUOAqA1sHeYPc5bttwRyF\nauqVC4XzUdXMInQ2+E+UqVXncWnwnjH2bsdZWtiJmB3DvJH8edZpGnGuKpLpWYKl\nyFjqrQvPAgMBAAECggEABybdAv/2TYDQ4K7RTKt+vkf2jzUnwmYr98daj80X8Qsf\nIR0J3rImHJG0V8wyx9ZIb+S+oI1uBV5832h//0YS6XwcZTpsyORGOOHZMQ2AbtOh\nEG7gscsHUdxE4QQTwLuBdpRS3XZ0u+13SxX/Lf52LB9pUXnf3gLQixYUHrPtnKiR\nAebpjhqr/oGPfs8E4GOTWcUkWRUobSXCDC9ZJ/6c7cgIwy0QLvHRGvaiXLOKof1P\nTNi/jJzNVf1Wf5+VltDleQLle33sEh+wL6DQQkUzbuxOMezQv6bFZAH1egIsXWjo\ngxD7aVnGou4xbJppd7g0YJsx0OP8G2BVyAdn2ydkUQKBgQDP5l3xN6ZtOJ4oE7kQ\ndl+BnVbXoKMWDkhsVyO6JuCobF71HnUAEBl4mn8aw65ds9GJ+qp8yZBC9x44GMOj\nK8E3sbM1v+O5UkbbxN6qn7lDlgPeAqxa3R+wavj8Ee6fYsRJ1mSKZOWqT5hzuauI\nvBCEmSpCZWrzO6dic/S01Cb8JwKBgQDOWItvRvXfJ8fJoHAU0xTRZhByfFS9BL6I\nvWHDFk72MEH/3/NjrnsEbYQpYi7yZMxsAp8oeFgCOj2V4+yuW6mg05cIPjHqrByX\nw9fFB8SC+I7CCitxcskO7+dQaOac1DXOgAGXQuEACFC5bzftsKcuxl36X71tZbcl\nMf4errW0GQKBgHfesI2zc48IFRCwhoT6a4jVSkwbf8zowVNOTvg3EFOr4HhebkFy\nBu2lzuGEsBWw54Ex+Xjn0vj5eQAJL0v2n3pYSCcWk9u3l8mBUo14eJ6CcYphajUd\nx/a1Rwg34qkdjmWwatns4Qr4x8L56/Bz1uZNVbNgvHCwFYvLpe1ZYX0DAoGBAJEk\nMx/YmAWZo6wtT+k1+ES6OANvdONnvOXN4EArJuuAUkw7KKYLCri4l+fMCh2xzSCE\nT5NV4wHeGYefRNH3478eVfQUW2QoIAyYUuNibVV6pF/Ua25nQQlisiAbSWsy0Y4o\n9/V/s2gkcTOeCYcFZPM/0MbWJRYYH9Tn70mBtomxAoGADkO2cCEUYSzj2KljsT0G\n9EKbx+WE81xcqnT2xjv6udnbWE5/DHeZZ0R5nnThhLO1EM384qblOovZzwvWi+XU\nWYAL8xtYuIJz75ZSPDGvuGiX9UxOFjZ9VgF2Xyd9ZBf0gHRCpxZwSYhq8nu99AZo\n8djBhx+R37B7/X0hwj/CKgM=\n-----END PRIVATE KEY-----\n',
    'client_email': 'firebase-adminsdk-ns4eb@chi-insurance.iam.gserviceaccount.com',
    'client_id': '100258321064133820095',
    'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
    'token_uri': 'https://oauth2.googleapis.com/token',
    'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
    'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-ns4eb%40chi-insurance.iam.gserviceaccount.com'
  },
  RAVE_PUBLIC_KEY: 'FLWPUBK_TEST-aefbbef5111d05264ca3022a6516177b-X',
  RAVE_SECRET_KEY: 'FLWSECK_TEST-41fc9f65daf919e52ad2432955342f7b-X',
  API_URL: {
    base: 'http://localhost:8000/api/',
  }
};
