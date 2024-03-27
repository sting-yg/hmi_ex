<template>
    <v-container fluid class="pa-0 h-100">
        <SvgMonView @receivedEvent="receiveEmit" :isFitScene="_isFitScene" />
        <v-card class="pa-1 ma-0 rounded-0 bg-primary" elevation="1">
            <v-btn class="bg-transparent text-white" @click="onFitScene">
                <v-icon size="25">mdi-arrow-expand-all</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>화면크기 초기화</span></v-tooltip>
            </v-btn>  
            <v-btn class="bg-transparent text-white" @click="onToggleShowGrid">
                <v-icon size="25">mdi-grid</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>{{ !showGrid? '그리드표시' : '그리드숨기기' }}</span></v-tooltip>
            </v-btn>  
            <v-btn class="bg-transparent text-white" @click="onToggleCameraScanData">
                <v-icon size="25">mdi-dots-triangle</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>{{ !showCameraScanRawData? '카메라 데이터 표시':'카메라데이터 숨기기' }}</span></v-tooltip>
            </v-btn>  
            <v-btn class="bg-transparent text-white" @click="onToggleLidarScanData">
                <v-icon size="25">mdi-dots-hexagon</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>{{ !showLidarScanRawData? '라이다 데이터 표시':'라이다 데이터 숨기기' }}</span></v-tooltip>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onToggleShowNode">
                <v-icon size="25">mdi-ray-start-end</v-icon>
                <v-tooltip activator="parent" location="bottom"><span></span></v-tooltip>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onToggleFixEyeOnSelectedDevice">
                <v-icon size="25" v-if="showFixEyeOnSelectedDevice">mdi-eye-lock</v-icon>
                <v-icon size="25" v-if="!showFixEyeOnSelectedDevice">mdi-eye</v-icon>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onChartPanel">
                <v-icon size="25">mdi-chart-line</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>차트조회</span></v-tooltip>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onUpdateAppChameleon" style="float: right;">
                <div>
                    <v-icon>{{ batteryIcon }}</v-icon>
                    <span style="font-size: 10px;">{{ typeof(batterySoc) === 'number' ? batterySoc+'%':'' }}</span>
                </div>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onUpdateAppChameleon" style="float: right;">
                <v-icon >mdi-download</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>Chameleon version update</span></v-tooltip>
            </v-btn>
            <v-btn class="bg-transparent text-white" @click="onUpdateAppTm" style="float: right;">
                <v-icon>mdi-download</v-icon>
                <v-tooltip activator="parent" location="bottom"><span>TM version update</span></v-tooltip>
            </v-btn>
        </v-card>     
        <!-- unit control expansion panel -->
        <!-- state info expansion panel -->
        <v-container  class="pa-0 pl-1 layout-side-area">
            <v-expansion-panels multiple style="width: 300px;">
                <v-expansion-panel rounded="0" class="w-100 pa-0 ma-0">
                    <v-expansion-panel-title class="bg-indigo text-white font-weight-bold">
                        ControlStatus
                    </v-expansion-panel-title>      
                    <v-expansion-panel-text>
                        <v-row class="" v-for="(item, index) in displayControllerStatus" :key="index">
                            <v-col cols="6" class="d-flex justify-start">{{ item.key }}</v-col>
                            <v-col cols="6" class="d-flex justify-end">{{ item.value }}</v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel class="pt-1" rounded="0">
                    <v-expansion-panel-title class="bg-indigo text-white font-weight-bold">
                        RobotStatus
                    </v-expansion-panel-title>      
                    <v-expansion-panel-text>
                        <v-row v-for="(item, index) in displayRobotStatus" :key="index">
                            <v-col cols="6" class="d-flex justify-start">{{ item.key }}</v-col>
                            <v-col cols="6" class="d-flex justify-end">{{ item.value }}</v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
                <v-expansion-panel class="pt-1" rounded="0">
                    <v-expansion-panel-title class="bg-indigo text-white font-weight-bold">
                        TaskStatus
                    </v-expansion-panel-title>      
                    <v-expansion-panel-text>
                        <v-row v-if="taskStatus">
                            <v-col cols="8">
                                <span style="display: block;">{{ "Task ID: " + taskStatus.taskInstanceId }}</span>
                                <span style="display: block;">{{ "Start Poi: " + taskStatus.startNodeName }}</span>
                                <span style="display: block;">{{ "Target Poi: " + taskStatus.targetNodeName }}</span>
                            </v-col>
                            <v-col cols="4" class="d-flex justify-end align-center">
                                <v-btn><v-icon>mdi-download</v-icon>Save</v-btn>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-container>
        <!-- unit control expansion panel -->
        <v-container  class="pa-0 layout-side-area" style="right:2px">
            <v-expansion-panels multiple style="width: 300px;">
                    <v-expansion-panel rounded="0" class="">
                        <v-expansion-panel-title class="bg-indigo font-weight-bold">Emulator</v-expansion-panel-title> 
                        <v-expansion-panel-text>
                            <EmulatorPanelVue/>
                        </v-expansion-panel-text>
                    </v-expansion-panel>        
            </v-expansion-panels>
        </v-container>
    </v-container>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { MonitoringStore } from '@/views/dev/stores/MonitoringStore';
