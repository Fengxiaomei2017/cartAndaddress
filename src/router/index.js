import Vue from 'vue'
import Router from 'vue-router'
import address from '@/components/address/address.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/address',
      component: address
    }
  ]
})
