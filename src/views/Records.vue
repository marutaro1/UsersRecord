<template>
    <div @mousemove.once='getRecords'>
        <h3>記録</h3>
        <label for="day">日付: </label>
        <input type="datetime-local" id="day" v-model="day">
        <br>
        <label for="record">記録: </label>
        <textarea id="record" v-model="record"></textarea>
        <p>{{_uid}}</p>
        <br>
        <button @click="addRecords(_uid)">追加</button>
        <div v-for="rec in dayRecords" :key="rec.fields.recordID.stringValue">
        <hr>
        {{rec.fields.day.stringValue}}
        <br>
        {{rec.fields.record.stringValue}}
        {{rec.fields.recordID.integerValue}}

        <button @click="deleteRecord(rec.fields.recordID.integerValue)">削除</button>
        </div>
    </div>
</template>
<script>
    import axios from 'axios';
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id'],
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
                }).then(res => {
                    if(res === res) {    
                             this.$router.go()
                             alert('追加しました。')
                         }
                });
                this.day = '',
                this.record = ''
            },
            getRecords() {
                axios.get(
                'https://firestore.googleapis.com/v1/projects/users-record/databases/(default)/documents/users/users-record/' + this.userProfile[0][0],
                ).then(res => {
                this.dayRecords = res.data.documents;
                });
            },
            deleteRecord(recID) {
                 this.db.collection('users').doc('users-record').collection(this.userProfile[0][0]).doc(recID).delete().then(
                     res => {
                         if(res === res) {
                             this.$router.go()
                             alert('削除しました。')
                         }
                     }
                 );  
            }
        }

    };
</script>