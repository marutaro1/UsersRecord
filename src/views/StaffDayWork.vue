<template>
    <div class="mt-2">
        <h2>業務</h2>
        <label class="col-6 col-form-label">日付:</label>
         <div class="col-6 col-lg-3">
            <input type="date" v-model="today" class="form-control">
         </div>
        <label class="col-6 col-form-label">部署:</label>
        <div class="col-6 col-lg-2">
        <select v-model="departmentWorks" class="form-select form-select-sm">
            <option value="">選択してください</option>
            <option value="caregiver">介護</option>
            <option value="nurse">看護</option>
            <option value="rehabilitation">リハビリ</option>
            <option value="studentSupport">生活支援</option>
        </select>
        </div>
        <button @click="staffDataGet" class="mt-2 btn btn-warning">業務登録</button>
        <div v-if="staffOfficialPosition !== ''">
            <div>
                <label class="col-4 col-form-label">新規業務登録</label>
                <div class="col-6 col-lg-3">
                <select v-model="dailyWorkData.week" class="form-select form-select-sm mb-2">
                    <option value="">選択してください</option>
                    <option value="Sunday">日曜日</option>
                    <option value="Monday">月曜日</option>
                    <option value="Tuesday">火曜日</option>
                    <option value="Wednesday">水曜日</option>
                    <option value="Thursday">木曜日</option>
                    <option value="Friday">金曜日</option>
                    <option value="saturday">土曜日</option>
                </select>
                </div>
            </div>
            <div class="col-4 col-lg-5">
                <input type="text" v-model="dailyWorkData.dailyWork" class="form-control">
                <button @click="addDailyWork" class="btn btn-primary mt-2">追加</button>
            </div>
            <div>
                <label class="col-5 col-form-label"> {{today}} 曜日:</label>
                <div class="col-6 col-lg-3">
                <select v-model="weekData" class="form-select form-select-sm">
                        <option value="">選択してください</option>
                        <option value="Sunday">日曜日</option>
                        <option value="Monday">月曜日</option>
                        <option value="Tuesday">火曜日</option>
                        <option value="Wednesday">水曜日</option>
                        <option value="Thursday">木曜日</option>
                        <option value="Friday">金曜日</option>
                        <option value="saturday">土曜日</option>
                    </select>
                </div>
            </div>
            <div v-for="(staff, key) in checkStaffsPost" :key="key">
                <div @click="getDailyWork">
                    <label class="col-4 col-form-label">職員名:</label>
                    <div class="col-6 col-lg-5">
                        <select v-model="staff.staffName" class="form-select form-select-sm">
                            <option v-for="(name, key) in staffDatas" :key="key" :value="name.staffName">{{name.staffName}}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="col-4 col-form-label">PHS番号:</label>
                    <div class="col-4 col-lg-2">
                        <input type="text" v-model="staff.phs" class="form-control">
                    </div>
                </div>
                <div>
                    <label class="col-5 col-form-label">{{today}}:業務</label>
                    <div class="col-4 col-lg-3">
                        <select v-model="staff.work" size="2" class="form-select form-select-sm" multiple>
                            <option v-for="(work, key) in dailyWorks" :key="key" :value="work.dailyWorkData">{{work.dailyWorkData}}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="col-4 col-form-label">追加業務1:</label>
                    <div class="col-6 col-lg-6">
                        <input v-model="staff.additionalWorkOne" class="form-control">
                    </div>
                    <label class="col-4 col-form-label">追加業務2:</label>
                    <div class="col-6 col-lg-6">
                        <input v-model="staff.additionalWorkTwo" class="form-control">
                    </div>
                    <label class="col-4 col-form-label">追加業務3:</label>
                    <div class="col-6 col-lg-6">
                        <input v-model="staff.additionalWorkThree" class="form-control">
                    </div>  
                </div>
            
                <button v-if="!limitOver" @click="addStaffData" class="my-3 btn btn-primary">職員追加</button>
            </div>
            <button @click="addAllDailyWork" class="btn btn-warning">{{today}}:業務登録</button>
        </div>
        <hr>
        <button @click="getAllDailyWork" class=" mb-2 btn btn-primary">{{today}}:業務表示</button>
       
        <br>
        <router-view :dailyWorkAllData="this.dailyWorkAllData" :departmentWorks="this.departmentWorks" :today="this.today" :completeWorkGetData="this.completeWorkGetData" :staffCompleteWorkCheck="this.staffCompleteWorkCheck"></router-view>
        
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
                additionalWorkOne: '',
                additionalWorkTwo: '',
                additionalWorkThree: '',
            }],//staffDatasの中のstaffNameを格納している配列
            completeWorkGetData: {},
            dailyWorkAllData: {},//staffと業務を書き出し当路kすいたすべてのデータを格納するオブジェクト
            staffCompleteWorkCheck: {
                workCheck: [''],
                additionalWorkCheck: ['','',''],
                staffMemo: '',
            },
            count: 1,
            limit: 10,
            today: new Date().getFullYear()  + 
                '-' +("00" + (new Date().getMonth() + 1)).slice(-2) + '-' + 
				("00" + (new Date().getDate())).slice(-2),
        }
    },
    computed: {
     
        limitOver() {//登録するデータ件数(staffのデータ)がlimitを超えたとき
            return this.checkStaffsPost.length >= this.limit
        },
        allCountNumber() {//現在書き出したstaffデータの件数
            return this.checkStaffsPost.length
        },
    },
    methods: {
        staffDataGet() {//staff達のデータを取得するメソッド
            if(this.today === '' || this.departmentWorks === '') { return }
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
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).doc(this.today).set({
                checkStaffsPost: this.checkStaffsPost
            }).then(() => {
                this.addDocStaffName()
                this.getCompleteWork()
            })
        },
        addDocStaffName() {
            var i = 0
            while(i < Number(this.dailyWorkAllData[this.today].checkStaffsPost.length)) {
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).doc(this.today + 'completeWork').collection('complete').doc(this.dailyWorkAllData[this.today].checkStaffsPost[i].staffName).set({
                    workCheck: [''],
                    additionalWorkCheck: ['','',''],
                    staffMemo: '',
                })
                i++
            }
        },
        getCompleteWork() {
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          if(String(doc.id) !== String(this.today + 'completeWork')) { return }
                          obj[doc.id] = doc.data()
                      });
                      this.completeWorkGetData = obj
            });
        },
        getAllDailyWork() {//addAllDailyWorkに保存したデータを、日付ごとに取得し、その中で日付が選択した日付と合致するもののみをdailyWorkAllData(からのオブジェクト)に入れ込む
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).doc(this.today + 'completeWork').collection('complete').onSnapshot(querySnapshot => {
                var obj = {}
                    querySnapshot.forEach(doc => {
                        obj[doc.id] = doc.data()
                    });
                    console.log(obj)
                    this.staffCompleteWorkCheck = obj       
            });
            this.usersRef.doc('staffs').collection('daily-work-' + this.departmentWorks).onSnapshot(querySnapshot => {
                   const obj = {}
                      querySnapshot.forEach(doc => {
                          if(String(doc.id) !== String(this.today)) { return }
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
                additionalWorkOne: '',
                additionalWorkTwo: '',
                additionalWorkThree: '',
            }
        },
    }
};
</script>