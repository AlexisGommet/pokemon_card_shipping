import { createApp } from 'vue'
import App from './App.vue'

// Import routes
import router from './routes/index';

import { getAnalytics } from "firebase/analytics";
import * as firebase from 'firebase/app';

const app = firebase.initializeApp({
    apiKey: "AIzaSyCbbnyo_TcGYcyze_gZldDtm1eD7XeesSM",
    authDomain: "pokemoncardshipping.firebaseapp.com",
    projectId: "pokemoncardshipping",
    storageBucket: "pokemoncardshipping.appspot.com",
    messagingSenderId: "692726147102",
    appId: "1:692726147102:web:d5d5f865497b2611e1260f",
    measurementId: "G-D41S3B2C60"
})

const analytics = getAnalytics(app);

// Vue app creation
const app2 = createApp(App);
app2.use(router);
app2.mount('#app');
