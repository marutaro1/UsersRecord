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
            <vue-simple-suggest
                v-model="keyword"
                :list="historyKeyword"
                :filter-by-query="true"
                class="form-control m-0 p-0">
            </vue-simple-suggest>
         </div>    
         <label class="col-3 col-form-label">日付指定:</label>

         <div class="col-6 mb-2">
            <input type="date" v-model="dayKeywordFirst" class="form-control">
            <p class="m-0 p-0">から</p>
            <input type="date" v-model="dayKeywordSecond" class="form-control">
         </div>
        <button @click="dayclearString" class="btn btn-primary px-1">クリア</button>

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
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'
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
     components: {
        'vue-simple-suggest': VueSimpleSuggest,
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
            //serchHistoryからキーワード候補抽出
            historyKeyword() {
                var keywordData = []
                var recordNumber = this.serchHistory.length
                var i = 0
                while (i < recordNumber) {
                    keywordData = [...keywordData, this.serchHistory[i].value.history]
                    i++
                }
                return keywordData;
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
        },
        //day取得メソッド
           getDay(start, end) {
                                var dayData = []
                                //startDayからendDayまでの日付を入れる配列
                                var startDate = new Date(start)
                                var endDate = new Date(end)
                                while (startDate < endDate) {
                                    dayData = [...dayData, startDate.getFullYear()  + 
                    '-' +("00" + (startDate.getMonth() + 1)).slice(-2)+ '-' + 
                    ("00" + (startDate.getDate())).slice(-2)]
                                    startDate.setDate(startDate.getDate() + 1)
                                    //startDayをdayData配列の中に入れ、+1日してwhileでendDayまでのループを回す

                                }    
                                dayData = [...dayData, endDate.getFullYear()  + 
                    '-' +("00" + (endDate.getMonth() + 1)).slice(-2)+ '-' + 
                    ("00" + (endDate.getDate())).slice(-2)]

                                this.arrayDayData = dayData;       
                                //dayData配列内にstartDayからendDayまでのデータが格納され、それをarrayDayDate(空の配列)内に入れ直す
           },
           //day空文字に変える
           dayclearString() {
               this.dayKeywordFirst = ''
               this.dayKeywordSecond = ''

           },
           //ページをクリックした際の数字変化メソッド
           clickCallback(num) {
               this.currentPage = Number(num);
           },
       
    }
};
</script>