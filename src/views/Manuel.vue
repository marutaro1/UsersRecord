<template>
    <div @mousemove.once="getManuel">
        <router-link :to="'/user/' + id + '/Records'" class="btn btn-primary">記録へ戻る</router-link>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル追加</label>
            <textarea v-model="manuel" class="form-control"></textarea>
            <br>
            <button @click="addManuel" class="btn btn-primary ">追加</button>
        </div>
        <hr>
        <div class="col-12">
            <label class="col-form-label col-5">マニュアル更新</label>
            <textarea v-model="newManuel" class="form-control"></textarea>
        </div>
        <hr>
        <h3>マニュアル一覧</h3> 
        <hr>        
        <div class="col-12 scroll">
            <div v-for="(m,key) in manuelPost" :key="key">
            内容： {{m.manuel}}
            <br>
            <button @click="updateManuel(key)" class="btn btn-primary px-0 col-3 mt-2">更新</button>
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
    methods: {
        addManuel() {
            if(this.manuel === ''){ return }
                this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).doc(String(this._uid)).set({
                    manuel: this.manuel
                })
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
            this.db.collection('users').doc('manuel').collection(this.userProfile[0][0]).doc(manuelID).update({
                manuel: this.newManuel
            });
        }
    }
};
</script>