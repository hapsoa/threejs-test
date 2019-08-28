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
      path: '/template',
      name: 'template',
      component: () => import('./views/template/')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
});
