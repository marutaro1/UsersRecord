<template>
    <div>
      <h3>業務編集</h3>
      <router-link to="/StaffDayWork/Works" class="btn btn-primary p-1">戻る</router-link>
      <div v-for="(plofile, key) in staffPlofile" :key="key">
        <div @mousemove.once="getWorkCheckChange(plofile.staffName)">
            <p>職員名:{{plofile.staffName}}</p>
            <p>PHS番号:{{plofile.phs}}</p>
            <div v-for="i in plofile.work.length" :key="i">
            <p>業務:{{plofile.work[i - 1]}}:{{workCheck[i - 1]}}
            <button @click="workCheckChange([i - 1])" class="btn btn-primary p-1">
                <div v-if="!workCheck[i - 1]">完了</div>
                <div v-else>未遂</div>
            </button>
            </p>
        </div>
        </div>
        <p>業務:{{plofile.additionalWorkOne}}:{{additionalWorkCheck[0]}}
        <button @click="additionalWorkCheckChange([0])" class="btn btn-primary p-1">
            <div v-if="!additionalWorkCheck[0]">完了</div>
            <div v-else>未遂</div>
        </button>
        </p>
        <p>業務:{{plofile.additionalWorkTwo}}:{{additionalWorkCheck[1]}}
        <button @click="additionalWorkCheckChange([1])" class="btn btn-primary p-1">
            <div v-if="!additionalWorkCheck[1]">完了</div>
            <div v-else>未遂</div>
        </button>
        </p>
       <p>業務:{{plofile.additionalWorkThree}}:{{additionalWorkCheck[2]}}
        <button @click="additionalWorkCheckChange([2])" class="btn btn-primary p-1">
            <div v-if="!additionalWorkCheck[2]">完了</div>
            <div v-else>未遂</div>
        </button>
        </p>
        <div>
            <label class="col-2 col-form-label">メモ:</label>
            <div class="col-lg-5 col-8">
                <textarea v-model="staffMemo" class="form-control"></textarea>
            </div>
        </div>
       <button @click="addWorkCheckChange(plofile.staffName)" class="my-2 btn btn-primary">登録</button>
      
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id', 'today', 'dailyWorkAllData', 'departmentWorks', 'staffCompleteWorkCheck'],
        mixins: [MixinUsersRecord],
        data() {
            return {
                staffDatas: {},  
                workCheck: [''],
                additionalWorkCheck: ['', '', ''],
                staffMemo: '',
            }
        },
        computed: {
            staffPlofile() {
                this.objectStaff()
                return this.staffDatas
            },
        },
        methods: {
               objectStaff() {
                var arr = Object.entries(this.dailyWorkAllData[this.today])
                var data = arr[0][1]
                console.log(data)
                var result = data.filter((value) => {
                    if (Number(value.phs) === Number(this.id)) {
                        return value;
                    }
                })
                this.staffDatas = result
            },
            workCheckChange(i) {
                if(!this.workCheck[i]) {
                   Vue.set(this.workCheck, i, '完了')
                    console.log(this.workCheck)
                } else {
                   Vue.set(this.workCheck, i, '')
                    console.log(this.workCheck)
                }
            },
            additionalWorkCheckChange(i) {
                if(this.additionalWorkCheck[i] === '') {
                   Vue.set(this.additionalWorkCheck, i, '完了')
                    console.log(this.additionalWorkCheck)
                } else {
                   Vue.set(this.additionalWorkCheck, i, '')
                    console.log(this.additionalWorkCheck)
                }  
            },
            addWorkCheckChange(staffName) {
                 this.staffRef.doc('staff').collection('daily-work-' + this.departmentWorks).doc(this.today + 'completeWork').collection('complete').doc(staffName).set({
                   workCheck: this.workCheck,
                   additionalWorkCheck: this.additionalWorkCheck,
                   staffMemo: this.staffMemo
                }).then(() => 
                    this.$router.push("/StaffDayWork/Works"),
                    alert('完了業務を登録しました。')
                 )
            },
            getWorkCheckChange(staffName) {
                 this.staffRef.doc('staff').collection('daily-work-' + this.departmentWorks).doc(this.today + 'completeWork').collection('complete').onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          if(doc.id !== staffName) {return}
                          obj[doc.id] = doc.data()
                      });
                      console.log(obj)
                      console.log(obj[staffName].workCheck)
                      this.workCheck = obj[staffName].workCheck
                      console.log(obj[staffName].additionalWorkCheck)
                      this.additionalWorkCheck = obj[staffName].additionalWorkCheck
                      this.staffMemo = obj[staffName].staffMemo
                });
            }
        }
    }
</script>