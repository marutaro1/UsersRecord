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
                newDay: '',
                newRecord: '',
                recordID: this._uid,
                dayRecords: {},
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
            })
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
            }
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
              }
        }
    };