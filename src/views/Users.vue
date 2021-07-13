<template>
    <div>
        <h3>利用者一覧</h3>
        <label>利用者名検索: </label>
        <input type="text" v-model="keyword">
        <div v-for="user in serchUsers" :key="user.key">
            <hr>
            <p>部屋番号: {{parseInt(user.value.number / 10)}}号室</p>
            <p>年齢: {{age(user.value.birthday)}}歳</p>
            <router-link :to="'/User/' + user.value.number + '/Records'">{{user.value.name}}様</router-link>
        </div>
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
        data() {
            return {
                keyword: ''
            };
        },
        computed: {
            usersLists() {
                this.usersList()
                return this.users
            },
            sortNumber() {
                return this.usersLists.slice().sort((a, b) => {
                    return Number(a.value.number) - Number(b.value.number);
                });
            },
            serchUsers() {
                return this.sortNumber.filter(user => {
                    return user.value.name.includes(this.keyword);
                });
            }
        },
        methods:{
            usersList() {
               const arr = Object.entries(this.users)
               const result = arr.map(([key, value]) => ({key, value}))
               this.users = result
            },
            checkA() {
                console.log(this.usersLists)
            },
            checkB() {
                console.log(this.sortNumber)
            }
        },

    };
</script>