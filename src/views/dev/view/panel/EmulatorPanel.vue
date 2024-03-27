<template>
    <v-container class="pa-0 ma-0">
        <v-row no-gutters>
            <v-col cols="1" class="pa-0 d-flex justify-center">
                <v-btn @click="onChangeTaskOptionState('refresh')" variant="text" size="100%"><v-icon class="d-flex justify-center" size="18">mdi-reload</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom" text-white>새로고침</v-tooltip>
            </v-col>
            <v-col cols="1" class="d-flex justify-center">
                <FileSelector accept-extensions=".json" :multiple="false" @changed="onImportTaskFile" >
                    <v-icon class="d-flex justify-center">mdi-file</v-icon>
                    <v-tooltip activator="parent" location="bottom" text-white>작업파일 업로드</v-tooltip>
                </FileSelector>
            </v-col>
            <v-col cols="7" class="px-1 py-0">
                <select v-model="_activeTaskId" @change="updateActiveTask()">
                    <option :value="0" :key="0">
                        <!-- <LabelKeyControl :text="`[${testTask.taskInstanceId}] DEFALUT TASK`" :size="2" fontWeight="bold" /> -->
                        <span class="font-weight-bold">{{ `[${testTask.taskInstanceId}] DEFALUT TASK` }}</span>
                    </option>
                </select>      
            </v-col>
            <v-col cols="1" class="pa-0 d-flex justify-center">
                <v-btn variant="text" size="100%" @click="onShowTaskControlDialog()"><v-icon class="d-flex justify-center">mdi-plus-circle</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom" text-white>새 작업 추가</v-tooltip>
            </v-col>
            <v-col cols="1" class="pa-0 d-flex justify-center">
                <v-btn variant="text" size="100%" @click="onShowTaskEditDialog()"><v-icon class="d-flex justify-center">mdi-pencil</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom" text-white>선택 작업 편집</v-tooltip>
            </v-col>
            <v-col cols="1" class="pa-0 d-flex justify-center">
                <v-btn variant="text" size="100%" @click="onClickTaskRemove()"><v-icon class="d-flex justify-center">mdi-delete</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom" text-white>선택 작업 삭제</v-tooltip>
            </v-col>
        </v-row>
        <v-row no-gutters class="pa-0 ma-0">
            <v-col cols="6" class="">
                <span>작업반복횟수</span>
            </v-col>
            <v-col cols="6" class="w-50 pa-0 ma-0" >
                <InputControl v-model="_repeatCount" type="number"/>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-play</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">작업시작</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-pause</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">일시정지</v-tooltip>
            </v-col >
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-restart</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">작업재개</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-cancel</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">작업취소</v-tooltip>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3" class="pa-1">
                <select>
                    <option>(m/s)</option>
                </select>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon size="24">mdi-speedometer</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">감속 설정</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%">A<v-icon >mdi-check</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">작업 완료</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1" >
                <v-btn class="bg-primary" size="100%">T<v-icon>mdi-check</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">액티비티 완료</v-tooltip>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3" class="pa-0">
                <InputControl v-model="_startTaskIndex" type="number" :font-size="'11px'" :place-holder="'task idx'"></InputControl>
            </v-col>
            <v-col cols="3" class="pa-0">
                <InputControl v-model="_startActivityIndex" type="number" :font-size="'11px'" :place-holder="'activity idx'"></InputControl>
            </v-col>
            <v-col cols="3" class="pa-0">
                <InputControl v-model="_startPathIndex" type="number" :font-size="'11px'" :place-holder="'path idx'"></InputControl>
            </v-col>
            <v-col cols="3" class="pa-0">
                <InputControl v-model="_invorkErrorCode" type="number" :font-size="'11px'" :place-holder="'error code'"></InputControl>
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-reply</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">activity restart</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-ray-start-arrow</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">move node</v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-alarm-off</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom"></v-tooltip>
            </v-col>
            <v-col cols="3" class="pa-1">
                <v-btn class="bg-primary" size="100%"><v-icon>mdi-alarm</v-icon></v-btn>
                <v-tooltip activator="parent" location="bottom">mdi-alarm</v-tooltip>
            </v-col>
        </v-row>
    </v-container>
    <DialogControl v-if="_showTaskAddDialog" :show-modal="_showTaskAddDialog"   :width="280" :height="450" @close="onCloseTaskAddDialog()">
        <template v-slot:title><span style="color: white; font-size: 13px;">Task 추가</span></template>
        <template v-slot:content><TaskSetting :isEdit="false" /></template>
    </DialogControl>

    <DialogControl v-if="_showTaskEditDialog" :show-modal="_showTaskEditDialog" :width="280" :height="450" @close="onCloseTaskEditDialog()">
        <template v-slot:title><span style="color: white; font-size: 13px;">Task 설정</span></template>
        <template v-slot:content><TaskSetting :isEdit="true" @update="updateActiveTask()" /></template>
    </DialogControl>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { MonitoringStore } from "@/views/dev/stores/MonitoringStore";
