import Vue from 'vue';
import Router from 'vue-router';

import Users from './views/Users.vue';
import NewUser from './views/NewUser.vue';
import User from './views/User.vue';
import Records from './views/Records.vue';
import UpdateUser from './views/UpdateUser.vue';
import Archives from './views/Archives.vue';
import Manuel from './views/Manuel.vue';


Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Users},
        {path: '/NewUser', component: NewUser},
        {path: '/User/:id', component: User, props: true,
        children: [
            {path: '/User/:id/UpdateUser', component: UpdateUser, props: true},
            {path: '/User/:id/Records', component: Records, props: true},
            {path: '/User/:id/Manuel', component: Manuel, props: true}
        ]
        },
        {path: '/Archives', component: Archives, props: true},
    ]
});