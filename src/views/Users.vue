<template>
    <div class="mt-2">
        <h2>利用者一覧</h2>
        <label class="col-5 col-form-label">キーワード検索: </label>
        <div class="col-5">
           
            <vue-simple-suggest
            v-model="keyword"
            :list="usersKeyword"
            :filter-by-query="true"
            class="form-control m-0 p-0"
            autocomplete="off">
            </vue-simple-suggest>
        </div>
        <div>
        <label class="col-5 col-form-label">フロア検索: </label>
        <div class="col-6 col-lg-3">
            <select v-model="keyword" class="form-select form-select-sm">
                <option value="" selected="selected">選択してください</option>
                <option value="3F">3F</option>
                <option value="4F">4F</option>
                <option value="5F">5F</option>
                <option value="6F">6F</option>
                <option value="7F">7F</option>
                <option value="8F">8F</option>
                <option value="9F">9F</option>
                <option value="10F">10F</option>
            </select>
        </div>
        <label class="col-5 col-form-label">要介護度: </label>
        <div class="col-6 col-lg-3">
            <select v-model="keyword" class="form-select form-select-sm">
                <option value="" selected="selected">選択してください</option>
                <option value="自立">自立</option>
                <option value="要">要支援・要介護</option>
                <option value="要支援">要支援</option>
                <option value="要介護">要介護</option>
            </select>
        </div>
        <label class="col-5 col-form-label">最終記録登録日: </label>
        <div class="col-6 col-lg-3">
            <input type="date" v-model="checkDayKeyword" class="form-control">
        </div>
        <div v-if="!changeValue">
            <button @click="todayNotRegisteredRecord" class="btn btn-warning mt-2">{{day}}:記録未登録者</button>   
        </div>
        <div v-else>
            <button @click="getUsers" class="btn btn-primary mt-2">戻る</button>   
        </div>
        </div>
        <hr>
        <div class="scroll-user">       
           <div v-for="user in getPageData" :key="user.key">
           <table class="table col-1">
                <tr>
                <th class="text-rightr">
                    <router-link :to="'/User/' + user.value.number + '/Records'">{{user.value.name}}様</router-link>
                </th>
                </tr>
                <td class="text-right col-1">
                部屋番号: {{parseInt(user.value.number / 10)}}号室
                <br>
                年齢: {{age(user.value.birthday)}}歳
                <br>
                要介護度:{{user.value.careLevel}}
                <br>
                最終記録登録日: {{user.value.checkRecordDay}}
                </td>
            </table>
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
        mixins: [MixinUsersRecord],
        components: {
           'vuejs-paginate': VuejsPaginate,
           'vue-simple-suggest': VueSimpleSuggest,
        },
        data() {
            return {
                checkDayKeyword: ''//最終記録登録日確認のためのキーワード
            }
        },
        computed: {
            serchUsers() {
                return this.sortNumber.filter(user => {
                    return user.value.name.includes(this.keyword) ||
                     user.value.floor.includes(this.keyword) ||
                     user.value.careLevel.includes(this.keyword)
                });
            },
            serchCheckDay() {//checkDayKeywordに当てはまる最終記録登録日をサーチする
                return this.sortNumber.filter(user => {
                    return String(user.value.checkRecordDay).includes(this.checkDayKeyword)
                });
            },
            //serchUsersからキーワード候補抽出
            usersKeyword() {
                var keywordData = []
                var recordNumber = this.serchUsers.length
                var i = 0
                while (i < recordNumber) {
                    keywordData = [...keywordData, this.serchUsers[i].value.name]
                    i++
                }
                return keywordData;
            },
            //ページカウント
            pageCount() {
                   if(this.checkDayKeyword) {//checkDayKeywordがtrueなら↑のserchCheckDayの値にページをつける
                        return Math.ceil(this.serchCheckDay.length / this.parPage)
                   } else {//trueでないならserchUsersの値にページをつける
                        return Math.ceil(this.serchUsers.length / this.parPage)
                   }
           },
           //ページ機能追加
           getPageData() {//checkDayKeywordがtrueなら↑のserchCheckDayの値を表示
               var current = this.currentPage * this.parPage;
               var start = current - this.parPage
                   if(this.checkDayKeyword) {
                    return this.serchCheckDay.slice(start, current)
                   } else {//checkDayKeywordがfalseならserchUsersの値を表示
                    return this.serchUsers.slice(start, current)
                   }
            }              
        },
        methods:{
            todayNotRegisteredRecord() {
            this.changeValue = true
            this.usersRef.where('checkRecordDay', 'not-in', [this.todayData]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                    //doc.idはランダムな文字列のid
                })
                this.users = obj
            });

            }
        }


    };
</script>
<style>
    .scroll-user {
        height: 500px;
        overflow: hidden;
        overflow-y: scroll;
    }
</style>