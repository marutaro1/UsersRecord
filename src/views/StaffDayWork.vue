<template>
    <div>
        <h2>業務</h2>
        <label>日付</label>
        <input type="date" v-model="day">
        <label>部署</label>
        <select v-model="departmentWorks">
            <option value="">選択してください</option>
            <option value="caregiver">介護</option>
            <option value="nurse">看護</option>
        </select>
        <button @click="staffDataGet">業務登録</button>
        <div v-if="staffOfficialPosition !== ''">
            <div>
                <label>新規業務登録</label>
                <select v-model="dailyWorkData.week">
                    <option value="">選択してください</option>
                    <option value="Sunday">日曜日</option>
                    <option value="Monday">月曜日</option>
                    <option value="Tuesday">火曜日</option>
                    <option value="Wednesday">水曜日</option>
                    <option value="Thursday">木曜日</option>
                    <option value="Friday">金曜日</option>
                    <option value="saturday">土曜日</option>
                </select>
                <input type="text" v-model="dailyWorkData.dailyWork">
                <button @click="addDailyWork">追加</button>
            </div>
            <label> {{today}} 曜日:</label>
            <select v-model="weekData">
                    <option value="">選択してください</option>
                    <option value="Sunday">日曜日</option>
                    <option value="Monday">月曜日</option>
                    <option value="Tuesday">火曜日</option>
                    <option value="Wednesday">水曜日</option>
                    <option value="Thursday">木曜日</option>
                    <option value="Friday">金曜日</option>
                    <option value="saturday">土曜日</option>
                </select>
            <div v-for="(staff, key) in checkStaffsPost" :key="key">
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
            <button @click="addAllDailyWork">登録</button>
        </div>
        <hr>
        <button @click="getAllDailyWork">取得</button>
 
        <div v-for="data in dailyWorkAllData[day]" :key="data.key">
            <div v-for="i in dailyWorkAllData[day].checkStaffsPost.length" :key="i">
                <p>職員名:{{data[i - 1 ].staffName}}</p>
                <p>PHS番号:{{data[i - 1 ].phs}}</p>
                <p>業務内容:</p>
                <ul>
                <li v-for="n in data[i - 1].work.length" :key="n">
                    {{data[i - 1 ].work[n - 1]}}
                </li>
                <hr>
                </ul>
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
            staffDatas: {},//staffのデータを格納するオブジェクト
            dailyWorkData: {//新規業務に入力した値を格納する値
                week: '',
                dailyWork: ''
            }, //getDailyWork取得した値を格納するオブジェクト
            weekData: '',//曜日のデータを入れる値
            dailyWorks: {},//曜日ごとに登録した業務データを入れるオブジェクト
            departmentWorks: '',//何の部署に所属しているの選択肢あてはめる値
            checkStaffsPost: [{
                staffName: '',
                phs: '',
                work: [],
            }],//staffDatasの中のstaffNameを格納している配列
            dailyWorkAllData: {},//staffと業務を書き出し当路kすいたすべてのデータを格納するオブジェクト
            count: 1,
            limit: 10
        }
    },
    computed: {
     
        limitOver() {//登録するデータ件数(staffのデータ)がlimitを超えたとき
            return this.checkStaffsPost.length >= this.limit
        },
        allCountNumber() {//現在書き出したstaffデータの件数
            return this.checkStaffsPost.length
        }
    },
    methods: {
        staffDataGet() {//staff達のデータを取得するメソッド
            if(this.day === '' || this.departmentWorks === '') { return }
            this.usersRef.doc('staffs').collection(this.departmentWorks).onSnapshot(querySnapshot => {
                      const obj = {}
                      querySnapshot.forEach(doc => {
                          obj[doc.id] = doc.data()
                      });
                      this.staffDatas = obj
                      this.staffOfficialPosition = this.staffDatas[this.staffKey].officialPosition
                    });
        },
        addDailyWork() {//部署ごとにfirestoreにdocumentを作り、その中のcollectionにその業務の曜日名をつけ、データを保存する
            this.usersRef.doc('dailyWork-' + this.departmentWorks).collection(this.dailyWorkData.week).doc().set({
                dailyWorkData: this.dailyWorkData.dailyWork
            })
        },
        getDailyWork() {//addDailyWorkで保存したデータを一気に取得し、dailyWorks(空のオブジェクト)に入れ込む
            this.usersRef.doc('dailyWork-' + this.departmentWorks).collection(this.weekData).onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          obj[doc.id] = doc.data()
                      });
                      this.dailyWorks = obj
            });
        },
        addAllDailyWork() {//書き出したstaffのname/phs/workを、staffsのdocument→部署ごとのcollection→業務を行う日付のdocument内に登録する
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).doc(this.day).set({
                checkStaffsPost: this.checkStaffsPost
            })
        },
        getAllDailyWork() {//addAllDailyWorkに保存したデータを、日付ごとに取得し、その中で日付が選択した日付と合致するもののみをdailyWorkAllData(からのオブジェクト)に入れ込む
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          if(String(doc.id) !== String(this.day)) { return }
                          obj[doc.id] = doc.data()
                      });
                      console.log(obj)
                      this.dailyWorkAllData = obj
            });
        },
        addStaffData() {//登録するためのstaffのデータを追加するためのメソッド
            this.checkStaffsPost.push(this.independentObject())
            this.count++
        },
        removeStaffData(target) {//addStaffDataで追加したデータを削除するためのメソッド
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