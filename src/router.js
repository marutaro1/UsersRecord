import Vue from 'vue';
import Router from 'vue-router';

const Users = () => import(/* webpackChunkName: "Users" */ './views/Users.vue');
const NewUser = () => import(/* webpackChunkName: "NewUser" */ './views/NewUser.vue');
const User = () => import(/* webpackChunkName: "User" */ './views/User.vue');

const Records = () => import(/* webpackChunkName: "Records" */ './views/Records.vue');
const UpdateUser = () => import(/* webpackChunkName: "UpdateUser" */ './views/UpdateUser.vue');
const Archives = () => import(/* webpackChunkName: "Archives" */ './views/Archives.vue');
const Manuel = () => import(/* webpackChunkName: "Manuel" */ './views/Manuel.vue');
const MedicalHistory = () => import(/* webpackChunkName: "MedicalHistory" */ './views/MedicalHistory.vue');
const SignUp = () => import(/* webpackChunkName: "SignUp" */ './views/SignUp.vue');
const StaffDayWork = () => import(/* webpackChunkName: "StaffDayWork" */ './views/StaffDayWork');
// import Users from './views/Users.vue';
// import NewUser from './views/NewUser.vue';
// import User from './views/User.vue';
// import Records from './views/Records.vue';
// import UpdateUser from './views/UpdateUser.vue';
// import Archives from './views/Archives.vue';
// import Manuel from './views/Manuel.vue';
// import MedicalHistory from './views/MedicalHistory.vue';
// import SignUp from './views/SignUp.vue';





Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {path: '/', component: Users},
        {path: '/SignUp', component: SignUp},
        {path: '/StaffDayWork', component: StaffDayWork},
        {path: '/NewUser', component: NewUser},
        {path: '/User/:id', component: User, props: true,
        children: [
            {path: '/User/:id/UpdateUser', component: UpdateUser, props: true},
            {path: '/User/:id/Records', component: Records, props: true},
            {path: '/User/:id/Manuel', component: Manuel, props: true},
            {path: '/User/:id/MedicalHistory', component: MedicalHistory, props: true}
        ]
        },
        {path: '/Archives', component: Archives, props: true},
       
        
    ]
});