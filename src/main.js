import Vue from 'vue';
import App from './App.vue';
import router from './router.js';
import firebase from 'firebase';
import VueUid from 'vue-uid';
import axios from 'axios';
import BootstrapVue from 'bootstrap-vue'

Vue.config.productionTip = false;


  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAogvQ1r-mbsgEXAH81__dVKlwZagbv3o4",
    authDomain: "users-record.firebaseapp.com",
    projectId: "users-record",
    storageBucket: "users-record.appspot.com",
    messagingSenderId: "515962885545",
    appId: "1:515962885545:web:11d277a6e53dd4de6f20b8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'


new Vue({
  router,
  firebase,
  VueUid,
  axios,
  BootstrapVue,
  render: h => h(App),
}).$mount('#app');
