import firebase from 'firebase';

    export const MixinUsersRecord = {
        data() {
            return {
                db: null,
                userRef: null,
                name: '',
                number: '',
                careLevel: '',
                birthday: '',
                roomCheck: '',
                users: {},
                day: new Date().getFullYear()  + 
                '-' +("00" + (new Date().getMonth() + 1)).slice(-2) + '-' + 
				("00" + (new Date().getDate())).slice(-2) + 'T' + ("00" + (new Date().getHours())).slice(-2) + ':' + '00',
                record: '',
                records: {},
                newDay: '',
                newRecord: '',
                recordID: this._uid,
                dayRecords: {},
                staffs: {},
                staffName: '',
                displayStaffName: '',
                archives: {},
                authentication: '',
                manuel: '',
                history: '',
                keyword: '',
                email: '',
                password: ''
            }
        },
        created() {
            this.db = firebase.firestore()
            this.usersRef = this.db.collection('users')
            this.usersRef.onSnapshot(querySnapshot => {
                const obj = {}
                querySnapshot.forEach(doc => {
                //querySnapshotが現在の全体のデータ
                    obj[doc.id] = doc.data()
                    //doc.idはランダムな文字列のid
                })
                this.users = obj
            });

          
            this._uid = Math.floor( Math.random(this._uid) * 100 );
        },
        mounted() {
            firebase.auth().onAuthStateChanged(staff => {
                if(staff) {
                    this.authentication = true;
                    this.staffNameSeek(staff.uid);
                    
                    
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
            
            
        },
        methods: {
            objectUsers() {
                const arr = Object.entries(this.users)
                const result = arr.filter((value) => {
                  if (Number(value[1].number) === Number(this.id)) {
                    return value;
                  }
                })
                this.users = result
            },
            doLogin() {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(() => this.$router.push("/"), alert('ログインしました'))
                .catch((e) => (this.error = e.message));
            },
            logOut() {
                firebase.auth().signOut()
                alert('ログアウトしました。')
                this.$router.go('/')
            },

            staffNameSeek(staffID) {
                this.usersRef.doc('staffs').collection(staffID).onSnapshot(querySnapshot => {
                    const obj = {}
                    querySnapshot.forEach(doc => {
                    //querySnapshotが現在の全体のデータ
                        obj[doc.id] = doc.data()
                    })
                    this.staffs = obj;
                    this.displayStaffName = this.staffs[staffID].staffName;
                });
            },
            
        }
    };