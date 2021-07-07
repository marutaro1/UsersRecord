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
                users: {},
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
        }
    };