<template>
    <div>
     <div v-for="data in dailyWorkAllData[today]" :key="data.key">
            <div v-for="i in dailyWorkAllData[today].checkStaffsPost.length" :key="i">
                <p>職員名:{{data[i - 1 ].staffName}}</p>
                <p>PHS番号:{{data[i - 1 ].phs}}</p>
                <router-link :to="'/StaffDayWork/' + data[i - 1].phs + '/StaffPage'" class="btn btn-primary p-1">編集</router-link>
                <ul>
                    <li v-for="n in data[i - 1].work.length" :key="n">
                        <p>{{data[i - 1 ].work[n - 1]}}:
                        {{staffCompleteWorkCheck[data[i - 1].staffName].workCheck[n - 1]}}</p>
                    </li>
                    <li>
                        <p>{{data[i - 1].additionalWorkOne}}:
                        {{staffCompleteWorkCheck[data[i - 1].staffName].additionalWorkCheck[0]}}</p>
                    </li>
                    <li>
                        <p>{{data[i - 1].additionalWorkTwo}}:
                        {{staffCompleteWorkCheck[data[i - 1].staffName].additionalWorkCheck[1]}}</p>
                        
                    </li>
                    <li>
                        <p>{{data[i - 1].additionalWorkThree}}:
                        {{staffCompleteWorkCheck[data[i - 1].staffName].additionalWorkCheck[2]}}</p>
                       
                    </li>
                    <li>
                        <p>メモ:</p>
                        <p style="white-space:pre-wrap; word-wrap:break-word;">{{staffCompleteWorkCheck[data[i - 1].staffName].staffMemo}}</p>
                       
                    </li>
                    
                </ul>
                <hr>
            </div>
        </div>
    </div>
</template>
<script>
import { MixinUsersRecord } from '@/MixinUsersRecord.js';
    export default {
        props:['today','dailyWorkAllData', 'staffCompleteWorkCheck'],
        mixins: [MixinUsersRecord],
      
    }
</script>