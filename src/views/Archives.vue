<template>
  <div @mousemove.once="getArchives">
  <hr>
  <h2>記録まとめ</h2>
  <label for="newArchive">更新用:</label>
    <textarea v-model="newArchive"></textarea>
    <hr>
    <div v-for="(rec,key) in archivesPost" :key="key">
      <hr>
      部屋番号: {{parseInt(rec.userNumber / 10)}}
      <br>
      名前: {{rec.userName}}
      <br>
      記録: {{rec.archive}}
      <br>
      <button @click="updateArchive(rec.userNumber)">更新</button>
    <button @click="deleteRecord(rec.userNumber)">削除</button>
    </div>
  </div>
</template>
<script>
  import { MixinUsersRecord } from '@/MixinUsersRecord.js';
  export default {
   mixins: [MixinUsersRecord],
   data() {
     return {
       newArchive: '',
       archivesPost: {}
     };
    },
    methods: {
      getArchives() {
         this.db.collection('users').doc('users-record').collection('archives').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                })
                this.archivesPost = obj
                console.log(this.archivesPost)
              })
      },
      updateArchive(No) {
        if(this.newArchive === ''){ return }
         this.db.collection('users').doc('users-record').collection('archives').doc(No).update({
             archive: this.newArchive
         }).then(res => {
                if(res === res) {
                alert('更新しました。');
                }
            });
     },
     deleteRecord(No) {
      this.db.collection('users').doc('users-record').collection('archives').doc(No).delete()
      .then(res => {
        if(res === res) {     
        alert('記録まとめから外しました。');
        }
      });
     }
    }
  };
</script>