<template>
    <div @mousemove.once="getTreatment">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>マニュアル一覧</h3> 
        <div class="col-12">
        <label class="col-2 col-form-label">日付: </label>
            <div class="col-8 col-lg-3">
                <input type="datetime-local" v-model="day" class="form-control">
            </div>
            <label class="col-form-label col-5">処置追加</label> 
            <div class="col-10 col-lg-6">
                <textarea v-model="treatment" class="form-control"></textarea>
            </div>
            <button @click="addTreatment(_uid)" class="btn btn-primary mt-2">追加</button>
        </div>
        <hr>
        <div class="col-12">
        <h4>更新フォーム</h4>
             <label class="col-2 col-form-label">日付: </label>
            <div class="col-8 col-lg-3">
                <input type="datetime-local" v-model="newDay" class="form-control">
            </div>

            <label class="col-form-label col-5">処置更新</label>
            <div class="col-10 col-lg-6">
                <textarea v-model="newTreatment" class="form-control"></textarea>
            </div>
        </div>
        <hr>
         <label class="col-3 col-form-label">キーワード検索:</label>
          <div class="col-6 mb-2">
            <vue-simple-suggest
            v-model="keyword"
            :list="treatmentKeyword"
            :filter-by-query="true"
            class="form-control m-0 p-0">
            </vue-simple-suggest>
         </div>
         <hr>       
        <div class="col-12 scroll">
            <div v-for="(t,key) in serchTreatment" :key="key">
            <p>{{t.value.day}}</p>
            <p style="white-space:pre-wrap; word-wrap:break-word;">{{t.value.treatment}}</p>
    
            <button @click="updateTreatment(t.value.treatmentID)" class="btn btn-primary px-0 col-2 col-lg-1">更新</button>
            <button @click="deleteTreatment(t.value.treatmentID)" class="btn btn-primary px-0 col-2 col-lg-1 mx-1">削除</button>
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
       newTreatment: '',
       treatmentPost: {}
     };
    },
    components: {
       'vuejs-paginate': VuejsPaginate,   
       'vue-simple-suggest': VueSimpleSuggest,
    },
    computed: {
        treatmentLists() {
            this.treatmentList();
            return this.treatmentPost;
        },
        //treatmentListsからキーワード候補抽出
        treatmentKeyword() {
            var keywordData = []
            var number = this.treatmentLists.length
            var i = 0
            while (i < number) {
                keywordData = [...keywordData, this.treatmentLists[i].value.treatment]
                i++
            }
            return keywordData;
    },
            
        serchTreatment() {
            return this.treatmentLists.filter(t => {
                return t.value.treatment.includes(this.keyword);
            });
        },
         //ページカウント
        pageCount() {
            return Math.ceil(this.serchTreatment.length / this.parPage)
        },
        //ページ機能追加
        getHistoryPageData() {
            var current = this.currentPage * this.parPage;
            var start = current - this.parPage  
            return this.serchTreatment.slice(start, current)
        }               
    },
    methods: {
         treatmentList() {
               const arr = Object.entries(this.treatmentPost)
               const result = arr.map(([key, value]) => ({key, value}))
               this.treatmentPost = result
         },
        addTreatment(uid) {
            if(this.treatment === ''){ return }
                this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatment').doc(String(uid)).set({
                    day: this.day,
                    treatment: this.treatment,
                    treatmentID: uid
                }).then(() => {
                    this.treatment = ""
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        getTreatment() {
             this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatment').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.treatmentPost = obj
              })
        },
        updateTreatment(uid) {
             if(this.newTreatment === ''){ return }
             this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatment').doc(String(uid)).update({
                treatment: this.newTreatment
            }).then(() => {
                this.newTreatment = ''
            })
            alert('更新しました')
        },
        deleteTreatment(uid) {
            this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatment').doc(String(uid)).delete()
            alert('削除しました')
        },
         //ページをクリックした際の数字変化メソッド
        clickCallback(num) {
            this.currentPage = Number(num);
        },
    }
};
</script>