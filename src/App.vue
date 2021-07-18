<template>
  <div>
  <nav>
    <ul>
      <li><router-link to="/">利用者一覧</router-link></li>
      <li><router-link to="/NewUser">新規利用者登録</router-link></li>
      <li><router-link to="/Archives">記録まとめ</router-link></li>
      <li><router-link to="/Login">ログイン</router-link></li>
    </ul>
  </nav>
  <router-view>
  </router-view>
  </div>
</template>

<script>
</script>