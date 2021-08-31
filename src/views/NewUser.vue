<template>
    <div class="mt-2">

        <h2>新規利用者登録</h2>
        <label class="col-4 col-form-label"> 名前: </label>
        <div class="col-lg-2 col-4">
            <input type="text" v-model="name" class="form-control" placeholder="名前">
        </div>
        <br>
        <label class="col-4 col-form-label"> 部屋番号: </label>
        <div class="col-lg-2 col-4">
            <input type="number" v-model="number" class="form-control" placeholder="部屋番号">
        </div>
        <br>
        <label class="col-4 col-form-label">部屋内番号: </label>
        <div class="col-md-3 col-6">
            <select v-model="roomCheck" class="form-select form-select-sm">
                <option value="" selected="selected">選択してください</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <br>
        <label class="col-4 col-form-label"> 要介護度: </label>
        <div class="col-lg-3 col-6">
            <select v-model="careLevel" class="form-select form-select-sm">
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
        </div>
        <br>
        <label class="col-4 col-form-label"> 生年月日: </label>
        <div class="col-lg-3 col-6" >
            <input type="date" v-model="birthday" class="form-control">
        </div>
        <br>
        <button @click="addUser" class="btn btn-primary">登録</button>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    mixins: [MixinUsersRecord],
    methods: {
        addUser() {
            if(this.name === '' || this.number === '' || this.careLevel === '' || this.birthday === ''){ return }
            this.usersRef.add({
             name: this.name,
             birthday: this.birthday,
             careLevel: this.careLevel,
             number: this.number + this.roomCheck,
             floor: parseInt(String(Number(this.number) / 100)) + 'F'
             });
            alert('新規登録しました');
        },
    }
};
</script>