import SvgMonView from '@/views/dev/view/SvgMonView.vue';
import LabelKeyControl from '@/views/dev/view/common/LabelKeyControl.vue';
import EmulatorPanelVue from '@/views/dev/view/panel/EmulatorPanel.vue'
import { TaskStatus } from '@/views/hmi/model/Status/TaskStatus';

export default defineComponent({

    components:{
        SvgMonView,
        LabelKeyControl,
        EmulatorPanelVue,

    },

    data: ()=>({
        _currentEditNode: null,
        _isFitScene: false,
    }),
    
    computed:{
        
        showGrid(){
            return MonitoringStore().showGrid;
        },
        showCameraScanRawData() {
            return MonitoringStore().showCameraScanRawData;
        },
        showLidarScanRawData() {
            return MonitoringStore().showLidarScanRawData;
        },
        showFixEyeOnSelectedDevice(){
            return MonitoringStore().fixEyeOnSelectedDevice;
        },
        displayControllerStatus(){
            return MonitoringStore().activeStatus?.ControllerStatus.displayControllerStatus;
        },
        displayRobotStatus(){
            return MonitoringStore().activeStatus?.RobotStatus.displayRobotStatus;
        },
        displayTaskStatus(){
            return MonitoringStore().activeStatus?.TaskStatus.displayTaskStatus;
        },
        taskStatus() {
            return MonitoringStore().activeStatus?.TaskStatus;
        },
        onToggleShowGrid(){

        },
        onToggleCameraScanData(){

        },
        onToggleLidarScanData(){

        },
        onToggleShowNode(){

        },
        onToggleFixEyeOnSelectedDevice(){

        },

        batterySoc() {
            return MonitoringStore().activeStatus?.BatteryStatus.powerSupplyStatus ?
                   MonitoringStore().activeStatus?.BatteryStatus.powerSupplyStatus : 0;
        },
        batteryIcon() {
            if (MonitoringStore().activeStatus?.ControllerStatus.chargeState === 1 ||
                MonitoringStore().activeStatus?.ControllerStatus.chargeState === 2)
                return "mdi-battery-charging";

            let mdiIcon = "mdi-battery-outline";
            if (typeof(this.batterySoc) === 'number') {
                if (this.batterySoc >= 10 && this.batterySoc <= 99) mdiIcon = `mdi-battery-${Math.floor(this.batterySoc/10)*10}`;
                else mdiIcon = "mdi-battery-10";
            }
            return mdiIcon;
        },
        
    },
    methods:{
        onFitScene(){
            return this._isFitScene = true;
        },  
        setNodeContent(showing: boolean){
            MonitoringStore().setNodeSettingDialog(showing);
        },
        receiveEmit(data:any){
            switch(data.key){
                case "editNodeData":
                    this._currentEditNode = data.value;
                    this.setNodeContent(true);
                    break;
                case "isFitScene":
                    this._isFitScene = data.value;
                    break;
            }
        }, 
        onChartPanel(){
            this.$router.replace('/dev/chart');
        },
        onUpdateAppTm(){
            const cmd = {
                type: 'TM',
                version: '',
                fileUrl: '',
            }
            MonitoringStore().sendCommandToApp('UpdateApp', cmd);
        },
        onUpdateAppChameleon() {
            const cmd = {
                type: 'Chameleon',
                version: '',
                fileUrl: '',
            };
            MonitoringStore().sendCommandToApp('UpdateApp', cmd);
        },
    }
});

</script>

<style scoped lang="scss">

@import url("../../../../public/assets/scss/commonDev.scss");
.layout-tooltip {
    max-width: 500px;
}

</style>