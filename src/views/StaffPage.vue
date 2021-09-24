<template>
    <div @mousemove.once="objectStaff">
      <h3>業務編集</h3>
      <router-link to="/StaffDayWork/Works">戻る</router-link>
      <div v-for="(plofile, key) in staffPlofile" :key="key">
        <p>{{plofile.staffName}}</p>
        <p>{{plofile.phs}}</p>
        <div v-for="i in plofile.work.length" :key="i">
            <p>{{plofile.work[i - 1]}}</p>
        <button @click="position(plofile.work[i - 1])">完了</button>
        </div>
        <p>{{plofile.additionalWorkOne}}</p>
        {{test}}
        <input type="text" v-model="plofile.additionalWorkOne">
        <button @click="position(plofile.additionalWorkOne)">完了</button>
        
        <p>{{plofile.additionalWorkTwo}}</p>
        <button @click="position(plofile.additionalWorkTwo)">完了</button>
        
       <p>{{plofile.additionalWorkThree}}</p>
        <button @click="position(plofile.additionalWorkThree)">完了</button>
       <button @click="addCompleteWork">登録</button>
      </div>
    </div>
</template>
<script>

import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id', 'today', 'dailyWorkAllData', 'departmentWorks', 'completeWorkGetData'],
        mixins: [MixinUsersRecord],
        data() {
            return {
                test: '',
                staffDatas: {},  
                completeWorksPost: [],
            }
        },
        computed: {
            staffPlofile() {
                this.objectStaff
                return this.staffDatas
            },
            getCompleteWorkDataList() {
                this.getWorkDataList()
                return this.completeWorkGetData
            }
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
            position(value) {
                value = value + '完了'
                this.completeWorksPost = [...this.completeWorksPost, value]
                console.log(this.completeWorksPost)
            },
              
            addCompleteWork() {
                var list = this.completeWorkGetData[this.today + 'completeWork'].completeWorks
                var post = this.completeWorksPost
                var strPost = post.join(' ')
                var strList = list
                this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).doc(this.today + 'completeWork').set({
                   completeWorks: (strList + '  ' + strPost).replace('undefined ', '')
                })
                console.log(list)
                console.log(strPost)
            }
        }
    }
</script>