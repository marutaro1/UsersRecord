<template>
    <div class="mt-2">
        <h2>利用者一覧</h2>
        <label class="col-5 col-form-label">利用者名検索: </label>
        <div class="col-5">
            <input type="text" v-model="keyword" class="form-control">
        </div>
        <hr>
        <div class="scroll-user">       
           <div v-for="user in serchUsers" :key="user.key">
           <table class="table col-1">
                <tr>
                <th class="text-rightr">
                    <router-link :to="'/User/' + user.value.number + '/Records'">{{user.value.name}}様</router-link>
                </th>
                </tr>
                <td class="text-right col-1">
                部屋番号: {{parseInt(user.value.number / 10)}}号室
                <br>
                年齢: {{age(user.value.birthday)}}歳
                <br>
                要介護度:{{user.value.careLevel}}
                </td>
            </table>
            <hr>
            </div>
        </div>       

    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
        computed: {
            usersLists() {
                this.usersList();
                return this.users;
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
            },
            
        },
        methods:{
            usersList() {
               const arr = Object.entries(this.users)
               const result = arr.map(([key, value]) => ({key, value}))
               this.users = result
            }
        }

    };
</script>
<style>
    .scroll-user {
        height: 600px;
        overflow: hidden;
        overflow-y: scroll;
    }
</style>