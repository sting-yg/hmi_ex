<template>
    <v-container>
        <v-row>
            <v-col>
                <LabelValueControl></LabelValueControl>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MonitoringStore } from '@/views/dev/stores/MonitoringStore';
import LabelKeyControl from '../common/LabelKeyControl.vue';
import LabelValueControl from '../common/LabelValueControl.vue';

export default defineComponent({

    components:{
        LabelKeyControl,
        LabelValueControl,
    },

    data:()=>({
        reStart: true,
        ossdSkip: false,
    }),

    computed:{

    },

    methods:{
        setTimeFormat(occurenceTime: string){
            
            const year: number = parseInt(occurenceTime)

        }
    }

})

</script>

<style scoped lang="scss">

</style>