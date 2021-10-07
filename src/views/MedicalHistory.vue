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
        <hr>
        <div class="col-12 scroll">
       
            <div v-for="(h,key) in getHistoryPageData" :key="key">
                <p>発症日: {{h.value.dateOfOnset}}</p>
                <p>病名: {{h.value.history}}</p>
                <button @click="updateHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 col-lg-1">更新</button>
                <button @click="deleteHistory(h.value.historyID)" class="btn btn-primary px-0 col-2 col-lg-1 mx-1">削除</button>
                <hr>
            </div>
       </div>
       <vuejs-paginate
            :page-count="pageCount"
            :prev-text="'<'"
            :next-text="'>'"
            :click-handler="clickCallback"
            :container-class="'pagination justify-content-center'"
            :page-class="'page-item'"
            :page-link-class="'page-link'"
            :prev-class="'page-item'"
            :prev-link-class="'page-link'"
            :next-class="'page-item'"
            :next-link-class="'page-link'"
            :first-last-button="true"
            :first-button-text="'<<'"
            :last-button-text="'>>'">
        </vuejs-paginate>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
import VuejsPaginate from 'vuejs-paginate';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'
export default {
    props: ['id', 'userName'],
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
        'vuejs-paginate': VuejsPaginate,
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
             reverseSortHistory() {
                return this.sortHistory.slice().reverse();
            },
            serchHistory() {
                return this.reverseSortHistory.filter(rec => {
                    return rec.value.history.includes(this.keyword);
                });
            },
             //日付指定追加
            serchDay() {
                return this.reverseSortHistory.filter(rec => {
                            this.getDay(this.dayKeywordFirst, this.dayKeywordSecond);
                            var customIncludes = (arr, target) => arr.some(el => target.includes(el));
                            //独自関数
                            return customIncludes(this.arrayDayData, rec.value.dateOfOnset);
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
             //ページカウント
            pageCount() {
                 if(!!this.dayKeywordFirst && !!this.dayKeywordSecond) {
                   return Math.ceil(this.serchDay.length / this.parPage)
                 } else {
                   return Math.ceil(this.serchHistory.length / this.parPage)
                 }
           },
           //ページ機能追加
           getHistoryPageData() {
               var current = this.currentPage * this.parPage;
               var start = current - this.parPage
               if(!!this.dayKeywordFirst && !!this.dayKeywordSecond) {
                   return this.serchDay.slice(start, current)
               } else {
                   return this.serchHistory.slice(start, current)
               }               
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
                this.usersRef.doc('user').collection('user').doc(this.userName).collection('medical-history').doc(String(uid)).set({
                    dateOfOnset: this.dateOfOnset,
                    history: this.history,
                    historyID: uid
                }).then(() =>{
                    this.history = ""
                    this.dateOfOnset = ""
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        getHistory() {
            this.usersRef.doc('user').collection('user').doc(this.userName).collection('medical-history').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                });
                this.historyPost = obj
              })
             
        },
        updateHistory(uid) {
             if(this.newHistory === '' || this.newDateOfOnset === ''){ return }
            this.usersRef.doc('user').collection('user').doc(this.userName).collection('medical-history').doc(String(uid)).update({
                dateOfOnset: this.newDateOfOnset,
                history: this.newHistory
            }).then(() => {
                this.newDateOfOnset = ''
                this.newHistory = ''    
            })
            alert('更新しました')
        },
        deleteHistory(uid) {
                 this.usersRef.doc('user').collection('user').doc(this.userName).collection('medical-history').doc(String(uid)).delete();
                 alert('削除しました')
        },
       
       
    }
};
</script>