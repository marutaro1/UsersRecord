<template>
    <div>
        <h3>利用者情報更新</h3>
        <label for="newName"> 名前: </label>
        <input type="text" id="newName" v-model="newName">
        <br>
        <label for="newNumber"> 部屋番号: </label>
        <input type="number" id="newNumber" v-model="newNumber">
        <br>
        <label>部屋内番号: </label>
        <select id="roomCheck" v-model="newRoomCheck">
            <option value="0" selected="selected">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
        </select>
        <br>
        <label for="newCareLevel"> 要介護度: </label>
        <select name="ご用件" id="newCareLevel" v-model="newCareLevel">
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
        <label for="newBirthday"> 生年月日: </label>
        <input type="date" id="newBirthday" v-model="newBirthday">
        <br>
        <button @click="updateProfile">更新</button>
        <button><router-link :to="'/User/' + id + '/records'">記録へ戻る</router-link></button>

    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
        props: ['id'],
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
                if(this.newName === '' || this.newNumber === ''|| this.newCareLevel === '' || this.newBirthday === ''){ return }
                this.db.collection('users').doc(this.userProfile[0][0]).update({
                name: this.newName,
                birthday: this.newBirthday,
                careLevel: this.newCareLevel,
                number: this.newNumber + this.newRoomCheck,
              });
              this.$router.push('/');
              alert('更新しました');
             }
        }
        
};
</script>