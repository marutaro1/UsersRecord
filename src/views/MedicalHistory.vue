<template>
    <div @mousemove.once="getHistory">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">発症日</label>
            <div class="col-7">
                <input type="date" v-model="day" class="form-control">
            </div>
            <label class="col-form-label col-5">病名</label>
            <div class="col-10">
                <input type="text" v-model="history" class="form-control">
            </div>
            <br>
            <button @click="addHistory" class="btn btn-primary ">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">発症日</label>
            <div class="col-7">
                <input type="date" v-model="newDay" class="form-control">
            </div>
            <label class="col-form-label col-5">病名</label>
            <div class="col-10">
                <input type="text" v-model="newHistory" class="form-control">
            </div>
        </div>
        <hr>
        <h3>既往歴</h3> 
        <hr>        
        <div class="col-12 scroll">
            <div v-for="(h,key) in historyPost" :key="key">
            発症日: {{h.day}}
            <br>
            病名: {{h.history}}
            <br>
            <button @click="updateHistory(key)" class="btn btn-primary px-0 col-2 mt-2">更新</button>
            <button @click="deleteHistory(key)" class="btn btn-primary px-0 col-2 mt-2 mx-1">削除</button>
            <hr>
            </div>
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    props: ['id'],
    mixins: [MixinUsersRecord],
    data() {
     return {
       newHistory: '',
       historyPost: {}
     };
    },
    methods: {
        addHistory() {
            if(this.history === ''){ return }
                this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(String(this._uid)).set({
                    day: this.day,
                    history: this.history
                })
            this.history = ""
            this._uid = Math.floor( Math.random(this._uid) * 100 )
        },
        getHistory() {
              this.db.collection('users').doc('history').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.historyPost = obj
              })
        },
        updateHistory(historyID) {
             if(this.newHistory === ''){ return }
            this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(historyID).update({
                day: this.newDay,
                history: this.newHistory
            });
            this.newHistory = ''
        },
        deleteHistory(historyID) {
                 this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(historyID).delete()
        }
    }
};
</script>