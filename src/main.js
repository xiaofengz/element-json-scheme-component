/* eslint-disable */

import Vue from 'vue'
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
// import ElJsonForm from 'components/jsonForm.js'
// import ElJsonTable from 'components/jsonTable.js'
import ElJsonSchemaComponent from 'element-json-scheme-component';

import Default from './examples/default.vue';
import TableDefault from './examples/table_default.vue';

import Rules from './examples/rules.vue';
const { ElJsonForm, ElJsonTable } = ElJsonSchemaComponent
Vue.use(ElementUI);
Vue.use(ElJsonForm)
Vue.use(ElJsonTable);
Vue.use(VueRouter);

Vue.config.productionTip = false


const routes = [
  { path: '/form-default', component: Default },
  { path: '/table-default', component: TableDefault },

  { path: '/rules', component: Rules },
  { path: '*', component: Default }
]
const router = new VueRouter({
  routes // routes: routes 的简写
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
