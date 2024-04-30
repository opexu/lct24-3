import './assets/main.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueCookies from 'vue-cookies';
import PrimeVue from 'primevue/config';
import Lara from '@/presets/lara';
// import Wind from '@/presets/wind';
import Tooltip from 'primevue/tooltip';

import App from './App.vue'
import router from './router'

const app = createApp(App);

app.use( createPinia() );
app.use( VueCookies, { expires: '7d'} );
app.use( router );
app.use( PrimeVue, {
    unstyled: true,
    pt: Lara
} );
app.directive('tooltip', Tooltip);
app.mount('#app');
