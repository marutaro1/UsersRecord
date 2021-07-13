<template>
    <div>
        <h3>利用者</h3>
        <hr>
        <div v-for="(user,key) in userProfile" :key="key">
            <p>名前: {{user[1].name}}</p>
    
            <p>生年月日: {{user[1].birthday}}</p>

            <p>年齢: {{age(user[1].birthday)}}</p>

            <p>介護度: {{user[1].careLevel}}</p>

            <p>部屋番号: {{parseInt(user[1].number / 10)}}</p>
            
        <router-view :userName="user[1].name"></router-view>
        </div>
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id'],
        mixins: [MixinUsersRecord],
       
    };
</script>