<template>
  <div @mousemove.once="getArchives" class="mt-2">
  <h2>記録まとめ</h2>
  <label class="col-4 col-form-label">更新用:</label>
  <div class="col-10 col-lg-7">
    <textarea v-model="newArchive" class="form-control"></textarea>
  </div>
    <hr>
    <div class="scroll-archives">
      <div v-for="(rec,key) in archivesPost" :key="key">
        <p>部屋番号: {{parseInt(rec.userNumber / 10)}}</p>
        <p>名前:<router-link :to="'/User/' + rec.userNumber + '/Records'">{{rec.userName}}</router-link>様</p>
        <p style="white-space:pre-wrap; word-wrap:break-word;">記録: {{rec.archive}}</p>
        <button @click="updateArchive(rec.userName)" class="btn btn-primary mt-1">更新</button>
        <button @click="deleteArchive(rec.userName)" class="btn btn-primary mt-1 mx-1">まとめから削除</button>
        <hr>
      </div>
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
         this.recordRef.doc('archive').collection('archives').orderBy('userNumber').onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                })
                this.archivesPost = obj
              });
      },
      updateArchive(name) {
        if(this.newArchive === ''){ return }
         this.recordRef.doc('archive').collection('archives').doc(name).update({
             archive: this.newArchive
         }).then(() => {
          this.newArchive = '';
         })
        alert('更新しました。');
     },
     deleteArchive(name) {
      this.recordRef.doc('archive').collection('archives').doc(name).delete()
      alert('記録まとめから外しました。')
     }
    }
  };
</script>
<style>
  .scroll-archives {
     height: 450px;
     overflow: hidden;
     overflow-y: scroll;
  }
</style>