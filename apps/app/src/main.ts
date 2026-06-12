import { createApp } from 'vue'
import { PiniaColada } from '@pinia/colada'
import App from '@/App.vue'

import { router } from '@/router'

import {
  VueGlobalPropertiesPlugin
} from '@/plugins'

import '@/assets/styles/main.css'

const app = createApp(App)

app
  .use(createPinia())
  .use(PiniaColada)
  .use(router)
  .use(VueGlobalPropertiesPlugin)

app.mount('#app')

export {
  app
}
