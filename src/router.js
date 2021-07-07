import Vue from 'vue';
import Router from 'vue-router';
import Users from './views/Users.vue';
import NewUser from './views/NewUser.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {path: '/', component: Users},
        {path: '/NewUser', component: NewUser}
    ]
});