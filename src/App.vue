<template>
  <div class="container">
    <div v-if="!authentication" style="margin-top: 20%;">
        <div class="col-11 bg-light p-3 mx-auto rounded-pill">
          <h2 class="col-12 text-center display-1 text-black-50">Users-Record</h2>
        </div>
        <div class="col-12 text-center">
          <label class="col-5 col-form-label">Eメール</label>
          <div class="col-7 mx-auto">
            <input type="text" v-model="email" class="form-control" placeholder="Eメール">
          </div>
          <br>

          <label class="col-5 col-form-label">パスワード</label>
          <div class="col-7 mx-auto">
            <input type="text" v-model="password" class="form-control" placeholder="パスワード">
          </div>
        </div>
        <div class="col-12 text-center mt-5 mx-auto">
          <button @click="doLogin" class="btn btn-primary col-5">ログイン</button>
        </div>
       

    </div>
   
    <div v-else>
      <nav class="navbar navbar-expand p-0 col-12">
        <ul class="nav nav-tabs col-7 col-lg-10 mt-0 py-1">
          <li class="nav-item"><router-link to="/" class="btn btn-info px-1 m-1">利用者一覧</router-link></li>
          <li class="nav-item"><router-link to="/NewUser" class="btn btn-info px-1 m-1">利用者登録</router-link></li>
          <li class="nav-item"><router-link to="/Archives" class="btn btn-info px-1 m-1">記録まとめ</router-link></li>
          <li class="nav-item"><router-link to="/SignUp" class="btn btn-info px-1 m-1">職員登録</router-link></li>
        </ul>
        <ul class="col-5 col-lg-2 pt-3">
          <li @click="logOut" class="btn btn-primary px-2">ログアウト</li>
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