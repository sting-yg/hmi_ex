import { defineStore } from "pinia";
import { Device } from "@/views/dev/model/status/Device";
import { Project } from "@/views/dev/model/data/Project";
import { Task, TEST_TASK } from '@/views/dev/model/status/TaskStatus';
import { DevApi } from '@/views/dev/model/DevApi';



export const MonitoringStore = defineStore({
    id: 'MonitoringStore',
    state: ()=>({
        _devices:[
            new Device().setId(1).setName("deviceName"),
        ] as Device[],

        _activeDeviceIndex: -1,
        _showSnackDialog: false,
        _project: null as Project | null,
        _showNodeSettingDialog: false,
        _showStatusPanel: true,
        _fixEyeOnSelectedDevice: false,    
        _showGrid: true,  
        _showNode: false,
        _snackMessage: { title:'title', content:'content' },   
        _tasks: [] as Task[],  
        _activeTask: null as null | Task,
        _showCameraScanRawData: true,        
        _showLidarScanRawData: true,   
    }),

    getters: {
        devices: (state) => {return state._devices; },
        activeDevice: (state) => {return state._activeDeviceIndex < 0 || state._activeDeviceIndex > state._devices.length-1 ? null : state._devices[state._activeDeviceIndex]},
        activeStatus: (state) => {return state._activeDeviceIndex < 0 || state._activeDeviceIndex > state._devices.length-1 ? null : state._devices[state._activeDeviceIndex].status},
        project: (state) => { return state._project; },        
        pathNodes: (state) => { return state._project ? state._project.nodes : []; },        
        showStatusPanel: (state) => { return state._showStatusPanel; },    
        showCameraScanRawData: (state) => { return state._showCameraScanRawData; },        
        showLidarScanRawData: (state) => { return state._showLidarScanRawData; },  
        fixEyeOnSelectedDevice: (state) => { return state._fixEyeOnSelectedDevice; },  
        showGrid: (state) => { return state._showGrid; },
        showNode: (state) => { return state._showNode; },
        tasks: (state) => { return state._tasks },    
        activeTask: (state) => { return state._activeTask },
    },

    actions:{
        sendCommandToApp(command:string, data:any)
        {
            if (this.activeDevice && this.activeDevice.webSocketClient) {
                let _command = { cmd: command, data: data };
                this.activeDevice.webSocketClient?.send(JSON.stringify( { cmd: "hmi-command", data : _command } ));
            }
        },
        setActiveDevice(deviceId: number|undefined)
        {
            if(deviceId !== undefined){
                this._activeDeviceIndex = this._devices.map( x => x.id === deviceId).indexOf(true);
            }
        },
        setStatus(device:Device, data:any) 
        {
            device.status.fromPacket(data);
        },
        setSnackDialog(showing: boolean)
        {
            this._showSnackDialog = showing;
        },
        setProject(project: Project)
        {
            this._project = project;
        },
        setNodeSettingDialog(showing:boolean) 
        {
            this._showNodeSettingDialog = showing;
        },
     
        setToastContent(title:string, contents:string)
        {
            this._showSnackDialog = true;
            this._snackMessage.title = title;
            this._snackMessage.content = contents;
        },
        async setTaskList() {
            await DevApi().getTaskList()
                .then(async (res: any) => {
                    if (DevApi().isResultEmpty(res.data)) {
                        this.setToastContent("Emulator", `저장된 task가 없습니다.`);
                        this._tasks = [];
                    }
                    else {
                        this._tasks = res.data;
                    }
                })
                .catch((err: any) => {
                    console.log(`Failed to get task list`, err);
                    this.setToastContent("Emulator", `task 목록 불러오기에 실패했습니다. (${err.message})`);
                });
        },
        async setNodeData() {
            await DevApi().getNodeData()
                .then(async (res: any) => {
                    if (DevApi().isResultEmpty(res.data)) {
                        this.setToastContent("Node 설정", `저장된 node가 없습니다.`);
                    }
                    else {
                        this.project?.setNode(res.data);
                    }
                })
                .catch((err: any) => {
                    console.log(`Failed to get task list`, err);
                    this.setToastContent("Node 설정", `node 불러오기에 실패했습니다. (${err.message})`);
                });
        },
        async setActiveTask(taskId: null | number) {
            if (taskId === null) {
                this._activeTask = null;
                return;
            }

            if (taskId === 0) {
                this._activeTask = new Task().fromPacket(TEST_TASK);
                return;
            }

            if (this._tasks.filter(x => String(x.taskInstanceId) === String(taskId))) {
                await DevApi().getTaskData(String(taskId))
                    .then(async (res: any) => {
                        if ('task' in res.data) {
                            this._activeTask = res.data.task;
                        }
                        else {
                            this._activeTask = null;
                        }
                    })
                    .catch((err: any) => {
                        console.log(`Failed to set data`, err);
                        this.setToastContent("Task 설정", `task 불러오기에 실패하였습니다. (${err.message})`);
                    });
            }
            else {
                console.log(`tasks 목록에 해당 task id를 가진 data가 없습니다. ${this._activeTask}`);
            }
        },
        async setTaskData(type: number, data: any) {
            await DevApi().setTaskData(type, data)
                .then(async (res: any) => {
                    if (type === 0 || type === 1 || type === 2) {
                        this.setToastContent("Task 설정", `${res.data}`);
                        this.setTaskList();
                    }
                    else {
                        this.setToastContent("Node 설정", `${res.data}`);
                        this.setNodeData();
                    }
                })
                .catch((err: any) => {
                    console.log(`Failed to set data`, err);
                    if (type === 0 || type === 1 || type === 2) {
                        this.setToastContent("Task 설정", `task 설정에 실패하였습니다. (${err.message})`);
                    }
                    else {
                        this.setToastContent("Node 설정", `node 설정에 실패하였습니다. (${err.message})`);
                    }
                });
        },
    },
})