<template>
    <div @mousemove.once="getManuel">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>マニュアル一覧</h3> 
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル追加</label> 
            <div class="col-10 col-lg-6">
                <textarea v-model="manuel" class="form-control"></textarea>
            </div>
            <button @click="addManuel(_uid)" class="btn btn-primary mt-2">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル更新</label>
            <div class="col-10 col-lg-6">
                <textarea v-model="newManuel" class="form-control"></textarea>
            </div>
        </div>
        <hr>
         <label class="col-3 col-form-label">キーワード検索:</label>
          <div class="col-6 mb-2">
            <vue-simple-suggest
            v-model="keyword"
            :list="manuelKeyword"
            :filter-by-query="true"
            class="form-control m-0 p-0">
            </vue-simple-suggest>
         </div>
         <hr>       
        <div class="col-12 scroll">
            <div v-for="(m,key) in serchManuel" :key="key">
            <p style="white-space:pre-wrap; word-wrap:break-word;">{{m.value.manuel}}</p>
    
            <button @click="updateManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 col-lg-1">更新</button>
            <button @click="deleteManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 col-lg-1 mx-1">削除</button>
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
       newManuel: '',
       manuelPost: {}
     };
    },
    components: {
       'vuejs-paginate': VuejsPaginate,   
       'vue-simple-suggest': VueSimpleSuggest,
    },
    computed: {
        manuelLists() {
            this.manuelList();
            return this.manuelPost;
        },
        //manuelListsからキーワード候補抽出
        manuelKeyword() {
            var keywordData = []
            var manuelNumber = this.manuelLists.length
            var i = 0
            while (i < manuelNumber) {
                keywordData = [...keywordData, this.manuelLists[i].value.manuel]
                i++
            }
            return keywordData;
    },
            
        serchManuel() {
            return this.manuelLists.filter(m => {
                return m.value.manuel.includes(this.keyword);
            });
        },
         //ページカウント
        pageCount() {
            return Math.ceil(this.serchManuel.length / this.parPage)
        },
        //ページ機能追加
        getHistoryPageData() {
            var current = this.currentPage * this.parPage;
            var start = current - this.parPage  
            return this.serchManuel.slice(start, current)
        }               
    },
    methods: {
         manuelList() {
               const arr = Object.entries(this.manuelPost)
               const result = arr.map(([key, value]) => ({key, value}))
               this.manuelPost = result
         },
        addManuel(uid) {
            if(this.manuel === ''){ return }
                this.usersRef.doc('user').collection('user').doc(this.userName).collection('manuel').doc(String(uid)).set({
                    manuel: this.manuel,
                    manuelID: uid
                }).then(() => {
                    this.manuel = ""
                    this._uid = Math.floor( Math.random(this._uid) * 100 )
                })
            alert('追加しました')
        },
        getManuel() {
             this.usersRef.doc('user').collection('user').doc(this.userName).collection('manuel').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.manuelPost = obj
              })
        },
        updateManuel(uid) {
             if(this.newManuel === ''){ return }
             this.usersRef.doc('user').collection('user').doc(this.userName).collection('manuel').doc(String(uid)).update({
                manuel: this.newManuel
            }).then(() => {
                this.newManuel = ''
            })
            alert('更新しました')
        },
        deleteManuel(uid) {
            this.usersRef.doc('user').collection('user').doc(this.userName).collection('manuel').doc(String(uid)).delete()
            alert('削除しました')
        },
         //ページをクリックした際の数字変化メソッド
        clickCallback(num) {
            this.currentPage = Number(num);
        },
    }
};
</script>