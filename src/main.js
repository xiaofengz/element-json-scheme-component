/* eslint-disable */

import Vue from 'vue'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import ElJsonForm from './jsonForm.js'
import ElJsonTable from './jsonTable.js'

Vue.use(ElementUI);
Vue.use(ElJsonForm)
Vue.use(ElJsonTable);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
