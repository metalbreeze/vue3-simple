import { createApp } from 'vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'

import { ref } from 'vue'
import App from './App.vue'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

//import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')
