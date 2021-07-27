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
                day: '',
                record: '',
                records: {},
                newDay: '',
                newRecord: '',
                recordID: this._uid,
                dayRecords: {},
                staffName: '',
                archives: {},
                authentication: '',
                manuel: '',
                history: '',
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

            firebase.auth().onAuthStateChanged(staff => {
                this.staff = staff ? staff : {}
                this.staffName = this.staff.displayName
                
            });
            this._uid = Math.floor( Math.random(this._uid) * 100 );
        },
        mounted() {
            firebase.auth().onAuthStateChanged(staff => {
                if(staff) {
                    console.log('login');
                    this.authentication = true;
                } else {
                    console.log('logout');
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
                var provider = new firebase.auth.GoogleAuthProvider()
                firebase.auth().signInWithPopup(provider)
            },
            logOut() {
                firebase.auth().signOut()
                alert('ログアウトしました。')
                this.$router.go('/')
            }
        }
    };