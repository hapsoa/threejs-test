import Vue from 'vue';
import Router from 'vue-router';
import Main from './views/main';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/example-1',
      name: 'example-1',
      component: () => import('./views/example-1/')
    },
    {
      path: '/buffer-geometry-test',
      name: 'buffer-geometry-test',
      component: () => import('./views/BufferGeometryTest')
    },
    {
      path: '/template',
      name: 'template',
      component: () => import('./views/template/')
    }
  ]
});
