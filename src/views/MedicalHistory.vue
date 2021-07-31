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
            <button @click="addHistory(_uid)" class="btn btn-primary ">追加</button>
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
        <label class="col-3 col-form-label">病名検索:</label>
         <div class="col-6 mb-2">
            <input type="text" v-model="keyword" class="form-control">
         </div>      
        <div class="col-12 scroll">
            <div v-for="(h,key) in serchHistory" :key="key">
            <p>発症日: {{h.value.day}}</p>
            <p>病名: {{h.value.history}}</p>
            <br>
            <button @click="updateHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 mt-2">更新</button>
            <button @click="deleteHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 mt-2 mx-1">削除</button>
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
       historyPost: {},
       historyID: ''
     };
    },
    computed: {
            historyLists() {
                this.historyList();
                return this.historyPost;
            },
            sortHistory(){
                return this.historyLists.slice().sort((a, b) => {
                    return Number(new Date(a.value.day)) - Number(new Date(b.value.day));
                });
            },
            serchHistory() {
                return this.sortHistory.filter(rec => {
                    return rec.value.history.includes(this.keyword);
                });
            },
        },
    methods: {
        historyList() {
               const arr = Object.entries(this.historyPost)
               const result = arr.map(([key, value]) => ({key, value}))
               this.historyPost = result
        },
        addHistory(uid) {
            if(this.history === ''){ return }
                this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(String(uid)).set({
                    day: this.day,
                    history: this.history,
                    historyID: uid
                });
            alert('追加しました')
            this.history = ""
            this.day = ""
            this._uid = Math.floor( Math.random(this._uid) * 100 )
        },
        getHistory() {
              this.db.collection('users').doc('history').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                });
                this.historyPost = obj
              })
        },
        updateHistory(hisID) {
             if(this.newHistory === ''){ return }
            this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(String(hisID)).update({
                day: this.newDay,
                history: this.newHistory
            });
            alert('更新しました')
            this.newDay = ''
            this.newHistory = ''
        },
        deleteHistory(historyID) {
                 this.db.collection('users').doc('history').collection(this.userProfile[0][0]).doc(String(historyID)).delete();
                 alert('削除しました')
        }
    }
};
</script>