import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import components_global from './components/global-components'
import { directives } from './directives'
import router from './router'

const app = createApp(App)

components_global.forEach((item) => app.component(item.name, item.component))
directives.forEach((i) => app.directive(...i))

app.use(createPinia()).use(router).mount('#app')
