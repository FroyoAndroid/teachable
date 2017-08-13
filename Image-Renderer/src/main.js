import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.component('image-list', require('./components/ImageList.vue'))
Vue.component('image-item', require('./components/ImageItem.vue'))
Vue.component('dicom-image', require('./components/DicomImage.vue'))

const router = new VueRouter({
  routes: [
    {
      path: '/', component: App,
      children: [
        {
          path: '/image/:imageId',
          name: 'image-link',
          component: require('./components/ViewImageItem.vue'),
        },
        {
          path: '/dicom',
          name: 'dicom-image-link',
          component: require('./components/DicomImage.vue'),
        },
      ],
    },
  ],
})

new Vue({
  router,
}).$mount('#app')