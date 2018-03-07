// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDQ9VX9eRFOcrp7aA_-nrZeolZC02HYFeQ",
    authDomain: "ng5-lib-note.firebaseapp.com",
    databaseURL: "https://ng5-lib-note.firebaseio.com",
    projectId: "ng5-lib-note",
    storageBucket: "",
    messagingSenderId: "483547243513"
  },
  libNoteApiUrl: '//libnoteapi.gear.host/api/notification' 
};
