<template>
    <div>
        <div v-for="(user,key) in userProfile" :key="key">
           <h2 class="mt-2">利用者プロフィール</h2>
                <div class="text-right mb-2">
                    名前: {{user[1].name}} 様 &nbsp;
                    <br>
                    介護度: {{user[1].careLevel}} &nbsp;
                    部屋番号: {{parseInt(user[1].number / 10)}}
                    <br>
                    生年月日: {{user[1].birthday}} &nbsp;
                    年齢: {{age(user[1].birthday)}}歳 &nbsp;
                </div>

            <router-view :userName="user[1].name" :userBirthday="user[1].birthday"></router-view>
        </div>
    </div>
</template>
<script>
    import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props: ['id'],
        mixins: [MixinUsersRecord],
       
    };
</script>