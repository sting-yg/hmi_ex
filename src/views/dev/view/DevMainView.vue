<template>
    <router-view></router-view>

    <!-- DebugResult -->

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MonitoringStore } from '../stores/MonitoringStore';
import type { Device } from '../model/status/Device';
import { Project } from '../model/data/Project';
import { ProjectMap } from '../model/data/Project';
import { FileUtil } from '../util/FileUtil';


export default defineComponent({
    components:{
    },
    props: [],

    data: ()=>({       
        wsConnectTimer: null as number|null,
        wsLastUpdateTime: Date.now(),
        wsClient: null as WebSocket | null,
    }),

    computed:{
        activeDevice() : Device | null{
            return MonitoringStore().activeDevice;
        }

    },

    methods:{
        initWsClient(){
            MonitoringStore().setActiveDevice(MonitoringStore().devices[0].id);
            if(this.activeDevice !== null)
            {
                if(this.wsClient != null)
                {
                    if(this.wsClient.readyState < 3)return;
                    if(this.wsClient.readyState == 3)
                    {
                        this.wsClient = null;
                    }
                }
                if(this.wsClient == null)
                {
                    var address : any
                    if(document.location.port ==='5173'){
                        address = 'ws://127.0.0.1:5173/amr'
                    }
                    else{
                        address = `ws://${document.location.host}/ws/`
                    }
                    this.wsClient = new WebSocket(address);

                    this.activeDevice.webSocketClient = this.wsClient;
                    this.activeDevice.wsConnectState = 'connecting';

                }

                this.wsClient.onopen = () =>{
                    this.wsLastUpdateTime = Date.now();
                    console.log(`ws connected! (${address})`);
                    this.activeDevice!.wsConnectState = "connected";
                    this.wsClient!.onmessage = this.onWSMessage;
                }
            }
        },
        onWSMessage(event : MessageEvent){
            this.wsLastUpdateTime = Date.now();
            try{
                if(this.activeDevice !== null){
                    const jobj = JSON.parse(event.data);
                    if(jobj && 'cmd' in jobj){
                        if(jobj.cmd == 'app.monitoring.hmi'){
                            const hmidata = JSON.parse(jobj.data);
                            if(hmidata && 'CommandNameToAMR' in hmidata){
                                switch(hmidata.CommandNameToAMR){
                                    case 'Monitoring':
                                        MonitoringStore().setStatus(this.activeDevice, hmidata);
                                        break;
                                    default:
                                        console.log(hmidata);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            catch(e) {
                console.log('ws.onmessage exception', e);
            }
        },
        onWSClose(event:Event){
            if(this.activeDevice !== null)
            {
                this.activeDevice.wsConnectState = "closed";
                console.log('websocket connection closed', event);
                console.log('ws disconnected!');
                document.title = "DEV";
            }
        },
        onWSError(event:Event){
            if(this.activeDevice !== null){
                this.activeDevice.wsConnectState = "error";
                console.log('error in ws connection', event)
                document.title = "DEV";
            }
        },
        onColoseSnackMessage(){
            MonitoringStore().setSnackDialog(false);
        },
        
    },
    created(){

    },

    async mounted(){
        document.title = "DEV";

        this.wsConnectTimer = setInterval(async()=>{
            this.initWsClient();
        },1000);

        const mapImage = await FileUtil.createImageBitmapFromDataUrl("../../../../public/map.png")
        const map = new ProjectMap();

        if(mapImage && mapImage instanceof ImageBitmap){
            map.setMapImage(mapImage).setResolution(0.1);
        }
        else {
            map.setImageWidth(500).setImageHeight(200).setResolution(0.1);
        }
        const proj = new Project().setMap(map).setNodes([]);
        MonitoringStore().setProject(proj);
    },

    beforeUnmount(){
        if(this.wsConnectTimer){
            clearInterval(this.wsConnectTimer)
        }
    },
});


</script>