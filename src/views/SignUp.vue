<template>
    <div>
        
        <h3>職員登録画面</h3>
        <label>新規職員名:</label>
        <div>
        <input type="text" v-model="staffName" placeholder="職員名">
        </div>
        <label>Eメール:</label>
        <div>
        <input type="text" v-model="email" placeholder="Eメール">
        </div>
        <label>パスワード:</label>
        <div>
        <input type="text" v-model="password" placeholder="パスワード">
        </div>
        <button @click="signUp" class="btn btn-primary">登録</button>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
import firebase from 'firebase';
export default {
    mixins: [MixinUsersRecord],
    methods: {
        signUp() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(res => {
                console.log(res.user);
                console.log(res.user.uid);
                this.staffNameAdd(res.user.uid);
            });
        },
        staffNameAdd(staffID) {
              this.db.collection('users').doc('staffs').collection(staffID).doc(staffID).set({
                staffName: this.staffName,
                email: this.email,
                password: this.password
                });
        }
    }
};
</script>