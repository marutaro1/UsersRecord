import Vue from 'vue';
import Router from 'vue-router';
import Users from './views/Users.vue';
import NewUser from './views/NewUser.vue';
import User from './views/User.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Users},
        {path: '/NewUser', component: NewUser},
        {path: '/User/:id', component: User, props: true}
    ]
});