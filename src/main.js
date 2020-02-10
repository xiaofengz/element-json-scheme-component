/* eslint-disable */

import Vue from 'vue'
import VueRouter from 'vue-router';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import ElJsonForm from './components/jsonForm.js'
import ElJsonTable from './components/jsonTable.js'
// import ElJsonSchemaComponent from 'element-json-scheme-component';

import FormDefault from './examples/form_default.vue';
import FormRules from './examples/form_rules.vue';

import TableDefault from './examples/table_default.vue';

import CompleteDemo from './examples/complete_demo.vue';
// console.log(ElJsonSchemaComponent)
// const { ElJsonForm, ElJsonTable } = ElJsonSchemaComponent
Vue.use(ElementUI);
Vue.use(ElJsonForm);
Vue.use(ElJsonTable);
Vue.use(VueRouter);

Vue.config.productionTip = false

const routes = [
  { path: '/form-default', component: FormDefault },
  { path: '/form-rules', component: FormRules },

  { path: '/table-default', component: TableDefault },

  { path: '/compelete-demo', component: CompleteDemo },
  { path: '*', component: FormDefault }
]

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
