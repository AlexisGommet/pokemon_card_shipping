import { createApp } from 'vue'
import App from './App.vue'

// Import routes
import router from './routes/index';

// Vue app creation
const app = createApp(App);
app.use(router);
app.mount('#app');
