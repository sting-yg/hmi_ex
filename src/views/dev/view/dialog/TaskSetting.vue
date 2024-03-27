<template>
    <v-container class="pa-1">
        <v-row no-gutters>
            <!-- Task Info -->
            <v-col cols="2" class="px-1"><LabelKeyControl :text="'ID'" :size="11" :font-weight="'normal'" :align="'center'" /></v-col>
            <v-col cols="2" class="pa-1"><InputControl v-model="_task.taskInstanceId" :disabled="isEdit?true:false" /></v-col>
            <v-col cols="2" class="pa-1"><LabelKeyControl :text="'Alias'" :size="11" :font-weight="'normal'" :align="'center'" /></v-col>
            <v-col cols="6" class="pa-1"><InputControl v-model="_task.alias" /></v-col>

            <!-- Activity List -->
            <v-col cols="12" class="px-0 py-1">
                <div class="activity-list">
                    <draggable class="w-full" :list="_task.activities">
                        <v-card
                            class="ma-1"
                            color="indigo" variant="tonal"
                            v-for="activity, index in _task.activities"
                            :key="index"
                        >
                            <v-card-title style="font-size: 11px">
                                {{ activity.index = index }} : {{ getActivityTypeLabel(activity.activityType) }}
                            </v-card-title>
                            <v-card-subtitle class="py-0" />

                            <v-icon @click="onDeleteActivity(index)" size="20" style="position: absolute; right: 10px; top: 6px;">mdi-close</v-icon>
                            <v-icon @click="onEditActivity(index)" size="20" style="position: absolute; right: 30px; top: 6px;">mdi-pencil</v-icon>
                        </v-card>
                    </draggable>
                </div>
                <button class="btn-add-border">
                    <v-icon @click="onAddActivity()" class="d-flex justify-center align-centers" size="25" color="#0B0B61">mdi-plus-circle-outline</v-icon>
                </button>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col class="d-flex justify-center align-center">
                <v-btn class="btn-save mx-1" @click="saveTask()"><LabelValueControl text="저장" :color="'white'" /></v-btn>
            </v-col>
        </v-row>
    </v-container>

    <DialogControl
        v-if="_showActivitySettingDialog" :show-modal="_showActivitySettingDialog"
        :req-close="!_showActivitySettingDialog" :width="370"
        @close="_showActivitySettingDialog = false"
    >
        <template v-slot:title><span style="color: white; font-size: 13px;">Activity 설정</span></template>
        <template v-slot:content><ActivitySetting :activity="_task.activities[_currentSettingIndex]" @close="setActivity" /></template>
    </DialogControl>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { MonitoringStore } from '@/views/dev/stores/MonitoringStore';
import { Task, Activities, ACTIVITY_TYPE, ACTIVITY_TYPE_LABEL, SET_DATA_TYPE } from "@/views/dev/model/status/TaskStatus";
import SnackBarControl from '@/views/dev/view/common/SnackBarContent.vue';
import LabelKeyControl from "../common/LabelKeyControl.vue";
import LabelValueControl from "../common/LabelValueControl.vue";
import InputControl from "../common/InputControl.vue";
import ButtonControl from "../common/ButtonControl.vue";
import DialogControl from '@/views/dev/view/common/DialogControl.vue';
import { VueDraggableNext } from 'vue-draggable-next';

