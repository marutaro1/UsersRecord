<template>
    <div @mousemove.once="getRecord">
        <router-link :to="'/User/' + id + '/UpdateUser'">利用者情報更新</router-link>
        <h3>記録</h3>
        <label for="day">日付: </label>
        <input type="datetime-local" id="day" v-model="day">
        <br>
        <label for="record">記録: </label>
        <textarea id="record" v-model="record"></textarea>
        <p>{{_uid}}</p>
        <br>
        <button @click="getRecord">更新</button>
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
            <div v-for="(rec, key) in records" :key="key">
            <hr>
            {{rec.day}}
            <br>
            {{rec.record}}
            <p>登録者 {{rec.staffName}}</p>

            <button @click="updateRecord(String(rec.recordID));">更新</button>
            <button @click="deleteRecord(String(rec.recordID));">削除</button>
            <button @click="addArchives(rec.record)">
            『記録まとめ』へ上書き</button>
            </div>
         </div>
    </div>
</template>
<script>
    import firebase from 'firebase';
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id', 'userName'],
        mixins: [MixinUsersRecord],
        created() {
            this._uid = Math.floor( Math.random(this._uid) * 100 );
            firebase.auth().onAuthStateChanged(staff => {
                 this.staff = staff ? staff : {}
                 this.staffName = this.staff.displayName
                });
        },
        methods: {
            addRecords(uid) {
                if(this.day === '' || this.record === ''){ return }
                this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(String(uid)).set({
                day: this.day,
                record: this.record,
                recordID: uid,
                staffName: this.staffName
                }).then(
                    res => {
                    console.log(res);
                    if(res === res) {    
                             
                             alert('追加しました。')
                         }
                      this.getRecord()
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
                         this.getRecord()
                     }
                 );  
            },
            getRecord() {
              this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                })
                this.records = obj
              })
            },
           updateRecord(recID) {
               if(this.newDay === '' || this.newRecord === ''){ return }
               this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(recID).update({
                day: this.newDay,
                record: this.newRecord,
                staffName: this.staffName
                }).then(
                    res => {
                        if(res === res) {
                        alert('更新しました。');
                        }
                    this.getRecord()
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
             },
             checkB() {
                console.log(this.staffName)
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