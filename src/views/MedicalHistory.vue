<template>
    <div @mousemove.once="getHistory">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>既往歴</h3> 
        <div class="col-12">
            <label class="col-form-label col-5">発症日</label>
            <div class="col-7 col-lg-3">
                <input type="date" v-model="dateOfOnset" class="form-control">
            </div>
            <label class="col-form-label col-5">病名</label>
            <div class="col-10 col-lg-6">
                <input type="text" v-model="history" class="form-control">
            </div>
            <button @click="addHistory(_uid)" class="btn btn-primary mt-2">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">発症日</label>
            <div class="col-7 col-lg-3">
                <input type="date" v-model="newDateOfOnset" class="form-control">
            </div>
            <label class="col-form-label col-5">病名</label>
            <div class="col-10 col-lg-6">
                <input type="text" v-model="newHistory" class="form-control">
            </div>
        </div>
        <hr>
        <label class="col-3 col-form-label">病名検索:</label>
         <div class="col-6 mb-2">
            <input type="text" v-model="keyword" class="form-control">
         </div>      
        <div class="col-12 scroll">
            <div v-for="(h,key) in serchHistory" :key="key">
                <p>発症日: {{h.value.dateOfOnset}}</p>
                <p>病名: {{h.value.history}}</p>
                <button @click="updateHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 col-lg-1">更新</button>
                <button @click="deleteHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 col-lg-1 mx-1">削除</button>
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
       dateOfOnset: '',
       newDateOfOnset: '',
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
                    return Number(new Date(a.value.dateOfOnset)) - Number(new Date(b.value.dateOfOnset));
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
                this.usersRef.doc('history').collection(this.userProfile[0][0]).doc(String(uid)).set({
                    dateOfOnset: this.dateOfOnset,
                    history: this.history,
                    historyID: uid
                });
            alert('追加しました')
            this.history = ""
            this.dateOfOnset = ""
            this._uid = Math.floor( Math.random(this._uid) * 100 )
        },
        getHistory() {
              this.usersRef.doc('history').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                });
                this.historyPost = obj
              })
        },
        updateHistory(hisID) {
             if(this.newHistory === ''){ return }
            this.usersRef.doc('history').collection(this.userProfile[0][0]).doc(String(hisID)).update({
                day: this.newDateOfOnset,
                history: this.newHistory
            });
            alert('更新しました')
            this.newDateOfOnset = ''
            this.newHistory = ''
        },
        deleteHistory(historyID) {
                 this.usersRef.doc('history').collection(this.userProfile[0][0]).doc(String(historyID)).delete();
                 alert('削除しました')
        }
    }
};
</script>