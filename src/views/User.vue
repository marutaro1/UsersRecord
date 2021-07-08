<template>
    <div>
        <h3>利用者</h3>
        <hr>
        <div v-for="(user,key) in userProfile" :key="key">
            <label>名前:</label>
            {{user[1].name}}
            <br>
            <label>生年月日:</label>
            {{user[1].birthday}}
            <br>
            <label>介護度:</label>
            {{user[1].careLevel}}
            <br>
            <label>部屋番号:</label>
            {{user[1].number}}
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id'],
        mixins: [MixinUsersRecord]
    };
</script>