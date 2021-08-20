<template>
    <div @mousemove.once="getManuel">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <h3>マニュアル一覧</h3> 
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル追加</label> 
            <div class="col-10 col-lg-6">
                <textarea v-model="manuel" class="form-control"></textarea>
            </div>
            <button @click="addManuel(_uid)" class="btn btn-primary mt-2">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル更新</label>
            <div class="col-10 col-lg-6">
                <textarea v-model="newManuel" class="form-control"></textarea>
            </div>
        </div>
        <hr>
         <label class="col-3 col-form-label">キーワード検索:</label>
         <div class="col-6 mb-2">
            <input type="text" v-model="keyword" class="form-control">
         </div>          
        <div class="col-12 scroll">
            <div v-for="(m,key) in serchManuel" :key="key">
            <p style="white-space:pre-wrap; word-wrap:break-word;">{{m.value.manuel}}</p>
    
            <button @click="updateManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 col-lg-1">更新</button>
            <button @click="deleteManuel(m.value.manuelID)" class="btn btn-primary px-0 col-2 col-lg-1 mx-1">削除</button>
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
                this.usersRef.doc('manuel').collection(this.userProfile[0][0]).doc(String(uid)).set({
                    manuel: this.manuel,
                    manuelID: uid
                });
            alert('追加しました')
            this.manuel = ""
            this._uid = Math.floor( Math.random(this._uid) * 100 )
        },
        getManuel() {
              this.usersRef.doc('manuel').collection(this.userProfile[0][0]).onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                    obj[doc.id] = doc.data()
                })
                this.manuelPost = obj
              })
        },
        updateManuel(manuelID) {
             if(this.newManuel === ''){ return }
            this.usersRef.doc('manuel').collection(this.userProfile[0][0]).doc(String(manuelID)).update({
                manuel: this.newManuel
            });
            alert('更新しました')
            this.newManuel = ''
        },
        deleteManuel(manuelID) {
                 this.usersRef.doc('manuel').collection(this.userProfile[0][0]).doc(String(manuelID)).delete();
                 alert('削除しました')
        }
    }
};
</script>