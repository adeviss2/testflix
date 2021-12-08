import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config';
import "./assets/fa-pro/css/pro.css"
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'primeicons/primeicons.css';
import './app.scss';
import { supabase } from './plugins/supabase';

supabase.auth.onAuthStateChange((event, session) => {
    console.log(event);
    if(session !== null) {
        store.dispatch('setSession', session);
        store.dispatch('getUserMoviesAndShows');
        
    }
})
const app = createApp(App);
app.config.globalProperties.$appState = reactive({darkTheme: true });
app.use(PrimeVue);
app.use(router);
app.use(store);
app.mount('#app');
