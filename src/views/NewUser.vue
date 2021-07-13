<template>
    <div>
        <h3>新規利用者登録</h3>
        <label for="name"> 名前: </label>
        <input type="text" id="name" v-model="name">
        <br>
        <label for="number"> 部屋番号: </label>
        <input type="number" id="number" v-model="number">
        <br>
        <label>部屋内番号: </label>
        <select id="roomCheck" v-model="roomCheck">
            <option value="" selected="selected">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select>
        <br>
        <label for="careLevel"> 要介護度: </label>
        <select id="careLevel" v-model="careLevel">
            <option value="" selected="selected">選択してください</option>
            <option value="自立">自立</option>
            <option value="要支援1">要支援1</option>
            <option value="要支援2">要支援2</option>
            <option value="要介護1">要介護1</option>
            <option value="要介護2">要介護2</option>
            <option value="要介護3">要介護3</option>
            <option value="要介護4">要介護4</option>
            <option value="要介護5">要介護5</option>
        </select>
        <br>
        <label for="birthday"> 生年月日: </label>
        <input type="date" id="birthday" v-model="birthday">
        <br>
        <button @click="addUser()">新規登録</button>

        <div v-for="(user, key) in users" :key="key">
        {{user.name}}
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    mixins: [MixinUsersRecord],
    methods: {
        addUser() {
            if(this.name === '' || this.number === ''|| this.checBox === ''|| this.careLevel === '' || this.birthday === ''){ return }
            this.usersRef.add({
             name: this.name,
             birthday: this.birthday,
             careLevel: this.careLevel,
             number: this.number + this.roomCheck,
             floor: parseInt(String(Number(this.number) / 100))
             });
            alert('新規登録しました');
        }
    }
};
</script>