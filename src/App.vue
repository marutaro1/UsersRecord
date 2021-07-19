<template>
  <div>
  <nav>
    <ul>

      <li><router-link to="/">利用者一覧</router-link></li>
      <li><router-link to="/NewUser">新規利用者登録</router-link></li>
      <li><router-link to="/Archives">記録まとめ</router-link></li>
      <li v-if="authentication" @click="logOut">ログアウト</li>
      <li v-else @click="doLogin">ログイン</li>
    </ul>
  </nav>
  <router-view>
  </router-view>
  </div>
</template>

<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord]
    };
</script>