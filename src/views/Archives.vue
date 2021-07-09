<template>
    <div @mousemove.once="getArchives">
  <h2>記録まとめ</h2>
  
   <hr>
    <label for="newArchive">更新用:</label>
    <textarea v-model="newArchive"></textarea>
    <hr>
   <div v-for="record of archivesPost" :key="record.userNumber">
   <label>部屋番号:</label>
    {{record.fields.userNumber.stringValue}}
    <br>
   <label>名前:</label>
    {{record.fields.userName.stringValue}}
    <br>
    <label>記録:</label>
    {{record.fields.archive.stringValue}}
    <br>
    <button @click="updateArchive(record.fields.userNumber.stringValue)">更新</button>
    <button @click="deleteRecord(record.fields.userNumber.stringValue)">削除</button>
    <hr>
   </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import { MixinUsersRecord } from '@/MixinUsersRecord.js';
  export default {
   mixins: [MixinUsersRecord],
   data() {
     return {
       newArchive: '',
       archivesPost: []
     };
   },
   methods: {
     getArchives() {
       axios.get(
         'https://firestore.googleapis.com/v1/projects/users-record/databases/(default)/documents/users/users-record/archives',
       ).then(res => {
         console.log(res.data.documents);  
         this.archivesPost = res.data.documents
     });
     },
     updateArchive(No) {
         this.db.collection('users').doc('users-record').collection('archives').doc(No).update({
             archive: this.newArchive
         }).then(res => {
                alert('更新しました。');
                if(res === res) {
                this.$router.go();
                }
            });
     },
     deleteRecord(No) {
      this.db.collection('users').doc('users-record').collection('archives').doc(No).delete()
      .then(res => {
        if(res === res) {
          this.$router.go();     
        }
        alert('記録まとめから外しました。');
      });
     }
    }
  }
</script>
