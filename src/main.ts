import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import '@mdi/font/css/materialdesignicons.css'
import 'vue-file-selector/dist/main.css';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './router'
import FileSelector from 'vue-file-selector';

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

app.use(createPinia())

app.use(vuetify);
app.use(router);
app.use(FileSelector);

app.mount('#app')
