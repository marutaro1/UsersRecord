<template>
    <div>
        <h2 class="mt-2">職員登録画面</h2>
        <div>
            <label class="col-4 col-form-label">新規職員名:</label>
            <div class="col-4 col-lg-2">
            <input type="text" v-model="staffName" class="form-control" placeholder="職員名">
            </div>
            <br>
            <label class="col-4 col-form-label">部署:</label>
            <div class="col-6 col-lg-2">
                <select v-model="department" class="form-select form-select-sm">
                    <option value="">選択してください</option>
                    <option value="caregiver">介護</option>
                    <option value="nurse">看護</option>
                    <option value="rehabilitation">リハビリ</option>
                    <option value="studentSupport">生活支援</option>
                </select>
            </div>
            <br>
            <label class="col-4 col-form-label">役職:</label>
            <div class="col-6 col-lg-2">
                <select v-model="officialPosition" class="form-select form-select-sm">
                    <option value="" selected="selected">選択してください</option>
                    <option value="leader">リーダー</option>
                    <option value="chief">主任</option>
                    <option value="chiefclerk">係長</option>
                    <option value="sectionchief">課長</option>
                </select>
            </div>

            <br>
            
            <label class="col-4 col-form-label">Eメール:</label>
            <div class="col-7 col-lg-3">
            <input type="text" v-model="email" class="form-control" placeholder="Eメール">
            </div>
    
            <br>
            
            <label class="col-4 col-form-label">パスワード:</label>
            <div class="col-7 col-lg-3">
            <input type="text" v-model="password" class="form-control" placeholder="パスワード">
            </div>

            <br>

            <button @click="signUp" class="btn btn-primary">登録</button>
        </div>
        <div>
            <div>
            </div>
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
export default {
    mixins: [MixinUsersRecord],
   
        
};
</script>