import LabelKeyControl from "@/views/dev/view/common/LabelKeyControl.vue";
import InputControl from "@/views/dev/view/common/InputControl.vue";
import TaskSetting from "@/views/dev/view/dialog/TaskSetting.vue"
import { FileUtil } from "@/views/dev/util/FileUtil";
import { SET_DATA_TYPE, TEST_TASK, Task, convertActivities } from "@/views/dev/model/status/TaskStatus";


export default defineComponent({
    components:{
        LabelKeyControl,
        InputControl,
        TaskSetting
    },
    data:()=>({
        _activeTaskId: null as number | null,
        _showTaskAddDialog: false,
        _showTaskEditDialog: false,
        _repeatCount: 0,
        _reduceSpeedOption: [0.0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0],
        _valueReduceSpeed: 0,
        _startTaskIndex: null,
        _startActivityIndex: null,
        _startPathIndex: null,
        _invorkErrorCode: 0,
    }),
    computed:{
        tasks() {
            return MonitoringStore().tasks;
        },
        testTask(){
            return TEST_TASK;
        },
        activeTask() {
            return MonitoringStore().activeTask;
        },
        activeDevice() {
            return MonitoringStore().activeDevice;
        },
    },
    methods:{

        onShowTaskControlDialog() {
            if (!this._showTaskAddDialog) {
                this._showTaskEditDialog = false;
            }
            this._showTaskAddDialog = !this._showTaskAddDialog;
        },
        onShowTaskEditDialog() {
            if (this.activeTask == null || this.activeDevice == null || this._activeTaskId == null) { 
                MonitoringStore().setToastContent("Emulator", "선택된 작업이 없습니다.");
                return;
            }
            if (!this._showTaskEditDialog){ 
                this._showTaskAddDialog = false;
            }
            this._showTaskEditDialog = !this._showTaskEditDialog;
        },
        onCloseTaskAddDialog() {
            this._showTaskAddDialog = false; 
        },
        onCloseTaskEditDialog() {
            this._showTaskEditDialog = false;
        },
        updateActiveTask() {
            MonitoringStore().setActiveTask(this._activeTaskId);
            if (this._showTaskAddDialog || this._showTaskEditDialog) {
                // 열려있는 dialog를 닫는다.
                this._showTaskAddDialog = false;
                this._showTaskEditDialog = false;
            }
        },
        onChangeTaskOptionState(optionType:string){
            if(optionType == 'refresh'){
                this.onClickUpdateTask();
            }
        },
        onClickUpdateTask(){
            MonitoringStore().setTaskList();
            this._activeTaskId = null;
            if(this._showTaskAddDialog || this._showTaskEditDialog){

                this._showTaskAddDialog = false;
                this._showTaskEditDialog = false;

            }
        },
        async onImportTaskFile(fileInfo: File[]) {
            if(fileInfo && fileInfo.length > 0) {
                FileUtil.readJsonFromLocalFile(fileInfo[0])
                .then((res:any) => {
                    const task = JSON.parse(res);
                    let _task = new Task().fromPacket(task);
                    
                    let maxNumber = 0;
                    let _taskInstanceIds = this.tasks.map((x:any) => x.taskInstanceId);
                    
                    if (_taskInstanceIds.length > 0) {
                        maxNumber = Math.max(..._taskInstanceIds);
                    }
                    _task.taskInstanceId = String(maxNumber + 1);

                    _task.activities = convertActivities(_task.activities);
                    this.createTaskData(_task);
                })
                .catch((err:any) => {
                    console.log(`load fail: ${err}`);
                    MonitoringStore().setToastContent("ImportTask", err);
                });
            }
        },
        async createTaskData(task: any) {
            await MonitoringStore().setTaskData(SET_DATA_TYPE.AddTask, task);
        },
        async onClickTaskRemove() {
            if (!this.activeTask || this._activeTaskId == null) {
                MonitoringStore().setToastContent("Task 설정", "선택된 작업이 없습니다.");
                return;
            }

            if (this._activeTaskId === 0) {
                MonitoringStore().setToastContent("Task 설정", "기본 작업은 삭제할 수 없습니다.");
                return;
            }

            if (confirm("[Task 설정] "+this._activeTaskId+"번 작업을 삭제하시겠습니까?")) {
                await MonitoringStore().setTaskData(SET_DATA_TYPE.DeleteTask, this.activeTask);
            }
            else { 
                return;
            }
            this.onClickUpdateTask();
        },
    }
})
</script>
<style>
</style>