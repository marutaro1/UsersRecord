import firebase from 'firebase';

    export const MixinUsersRecord = {
        data() {
            return {
                db: null,
                userRef: null,
                recordRef: null,
                staffRef: null,
                name: '',
                number: '',
                careLevel: '',
                birthday: '',
                roomCheck: '',
                users: {},
                day: new Date().getFullYear()  + 
                '-' +("00" + (new Date().getMonth() + 1)).slice(-2) + '-' + 
				("00" + (new Date().getDate())).slice(-2) + 'T' + ("00" + (new Date().getHours())).slice(-2) + ':' + '00',
                todayData: new Date().getFullYear()  + 
                '-' +("00" + (new Date().getMonth() + 1)).slice(-2) + '-' + 
				("00" + (new Date().getDate())).slice(-2),
                arrayDayData: [],
                record: '',
                records: {},
                newDay: '',
                newRecord: '',
                recordID: this._uid,
                dayRecords: {},
                parPage: 10,
                currentPage: 1,
                staffs: {},
                staffName: '',
                staffId: '',
                staffKey: '',
                displayStaffName: '',
                staffOfficialPosition: '',//ログインしたstaffのoffitialPositionを格納する値
                archives: {},
                authentication: '',
                manuel: '',
                manuelTitle: '',
                history: '',
                keyword: '',
                dayKeywordFirst: '',
                dayKeywordSecond: '',
                email: '',
                password: '',
                createStaffName: '',
                createEmail: '',
                createPassword: '',
                department: '',
                officialPosition: '',
                changeValue: false,//root pathで記録未登録者ボタンと切り替えるための値
            }
        },
        created() {
            this.db = firebase.firestore()
            this.usersRef = this.db.collection('users')
            this.recordRef = this.db.collection('users-record')
            this.staffRef = this.db.collection('staffs')
            this.getUsers()
           
            
            this._uid = Math.floor( Math.random(this._uid) * 100);
        },
        mounted() {
            firebase.auth().onAuthStateChanged(staff => {
                if(staff) {
                    this.authentication = true;
                    this.staffNameSeek(staff.uid)
                    
                } else {
                    this.authentication = false;
                }
            });
        },
        computed: {
            userProfile() {
                this.objectUsers()
                return this.users
            },
            age() {
                return function(a) {
                    var ageTime = Date.now() - new Date(a).getTime();
                    var ageDate = new Date(ageTime);
                    return ageDate.getUTCFullYear() - 1970;
                }
            },
            idToken() {
                return this.$store.getters.idToken;
            },

            //<------------------------- User.vue ---------------------------->
            usersLists() {
                this.usersList();
                return this.users;
            },
            sortNumber() {
                return this.usersLists.slice().sort((a, b) => {
                    return Number(a.value.number) - Number(b.value.number);
                });
            },
            //<--------------------------------------------------------------->
            
            //<------------------------- Records.vue ---------------------------->
            recordsLists() {
                this.recordsList();
                return this.records;
            },
            sortRecords(){
                return this.recordsLists.slice().sort((a, b) => {
                    return Number(new Date(a.value.day)) - Number(new Date(b.value.day));
                });
            },
            //日付逆転追加
            reverseSortRecords() {
                return this.sortRecords.slice().reverse();
            },
            //<--------------------------------------------------------------->
            
        },
        methods: {
            getUsers() {//user達のデータを取得する
                this.changeValue = false
                this.usersRef.doc('user').collection('user').onSnapshot(querySnapshot => {
                    const obj = {}
                    querySnapshot.forEach(doc => {
                    //querySnapshotが現在の全体のデータ
                        obj[doc.id] = doc.data()
                        //doc.idはランダムな文字列のid
                    })
                    this.users = obj
                });
            },
           
            // getUsers() {//user達のデータを取得する
            //     this.changeValue = false
            //     this.usersRef.onSnapshot(querySnapshot => {
            //         const obj = {}
            //         querySnapshot.forEach(doc => {
            //         //querySnapshotが現在の全体のデータ
            //             obj[doc.id] = doc.data()
            //             //doc.idはランダムな文字列のid
            //         })
            //         this.users = obj
            //     });
            // },
           
            objectUsers() {
                var arr = Object.entries(this.users)
                var result = arr.filter((value) => {
                    if (Number(value[1].number) === Number(this.id)) {
                        return value;
                    }
                })
                this.users = result
            },
            doLogin() {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(()=> this.$router.push("/"), alert('ログインしました'))
                .catch((e) => (this.error = e.message));
            },
            logOut() {
                firebase.auth().signOut()
                alert('ログアウトしました。')
                this.$router.go('/')
            },
            
            //<------------------------- SignUp.vue ---------------------------->
            staffNameSeek(staffID) {//ログインしているstaffの名前を取得する 
                    this.staffRef.doc('staff').collection(staffID).onSnapshot(querySnapshot => {
                        const obj = {}
                        querySnapshot.forEach(doc => {
                            //querySnapshotが現在の全体のデータ
                            obj[doc.id] = doc.data()
                        })
                        this.staffs = obj
                        this.staffKey = staffID
                        this.displayStaffName = this.staffs[staffID].staffName
                    });
                },
                signUp() {
                    //if(this.staffName === '' || this.email === '' || this.password === ''){ return }
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(res => {
                        this.staffNameAdd(res.user.uid)
                    });
                    alert('登録しました ※注意:現在、新しく登録した職員で自動的にログインしています')
                },
                staffNameAdd(staffID) {
                      this.staffRef.doc('staff').collection(staffID).doc(staffID).set({
                        staffName: this.staffName,
                        email: this.email,
                        password: this.password,
                        }).then(() => {
                            this.staffDepartment(this.department, staffID);
                        });
                },
                staffDepartment(department, staffID) {
                      this.staffRef.doc('staff').collection(department).doc(staffID).set({
                        staffName: this.staffName,
                        department: this.department,
                        officialPosition: this.officialPosition,
                        });
                },
            //<------------------------------------------------------------------>
            //day取得メソッド
            getDay(start, end) {
                var dayData = []
                //startDayからendDayまでの日付を入れる配列
                var startDate = new Date(start)
                var endDate = new Date(end)
                while (startDate < endDate) {
                    dayData = [...dayData, 
                        startDate.getFullYear()  +  '-' +("00" + (startDate.getMonth() + 1)).slice(-2)+ '-' + ("00" + (startDate.getDate())).slice(-2)]
                        startDate.setDate(startDate.getDate() + 1)
                        //startDayをdayData配列の中に入れ、+1日してwhileでendDayまでのループを回す
                        
                    }    
                    dayData = [...dayData, endDate.getFullYear() + '-' +("00" + (endDate.getMonth() + 1)).slice(-2)+ '-' + ("00" + (endDate.getDate())).slice(-2)]
                    this.arrayDayData = dayData;       
                    //dayData配列内にstartDayからendDayまでのデータが格納され、それをarrayDayDate(空の配列)内に入れ直す
                },
                //day空文字に変える
                dayclearString() {
                    this.dayKeywordFirst = '',
                    this.dayKeywordSecond = ''
                    
                },
                //ページをクリックした際の数字変化メソッド
                clickCallback(num) {
                    this.currentPage = Number(num);
                },
                
                //<------------------------- User.vue ---------------------------->
                usersList() {
                    const arr = Object.entries(this.users)
                    const result = arr.map(([key, value]) => ({key, value}))
                    this.users = result
                },   
                //<--------------------------------------------------------------->
                
                //<------------------------- Records.vue ---------------------------->
                recordsList() {
                    const arr = Object.entries(this.records)
                    const result = arr.map(([key, value]) => ({key, value}))
                    this.records = result
                 },
               
                //<--------------------------------------------------------------->
            }
        };