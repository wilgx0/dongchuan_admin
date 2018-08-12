// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './validate.js'
import { Row, Col,Popup,PullRefresh ,List,NavBar,Toast,Cell,CellGroup ,Field,Button} from 'vant'
Vue.use(Row).use(Col).use(Popup).use(PullRefresh).use(List).use(NavBar).use(Toast).use(Cell).use(CellGroup).use(Field).use(Button)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
