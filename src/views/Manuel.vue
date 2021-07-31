<template>
    <div @mousemove.once="getManuel">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル追加</label>
            <textarea v-model="manuel" class="form-control"></textarea>
            <br>
            <button @click="addManuel(_uid)" class="btn btn-primary ">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル更新</label>
            <textarea v-model="newManuel" class="form-control"></textarea>
        </div>
        <hr>
        <h3>マニュアル一覧</h3> 
         <label class="col-3 col-form-label">キーワード検索:</label>
         <div class="col-6 mb-2">
            <input type="text" v-model="keyword" class="form-control">
         </div>          
        <div class="col-12 scroll">
            <div v-for="(m,key) in serchManuel" :key="key">
            <p style="white-space:pre-wrap; word-wrap:break-word;">{{m.value.manuel}}</p>
    
            <button @click="updateManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 mt-2">更新</button>
            <button @click="deleteManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 mt-2 mx-1">削除</button>
            <hr>
            </div>
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    props: ['id'],
    mixins: [MixinUsersRecord],
    data() {
     return {
       newManuel: '',
       manuelPost: {}
     };
    },
    computed: {
        manuelLists() {
            this.manuelList();
            return this.manuelPost;
        },
        serchManuel() {
                return this.manuelLists.filter(m => {
                    return m.value.manuel.includes(this.keyword);
                });
        }
    },
    methods: {
         manuelList() {
               const arr = Object.entries(this.manuelPost)
               const result = arr.map(([key, value]) => ({key, value}))
               this.manuelPost = result
         },
        addManuel(uid) {
            if(this.manuel === ''){ return }
                this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).doc(String(uid)).set({
                    manuel: this.manuel,
                    manuelID: uid
                });
            alert('追加しました')
            this.manuel = ""
            this._uid = Math.floor( Math.random(this._uid) * 100 )
        },
        getManuel() {
              this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.manuelPost = obj
              })
        },
        updateManuel(manuelID) {
             if(this.newManuel === ''){ return }
            this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).doc(String(manuelID)).update({
                manuel: this.newManuel
            });
            alert('更新しました')
            this.newManuel = ''
        },
        deleteManuel(manuelID) {
                 this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).doc(String(manuelID)).delete();
                 alert('削除しました')
        }
    }
};
</script>