import { createApp } from 'vue'
import { PiniaColada } from '@pinia/colada'
import App from '@/App.vue'

import { router } from '@/router'

import {
  VueGlobalPropertiesPlugin
} from '@/plugins'
import { initializeAuth } from '@/views/auth/auth.init'

import '@/assets/styles/main.css'

const app = createApp(App)
const pinia = createPinia()

initializeAuth(pinia)

app
  .use(pinia)
  .use(PiniaColada)
  .use(router)
  .use(VueGlobalPropertiesPlugin)

router.isReady().then(() => {
  app.mount('#app')
})

export {
  app
}
