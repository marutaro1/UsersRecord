<template>
    <div @mousemove.once="getRecords">
        <router-link :to="'/User/' + id + '/UpdateUser'">利用者情報更新</router-link>
        <h3>記録</h3>
        <label for="day">日付: </label>
        <input type="datetime-local" id="day" v-model="day">
        <br>
        <label for="record">記録: </label>
        <textarea id="record" v-model="record"></textarea>
        <p>{{_uid}}</p>
        <br>
        <button @click="getRecords">更新</button>
        <button @click="addRecords(_uid);">追加</button>
        <hr>
        <div>
            <h4>更新用フォーム</h4>
            <label for="newDay">日付: </label>
            <input type="datetime-local" id="newDay" v-model="newDay">
            <br>
            <label for="newRecord">記録: </label>
            <textarea id="newRecord" v-model="newRecord"></textarea>
         </div>
         <div id="scroll">
            <div v-for="(rec, key) in dayRecords" :key="key">
            <hr>
            {{rec.fields.day.stringValue}}
            <br>
            {{rec.fields.record.stringValue}}
            

            <button @click="updateRecord(rec.fields.recordID.integerValue);">更新</button>
            <button @click="deleteRecord(rec.fields.recordID.integerValue);">削除</button>
            <button @click="addArchives(rec.fields.record.stringValue)">
            『記録まとめ』へ上書き</button>
            </div>
         </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id', 'userName'],
        mixins: [MixinUsersRecord],
        created() {
            this._uid = Math.floor( Math.random(this._uid) * 100 );
        },
        methods: {
            addRecords(uid) {
                this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(String(uid)).set({
                day: this.day,
                record: this.record,
                recordID: uid
                }).then(
                    res => {
                    if(res === res) {    
                             
                             alert('追加しました。')
                         }
                      this.getRecords()
                    }
                );
                this.day = '',
                this.record = ''
                this._uid = Math.floor( Math.random(this._uid) * 100 )
            },
            deleteRecord(recID) {
                 this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(recID).delete().then(
                     res => {
                         if(res === res) { 
                             alert('削除しました。')
                         }
                         this.getRecords()
                     }
                 );  
            },
            getRecords() {
                axios.get(
                'https://firestore.googleapis.com/v1/projects/users-record/databases/(default)/documents/users/users-record/' + this.userProfile[0][0],
                ).then(res => {
                    this.dayRecords = res.data.documents;
                });
                console.log('get');
            },
            ge() {
                this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const ob = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    ob[this.RecordID] = doc.data()
                })
                this.dayRecords = ob
                console.log(this.dayRecords);
            })
            },
           updateRecord(recID) {
               this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(recID).update({
                day: this.newDay,
                record: this.newRecord
                }).then(
                    res => {
                        if(res === res) {
                        alert('更新しました。');
                        }
                    this.getRecords()
                    }
               );
               this.newDay = ''
               this.newRecord = ''
            },
            a() {
                var i = this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).id
                console.log(i);
                console.log(this.userProfile);
            },
             addArchives(record) {
               this.db.collection('users').doc('users-record').collection('archives').doc(this.id).set({
                userName: this.userName,
                userNumber: this.id,
                archive: record
                }).then(
                function() {
                    alert('追加しました');
                }
               );
             }
        }

    };
</script>
<style>
    #scroll {
        height: 200px;
        overflow: hidden;
        overflow-y: scroll;
    }
</style>