export default defineComponent({
    props: ["isEdit"],
    emits: ["close", "update"],
    components: {
        SnackBarControl,
        LabelKeyControl,
        LabelValueControl,
        InputControl,
        ButtonControl,
        DialogControl,
        draggable: VueDraggableNext,
    },
    data: () => ({
        unsubscribeStore: null as (() => void) | null,
        _showActivitySettingDialog: false,
        _task: new Task(),
        _curserActivity: null as null | Activities,
        _currentSettingIndex: 0,
    }),

    computed: {
        activeDevice() {
            return MonitoringStore().activeDevice;
        },
        tasks() : Task[] {
            return MonitoringStore().tasks;
        },
        activityTypeLabel() { 
            return ACTIVITY_TYPE_LABEL;
        },
        activeTask() {
            return MonitoringStore().activeTask;
        },
    },

    methods: {
        onDragOver(event:any) {
            event.preventDefault();
        },
        onDropActionList(targetIndex:number, event:any) {
            event.stopPropagation();
        },
        getActivityTypeLabel(type: number) {
            return ACTIVITY_TYPE_LABEL[ACTIVITY_TYPE_LABEL.map(x => x.value === type).indexOf(true)].label;
        },
        checkAvailableTask() {
            // task를 저장하기 전 검사하기 위한 용도

            if (this._task.taskInstanceId === "") {
                MonitoringStore().setToastContent("Task 설정", `id는 필수 사항입니다.`);
                return false;
            }
            if (this._task.activities.length === 0) {
                MonitoringStore().setToastContent("Task 설정", "하나 이상의 항목을 추가해주세요.");
                return false;
            }

            // check add task
            if (this.isEdit === false) {
                if (Number(this._task.taskInstanceId) <= 0) {
                    MonitoringStore().setToastContent("Task 설정", "ID는 1보다 커야 합니다.");
                    return false;
                }

                if (Number(this._task.taskInstanceId) === 0) {
                    MonitoringStore().setToastContent("Task 설정", "기본 작업은 수정할 수 없습니다.");
                    return false;
                }

                const f = this.tasks.find(x => x.taskInstanceId == String(this._task.taskInstanceId));
                if (f) {
                    MonitoringStore().setToastContent("Task 설정", "이미 존재하는 ID 입니다.");
                    return false;
                }
            }
            return true;
        },
        async saveTask() {
            if (this.checkAvailableTask() === false) {
                return;
            }
            const taskData = this._task;
            if (this.isEdit) {
                await MonitoringStore().setTaskData(SET_DATA_TYPE.EditTask, taskData);
                this.$emit('update');   // active task data 변경
            }
            else {
                await MonitoringStore().setTaskData(SET_DATA_TYPE.AddTask, taskData);
            }
        },
        onDeleteActivity(index:number) {
            this._task.activities.splice(index, 1);            
        },
        onEditActivity(index:number) {         
            if (this._showActivitySettingDialog) {
                this._showActivitySettingDialog = false;
                return;
            }
            this._currentSettingIndex = index;
            this._showActivitySettingDialog = true;
        },
        onAddActivity() {        
            if (this._showActivitySettingDialog) {
                this._showActivitySettingDialog = false;
                return;
            }
            this._task.activities.push(new Activities());
            this._currentSettingIndex = this._task.activities.length - 1;
            // this._showActivitySettingDialog = true;
        },
        setActivity(activityData:Activities) {
            // remove nullable value
            let receiveData = JSON.parse(JSON.stringify(new Activities().clone().fromPacket(activityData)));
            if (receiveData.activityType !== ACTIVITY_TYPE.Move)        delete receiveData.moveParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.DockingIn)   delete receiveData.dockingInParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.DockingOut)  delete receiveData.dockingOutParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.TableTurn)   delete receiveData.tableTurnParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.KivaTurn)    delete receiveData.kivaTurnParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.Conveyor)    delete receiveData.conveyorParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.Lift)        delete receiveData.liftParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.StartCharge &&
                receiveData.activityType !== ACTIVITY_TYPE.StopCharge)  delete receiveData.chargeParameter;
            if (receiveData.activityType !== ACTIVITY_TYPE.Standby)     delete receiveData.standByParameter;

            this._task.activities[this._currentSettingIndex] = receiveData;
            this._showActivitySettingDialog = false;
        },
        bringActiveTaskData() {
            if (this.isEdit && this.activeTask) {
                this._task = JSON.parse(JSON.stringify(this.activeTask));
            }
        },
    },

    mounted() {
        this.bringActiveTaskData();
        this.unsubscribeStore = MonitoringStore().$onAction(
            ({name, store, args, after, onError}) => {                
                after((result) => {
                });
            });
    },

    beforeUnmount() {
        if(this.unsubscribeStore) {
            this.unsubscribeStore();
        }
    },
});
</script>

<style scoped lang="scss">
@import "public/assets/scss/commonDev.scss";
.activity-list{
    width: 100%;
    height: 300px;
    border: 1px solid #ccc;
    border-bottom: 0px solid black;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    font-size: 10px;
    &::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(0, 0, 0, 0.1);
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 2px;
    }
    &:hover::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.5);
    }
}
</style>
