<template>
  <div class="container">
    <div v-if="!authentication" style="margin-top: 20%;">
        <div class="text-center">
          <img :src="iconPath" class="col-2 col-lg-1 mb-1">
        </div>

          <h2 class="text-center text-black-50">Users-Record</h2>
      
        <div class="text-center">
          <label class="col-5 col-form-label">Eメール</label>
          <div class="col-6 col-lg-3 mx-auto">
            <input type="text" v-model="email" class="form-control" placeholder="Eメール">
          </div>

          <label class="col-5 col-form-label">パスワード</label>
          <div class="col-6 col-lg-3 mx-auto">
            <input type="text" v-model="password" class="form-control" placeholder="パスワード">
          </div>
          <div class="col-12 mt-4 mx-auto">
            <button @click="doLogin" class="btn btn-primary col-5 col-lg-2">ログイン</button>
          </div>
        </div>
       

    </div>
   
    <div v-else>
      <nav class="navbar navbar-expand p-0 col-12">
        <ul class="nav nav-tabs col-7 col-lg-10 mt-0 py-1">
          <li class="nav-item"><router-link to="/" class="btn btn-primary m-1" style="font-size: small;">利用者一覧</router-link></li>
          <li class="nav-item"><router-link to="/NewUser" class="btn btn-primary m-1" style="font-size: small;">利用者登録</router-link></li>
          <li class="nav-item"><router-link to="/Archives" class="btn btn-primary m-1" style="font-size: small;">記録まとめ</router-link></li>
          <li class="nav-item"><router-link to="/SignUp" class="btn btn-primary m-1" style="font-size: small;">職員登録</router-link></li>
          <li class="nav-item"><router-link to="/StaffDayWork/Works" class="btn btn-primary m-1" style="font-size: small;">業務確認</router-link></li>
        </ul>
        <ul class="col-5 col-lg-2 pt-3 text-center">
          <li @click="logOut" class="btn btn-warning p-2">ログアウト</li>
        </ul>
      </nav>
      <router-view class="container"></router-view>
    </div>
  </div>
</template>

<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        mixins: [MixinUsersRecord],
        data() {
          return {
            iconPath: require('@/assets/users-record-logo.png')
          }
        }
    };
</script>
<style>
  .scroll {
        height: 300px;
        overflow: hidden;
        overflow-y: scroll;
  }
</style>