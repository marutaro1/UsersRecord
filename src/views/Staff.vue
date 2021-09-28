<template>
    <div class="mt-2">
        <h2>職員関係</h2>
        <div> 
        <router-link to="/SignUp" class="h3 btn btn-primary m-2"><p class="h3 m-0">新規職員登録</p></router-link>
        <br>
        <router-link to="/StaffDayWork/Works" class="btn btn-primary m-2"><p class="h3 m-0">業務登録</p></router-link>
        </div> 
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
    }
</script>