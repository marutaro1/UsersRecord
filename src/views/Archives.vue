<template>
    <div @mousemove.once="getArchives">
  <h2>記録まとめ</h2>
  
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
