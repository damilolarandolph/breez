import Firebase from 'firebase'


const config = {
    apiKey: "AIzaSyDhLc26swEomw74m_g8WymDVsvoiB0hvhI",
    authDomain: "rokcare-demo.firebaseapp.com",
    databaseURL: "https://rokcare-demo.firebaseio.com",
    projectId: "rokcare-demo",
    storageBucket: "rokcare-demo.appspot.com",
    messagingSenderId: "205305548761",
    appId: "1:205305548761:web:24983059c93469e66593c8",
    measurementId: "G-KCSCZSL0K4"

};


if (!Firebase.apps.length) {
    Firebase.initializeApp(config)
}
Firebase.firestore.settings({ experimentalForceLongPolling: false })
