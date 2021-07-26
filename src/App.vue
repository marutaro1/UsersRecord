<template>
  <div class="container">
    <div v-if="!authentication" style="margin-top: 50%;">
        <div class="col-11 bg-light p-3 mx-auto rounded-pill">
          <h2 class="col-12 text-center display-1  text-black-50">Users-Record</h2>
        </div>
        <div class="col-12 text-center mt-5 mx-auto">
          <p @click="doLogin" class="btn btn-primary col-4">ログイン</p>
        </div>
    </div>
    <div v-else>
      <nav class="navbar navbar-expand">
        <ul class="nav nav-tabs col-12">
          <li class="nav-item col-3"><router-link to="/" class="nav-link p-1 text-center small">利用者一覧</router-link></li>
          <li class="nav-item col-3"><router-link to="/NewUser" class="nav-link p-1 text-center small">利用者登録</router-link></li>
          <li class="nav-item col-3"><router-link to="/Archives" class="nav-link p-1 text-center small">記録まとめ</router-link></li>
          <li @click="logOut" class="nav-item nav-link col-3 p-1 text-center small">ログアウト</li>
        </ul>
      </nav>
      <router-view class="container"></router-view>
    </div>
  </div>
</template>

<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord]
    };
</script>
<style>
  .scroll {
        height: 300px;
        overflow: hidden;
        overflow-y: scroll;
    }
</style>