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
            <input type="text" v-model="keyword" class="form-control">
         </div>
         <div class="scroll">
            <div v-for="(rec, key) in serchRecords" :key="key">
    
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
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id', 'userName'],
        mixins: [MixinUsersRecord],
       
        computed: {
            recordsLists() {
                this.recordsList();
                return this.records;
            },
            sortRecords(){
                return this.recordsLists.slice().sort((a, b) => {
                    return Number(new Date(a.value.day)) - Number(new Date(b.value.day));
                });
            },
            reverseSortRecords() {
                return this.sortRecords.slice().reverse();
            },
            serchRecords() {
                return this.reverseSortRecords.filter(rec => {
                    return rec.value.record.includes(this.keyword);
                });
            },
        },
        methods: {
            recordsList() {
               const arr = Object.entries(this.records)
               const result = arr.map(([key, value]) => ({key, value}))
               this.records = result
            },
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
                    if(res === res) {    
                             
                             alert('追加しました。')
                         }
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
             }
        }

    };
</script>