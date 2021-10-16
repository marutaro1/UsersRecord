<template>
    <div @mousemove.once="getSelectTreatment">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>処置一覧</h3> 
        <div class="col-12">
            <div v-if="defaultBoolean">
                <button @click="inversionBoolean" class="btn btn-warning m-0 py-0 px-1">閉じる</button>
                <br>
                <label class="col-form-label col-5 mt-2">1:新規処置記録追加</label> 
                <div class="col-10 col-lg-6">
                    <textarea v-model="treatment" class="form-control"></textarea>
                </div>
                <button @click="addSelectTreatment(_uid)" class="btn btn-primary mt-1 py-0 px-1">追加</button>

                <br>

                <label class="col-form-label col-5">2:既存処置更新</label>
                <div class="col-10 col-lg-3">
                <label class="col-form-label col-5">元の内容:</label>
                <select class="form-control py-0 px-1" v-model="updateTreatment">
                    <option value="" selected="selected">選択してください</option>
                    <option v-for="(t, key) in treatmentPost" :key="key" :value="t.treatmentID">{{t.treatment}}</option>
                </select>
                </div> 
                <label class="col-form-label col-5">新しい内容:</label>
                <div class="col-10 col-lg-6">
                    <textarea v-model="newTreatment" class="form-control"></textarea>
                </div>
                <button @click="updateSelectTreatment(updateTreatment)" class="btn btn-primary mt-1 py-0 px-1">内容更新</button>
                <button @click="deleteSelectTreatment(updateTreatment)" class="btn btn-primary mt-1 py-0 px-1 mx-1">内容削除</button>
            </div>
    
            <div v-else>
                <button @click="inversionBoolean" class="btn btn-warning m-0 py-0 px-1">新規処置追加フォーム表示</button>
            </div>
        </div>
        <hr>
        <h4>処置登録</h4>
        <label class="col-2 col-form-label">日付: </label>
            <div class="col-8 col-lg-3">
                <input type="datetime-local" v-model="day" class="form-control">
            </div>
        <label class="col-2 col-form-label">処置選択</label>
            <div class="col-10 col-lg-3">
                <select v-model="selectTreatment" class="form-control">
                    <option value="" selected="selected">選択してください</option>
                    <option v-for="(t, key) in treatmentPost" :key="key" :value="t.treatment">{{t.treatment}}</option>
                </select>
            </div>
            <button @click="addTreatment(_uid)" class="btn btn-primary mt-2">登録</button>
        
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
        <div>
            <label lass="col-2 col-form-label">各月の記録抽出:</label>
            <div class="col-6 my-2">
                <input type="month" v-model="selectDayValue" class="form-control">
            </div>
             <button @click="getTreatment(selectDayValue)" class="btn btn-primary px-1">{{selectDayValue}}月分表示</button>
        </div>
         <hr>
          <div v-if="!selectDayValue">
            <h5>{{dayData}}月の記録</h5>
         </div>
         <div v-else>
           <h5>{{selectDayValue}}月の記録</h5>
         </div>     
        <div class="col-12 scroll" @mousemove.once="getTreatment(dayData)">
            <div v-for="(selectT, key) in getTreatmentPageData" :key="key">
                <p>{{selectT.value.day}}</p>
                <p>{{selectT.value.selectTreatment}}</p>
                <p>登録者:{{selectT.value.displayStaffName}}</p>
                <button @click="deleteTreatment(selectT.value.selectTreatmentID)" class="btn btn-primary mt-2">削除</button>
                <hr>
            </div>
            <hr>
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
         defaultBoolean: false,
         selectTreatment: '',
         treatmentPost: {},
         selectTreatmentPost: {},
         updateTreatment: '',
         newTreatment: '',
     };
    },
    components: {
       'vuejs-paginate': VuejsPaginate,   
       'vue-simple-suggest': VueSimpleSuggest,
    },
    computed: {
        treatmentLists() {
            this.treatmentList();
            return this.selectTreatmentPost;
        },
        //treatmentListsからキーワード候補抽出
        treatmentKeyword() {
            var keywordData = []
            var number = this.treatmentLists.length
            var i = 0
            while (i < number) {
                keywordData = [...keywordData, this.treatmentLists[i].value.selectTreatment]
                i++
            }
            return keywordData;
    },
            
        serchTreatment() {
            return this.reverseSortTreatment.filter(t => {
                return t.value.selectTreatment.includes(this.keyword);
            });
        },
         //ページカウント
        pageCount() {
            return Math.ceil(this.serchTreatment.length / this.parPage)
        },
        //ページ機能追加
        getTreatmentPageData() {
            var current = this.currentPage * this.parPage;
            var start = current - this.parPage  
            return this.serchTreatment.slice(start, current)
        },
          sortTreatment(){
                return this.treatmentLists.slice().sort((a, b) => {
                    return Number(new Date(a.value.day)) - Number(new Date(b.value.day));
                });
            },
            //日付逆転追加
            reverseSortTreatment() {
                return this.sortTreatment.slice().reverse();
            },             
    },
    methods: {
         inversionBoolean() {
             this.defaultBoolean = !this.defaultBoolean
         },
         treatmentList() {
               const arr = Object.entries(this.selectTreatmentPost)
               const result = arr.map(([key, value]) => ({key, value}))
               this.selectTreatmentPost = result
         },
        addSelectTreatment(uid) {//新規処置記録登録
            if(this.treatment === ''){ return }
                this.recordRef.doc('treatment').collection('treatments').doc(String(uid)).set({
                    treatment: this.treatment,
                    treatmentID: uid
                }).then(() => {
                    this.treatment = ''
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        getSelectTreatment() {//新規処置記録として登録した値をgetするメソッド
             this.recordRef.doc('treatment').collection('treatments').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.treatmentPost = obj
              })
        },


        updateSelectTreatment(uid) {
             this.recordRef.doc('treatment').collection('treatments').doc(String(uid)).update({
                    treatment: this.newTreatment,
                    treatmentID: uid
                }).then(() => {
                    this.newTreatment = ''
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        deleteSelectTreatment(uid) {
            this.recordRef.doc('treatment').collection('treatments').doc(String(uid)).delete()
            alert('削除しました')
        },
        addTreatment(uid) {//getSelectTreatmentで取得した値をひとつ選択し、その日の処置記録として登録するメソッド
            if(this.selectTreatment === ''){ return }
                this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatmentList').doc(String(uid)).set({
                    day: this.day,
                    selectTreatment: this.selectTreatment,
                    displayStaffName: this.displayStaffName,
                    selectTreatmentID: uid
                }).then(() => {
                    this.selectTreatment = ""
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        getTreatment(i) {
             var startDay = i + '-01'
             var endDay = i + '-31'
             this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatmentList').where('day', '>=', startDay).where('day', '<=', endDay).limit(150).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.selectTreatmentPost = obj
              })
        },
        deleteTreatment(uid) {
            this.usersRef.doc('user').collection('user').doc(this.userName).collection('treatmentList').doc(String(uid)).delete()
            alert('削除しました')
        },
         //ページをクリックした際の数字変化メソッド
        clickCallback(num) {
            this.currentPage = Number(num);
        },
    }
};
</script>