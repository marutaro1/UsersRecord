<template>
    <div @mousemove.once="getRecord">
       
        <router-link :to="'/User/' + id + '/UpdateUser'" class="btn btn-primary">利用者情報更新</router-link>
        <router-link :to="'/User/' + id + '/Manuel'" class="btn btn-primary mx-1">マニュアル</router-link>
        <router-link :to="'/User/' + id + '/MedicalHistory'" class="btn btn-primary">既往歴</router-link>
        <hr>
        <h3>記録</h3>
        <div class="m-0">
            <label class="col-2 col-form-label">日付: </label>
            <div class="col-8 col-lg-3">
                <input type="datetime-local" v-model="day" class="form-control">
            </div>
            <br>
            <label class="col-3 col-form-label">記録: </label>
            <div class="col-10 col-lg-6">
                <textarea v-model="record" class="form-control"></textarea>
            </div>
            <button @click="templateRecord" class="btn btn-primary mt-2">特変なし</button>
            <button @click="addRecords(_uid)" class="btn btn-primary mx-1 mt-2">追加</button>
            <button @click="testRecords" class="btn btn-primary mx-1 mt-2">testRecords</button>

        </div>
        <hr>
        <div>
            <h4>更新用フォーム</h4>
            <label class="col-2 col-form-label">日付: </label>
            <div class="col-8 col-lg-3">
                <input type="datetime-local"  v-model="newDay" class="form-control">
            </div>
            <br>
            <label class="col-3 col-form-label">記録: </label>
            <div class="col-10 col-lg-6">
                <textarea v-model="newRecord" class="form-control"></textarea>
            </div>
         </div>
         <hr>
         <label class="col-3 col-form-label">キーワード検索:</label>
         <div class="col-6 mb-2">
            <vue-simple-suggest
            v-model="keyword"
            :list="recordsKeyword"
            :filter-by-query="true"
            class="form-control m-0 p-0"
            autocomplete="off">
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

         <div class="scroll">
    

                <div v-for="(rec, key) in getPageData" :key="key">
                <p>{{rec.value.day}}</p>
                <p style="white-space:pre-wrap; word-wrap:break-word;">{{rec.value.record}}</p>
                <p>登録者: {{rec.value.staffName}}</p>

                <button @click="updateRecord(String(rec.value.recordID))" class="col-2 col-lg-1 btn btn-primary px-0">更新</button>
                <button @click="deleteRecord(String(rec.value.recordID))" class="col-2 col-lg-1 btn btn-primary px-0 mx-1">削除</button>
                <button @click="addArchives(rec.value.record)" class="col-7 col-lg-3 btn btn-primary px-0">
                『記録まとめ』へ上書き
                </button>
            
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
                :last-button-text="'>>'"
            >
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
       components: {
           'vuejs-paginate': VuejsPaginate,
           'vue-simple-suggest': VueSimpleSuggest,
       },
        computed: {
         
            //serchRecordsからキーワード候補抽出
            recordsKeyword() {
                var keywordData = []
                var recordNumber = this.serchRecords.length
                var i = 0
                while (i < recordNumber) {
                    keywordData = [...keywordData, this.serchRecords[i].value.record]
                    i++
                }
                return keywordData;
            },
            //日付指定追加
            serchDay() {
                return this.reverseSortRecords.filter(rec => {
                            this.getDay(this.dayKeywordFirst, this.dayKeywordSecond);
                            var customIncludes = (arr, target) => arr.some(el => target.includes(el));
                            //独自関数
                            return customIncludes(this.arrayDayData, rec.value.day);
                });
            },
            //キーワード検索追加
            serchRecords() {
                return this.reverseSortRecords.filter(rec => {
                        return rec.value.record.includes(this.keyword);
                });
            },
            //ページカウント
            pageCount() {
                 if(!!this.dayKeywordFirst && !!this.dayKeywordSecond) {
                   return Math.ceil(this.serchDay.length / this.parPage)
                 } else {
                   return Math.ceil(this.serchRecords.length / this.parPage)
                 }
           },
           //ページ機能追加
           getPageData() {
               var current = this.currentPage * this.parPage;
               var start = current - this.parPage
               if(!!this.dayKeywordFirst && !!this.dayKeywordSecond) {
                   return this.serchDay.slice(start, current)
               } else {
                   return this.serchRecords.slice(start, current)
               }               
           },
        },
        methods: {
         
            addRecords(uid) {
                if(this.day === '' || this.record === ''){ return }
                this.usersRef.doc('users-record').collection(this.userProfile[0][0]).doc(String(uid)).set({
                day: this.day,
                record: this.record,
                recordID: uid,
                staffName: this.displayStaffName
                }).then(
                    res => {
                    console.log(res);
                             
                      //alert('追加しました。')
                      this.getRecord()
                    }
                );
                this.day = new Date().getFullYear()  + 
                '-' +("00" + (new Date().getMonth() + 1)).slice(-2) + '-' + 
				("00" + (new Date().getDate())).slice(-2) + 'T' + ("00" + (new Date().getHours())).slice(-2) + ':' + '00',
                this.record = ''
                this._uid = Math.floor( Math.random(this._uid) * 100 )
            },
            deleteRecord(recID) {
                 this.usersRef.doc('users-record').collection(this.userProfile[0][0]).doc(recID).delete();
                 alert('削除しました')
                 this.getRecord() 
            },
            getRecord() {
              this.usersRef.doc('users-record').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                })
                this.records = obj
              });
            },
            updateRecord(recID) {
               if(this.newDay === '' || this.newRecord === ''){ return }
               this.usersRef.doc('users-record').collection(this.userProfile[0][0]).doc(recID).update({
                day: this.newDay,
                record: this.newRecord,
                staffName: this.displayStaffName
                });
               alert('更新しました');
               this.getRecord()
               this.newDay = ''
               this.newRecord = ''
            },
            addArchives(record) {
               this.usersRef.doc('users-record').collection('archives').doc(this.id).set({
                userName: this.userName,
                userNumber: this.id,
                archive: record
                });
                alert('追加しました');
            },
            templateRecord() {
                 const date1 = new Date();
                 const date2 = date1.getFullYear()  + '-' +
				("00" + (date1.getMonth() + 1)).slice(-2) + '-' + 
				("00" + (date1.getDate())).slice(-2)  + 'T' + '17' + ':' + '00';
                this.day = date2;
                this.record = '特変なし。';
            },

            testRecordValue(testValue) {
                 const date1 = new Date();
                 const date2 = date1.getFullYear()  + '-' +
				("00" + (date1.getMonth() + 1)).slice(-2) + '-' + 
				("00" + (date1.getDate())).slice(-2)  + 'T' + '17' + ':' + '00';
                this.day = date2;
                this.record = String(testValue);
            },
            
            //テスト用レコードデータ登録メソッド
            testRecords() {
                for (var i = 0; i < 1000; i++) {
                    this.testRecordValue(i);
                    this.addRecords(i);
                    console.log(i);
                }
            },
  
           

        }

    };
</script>