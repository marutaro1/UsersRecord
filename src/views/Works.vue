<template>
    <div>
     <div v-for="data in dailyWorkAllData[today]" :key="data.key">
            <div v-for="i in dailyWorkAllData[today].checkStaffsPost.length" :key="i">
                <p>職員名:{{data[i - 1 ].staffName}}</p>
                <p>PHS番号:{{data[i - 1 ].phs}}</p>
                <p>業務内容:</p>
                <router-link :to="'/StaffDayWork/' + data[i - 1].phs + '/StaffPage'">編集</router-link>
                <ul>
                    <li v-for="n in data[i - 1].work.length" :key="n">
                        {{data[i - 1 ].work[n - 1]}}
                    </li>
                    <li>
                        {{data[i - 1].additionalWorkOne}}
                    </li>
                    <li>
                        {{data[i - 1].additionalWorkTwo}}
                    </li>
                    <li>
                        {{data[i - 1].additionalWorkThree}}
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
        props:['today','dailyWorkAllData', 'departmentWorks'],
        mixins: [MixinUsersRecord],
    }
</script>