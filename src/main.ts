import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import bootFontLibrary from './icons';

bootFontLibrary();

createApp(App)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
