<template>
    <div>
        <router-link :to="'/User/' + id + '/records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>利用者情報更新</h3>
        <label class="col-4 col-form-label"> 名前: </label>
        <div class="col-md-2 col-4">
            <input type="text" v-model="newName" class="form-control">
        </div>
        <br>
        <label class="col-4 col-form-label"> 部屋番号: </label>
        <div class="col-md-2 col-3">
            <input type="number" v-model="newNumber" class="form-control">
        </div>
        <br>
        <label class="col-4 col-form-label">部屋内番号: </label>
        <div class="col-md-3 col-6">
            <select v-model="newRoomCheck" class="form-select form-select-sm">
                <option value="" selected="selected">選択してください</option>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <br>
        <label class="col-4 col-form-label"> 要介護度: </label>
        <div class="col-md-3 col-6">
            <select v-model="newCareLevel" class="form-select form-select-sm">
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
   
        <br>
        <button @click="updateProfile" class="btn btn-primary">更新</button>

    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
        props: ['id', 'userBirthday'],
        data() {
            return {
            newName: '',
            newBirthday: '',
            newCareLevel: '',
            newNumber: '',
            newRoomCheck: ''
            };
        },
        methods: {
             updateProfile() {
                if(this.newName === '' || this.newNumber === ''|| this.newCareLevel === ''){ return }
                this.db.collection('users').doc(this.userProfile[0][0]).update({
                name: this.newName,
                birthday: this.userBirthday,
                careLevel: this.newCareLevel,
                number: this.newNumber + this.newRoomCheck,
              });
              this.$router.push('/');
              alert('更新しました');
             }
        }
        
};
</script>