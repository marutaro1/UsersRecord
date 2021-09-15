<template>
    <div>
        <h2 @click="staffDataGet">{{today}}:業務</h2>
        <select v-model="departmentWorks">
            <option value="">選択してください</option>
            <option value="caregiver">介護</option>
            <option value="nurse">看護</option>
        </select>
        <div>
            <label>新規業務登録</label>
            <input type="text" v-model="dailyWorkData">
            <button @click="addDailyWork">追加</button>
        </div>
        <div v-for="(staff, key) in checkStaffsPost" :key="key">
        名前:{{staff}}
        key:{{key}}
        <div>
          
        </div>
            <div @click="getDailyWork">
                <p>職員名:</p>
                <select v-model="staff.staffName">
                    <option v-for="(name, key) in staffDatas" :key="key" :value="name.staffName">{{name.staffName}}</option>
                </select>
            </div>
            <div>
                <p>PHS番号:</p>
                <input type="text" v-model="staff.phs">
            </div>
            <div>
                <p>{{today}}業務:</p>
                <select v-model="staff.work" multiple>
                    <option v-for="(work, key) in dailyWorks" :key="key" :value="work.dailyWorkData">{{work.dailyWorkData}}</option>
                </select>
            </div>
            <button v-if="!limitOver" @click="addStaffData">追加</button>
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    mixins: [MixinUsersRecord],
    data() {
        return {
            staffDatas: {},//staffのデータを格納するオブジェクト
            dailyWorkData: '',//新規業務に入力した値を格納する値
            dailyWorks: {}, //getDailyWork取得した値を格納するオブジェクト
            departmentWorks: '',//何の部署に所属しているの選択肢あてはめる値
            checkStaffsPost: [{
                staffName: '',
                phs: '',
                work: [],
            }],//staffDatasの中のstaffNameを格納している配列
            
            count: 1,
            limit: 10
        }
    },
    computed: {
     
        limitOver() {
            return this.checkStaffsPost.length >= this.limit
        },
        allCountNumber() {
            return this.checkStaffsPost.length
        }
    },
    methods: {
        staffDataGet() {//staff達のデータを取得するメソッド
            this.usersRef.doc('staffs').collection(this.departmentWorks).onSnapshot(querySnapshot => {
                      const obj = {}
                      querySnapshot.forEach(doc => {
                          obj[doc.id] = doc.data()
                      });
                      this.staffDatas = obj
                    });
        },
        addDailyWork() {
            this.usersRef.doc('staffs').collection(this.departmentWorks + '-DailyWork').doc().set({
                dailyWorkData: this.dailyWorkData
            })
        },
        getDailyWork() {
            this.usersRef.doc('staffs').collection(this.departmentWorks + '-DailyWork').onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          obj[doc.id] = doc.data()
                      });
                      this.dailyWorks = obj
            });
        },
        addStaffData() {
            this.checkStaffsPost.push(this.independentObject())
            this.count++
        },
        removeStaffData(target) {
            this.checkStaffsPost.splice(target, 1)
            this.count--
        },
        independentObject() {
            return {
                staffName: '',
                phs: '',
                work: [],
            }
        },

    }
};
</script>