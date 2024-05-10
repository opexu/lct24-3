import '@/assets/main.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueCookies from 'vue-cookies';
import Aura from '@/presets/aura';
import Lara from '@/presets/lara';
import PrimeVue from 'primevue/config';

import Tooltip from 'primevue/tooltip';
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

const app = createApp(App);
app.use( createPinia() );
app.use( VueCookies, { expires: '7d'} );
app.use( router );
app.use( ToastService );
app.directive('tooltip', Tooltip);
app.use( PrimeVue, { unstyled: true, pt: Aura });
app.mount('#app');
