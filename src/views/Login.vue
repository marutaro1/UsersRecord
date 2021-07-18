<template>
    <div>
        <h2>ログイン</h2>
        <button @click="doLogin">ログイン</button>
        <button @click="logOut">ログアウト</button>
    </div>
</template>
<script>
 
  import firebase from 'firebase';
    export default {
        methods: {
            doLogin() {
                var provider = new firebase.auth.GoogleAuthProvider()
                firebase.auth().signInWithPopup(provider)
            },
            logOut() {
                firebase.auth().signOut()
                alert('ログアウトしました。')
            }
        }
    };

</script>