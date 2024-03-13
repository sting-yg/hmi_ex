import { defineStore } from "pinia";
import { Device } from "@/views/dev/model/status/Device";
import { Project } from "@/views/dev/model/data/Project";
import { stat } from "fs";



export const MonitoringStore = defineStore({
    id: 'MonitoringStore',
    state: ()=>({
        _devices:[
            new Device().setId(1).setName("deviceName"),
        ] as Device[],

        _activeDeviceIndex: -1,
        _showSnackDialog: false,
        _project: null as Project | null,
    }),

    getters: {
        devices: (state) => {return state._devices; },
        activeDevice: (state) => {return state._activeDeviceIndex < 0 || state._activeDeviceIndex > state._devices.length-1 ? null : state._devices[state._activeDeviceIndex]},
        activeStatus: (state) => {return state._activeDeviceIndex < 0 || state._activeDeviceIndex > state._devices.length-1 ? null : state._devices[state._activeDeviceIndex].status},
    },

    actions:{
        setActiveDevice(deviceId: number|undefined){
            if(deviceId !== undefined){
                this._activeDeviceIndex = this._devices.map( x => x.id === deviceId).indexOf(true);
            }
        },
        setStatus(device:Device, data:any) {
            device.status.fromPacket(data);
        },
        setSnackDialog(showing: boolean){
            this._showSnackDialog = showing;
        },
        setProject(project: Project){
            this._project = project;
        }
    },
})