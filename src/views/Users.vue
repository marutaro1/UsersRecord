<template>
    <div>
        <h3>利用者一覧</h3>
        <div v-for="(user, key) in users" :key="key">
            <hr>
            <p>部屋番号: {{user.number}}</p>
            <router-link :to="'/User/' + user.number + '/Records'">名前: {{user.name}}</router-link>
        </div>
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord]
    };
</script>