<template>
    <router-view/>

    
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MonitoringStore } from '@/views/dev/stores/MonitoringStore';
import type { Device } from '@/views/dev/model/status/Device';
import { Project, ProjectMap } from '@/views/dev/model/data/Project';
import { FileUtil } from '@/views/dev/util/FileUtil';


export default defineComponent({
    components:{
    },
    props: [],

    data: ()=>({       
        _wsConnectTimer: null as NodeJS.Timeout | null,
        _wsLastUpdateTime: Date.now(),
        _wsClient: null as WebSocket | null,
        _isOpenPasswordDialog : false,
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
                if(this._wsClient != null)
                {
                    if(this._wsClient.readyState < 3)return;
                    if(this._wsClient.readyState == 3)
                    {
                        this._wsClient = null;
                    }
                }
                if(this._wsClient == null)
                {
                    console.log("ws -try to connect");
                    var address : any
                    if(document.location.port ==='5173'){
                        address = 'ws://127.0.0.1:5173/amr'
                    }
                    else{
                        address = `ws://${document.location.host}/ws/`
                    }
                    this._wsClient = new WebSocket(address);

                    this.activeDevice.webSocketClient = this._wsClient;
                    this.activeDevice.wsConnectState = 'connecting';

                }

                this._wsClient.onopen = () =>{
                    this._wsLastUpdateTime = Date.now();
                    console.log(`ws connected! (${address})`);
                    this.activeDevice!.wsConnectState = "connected";
                    this._wsClient!.onmessage = this.onWSMessage;
                    this._wsClient!.onclose = this.onWSClose;
                    this._wsClient!.onerror = this.onWSError;
                    document.title="DEV";
                }
            }
        },
        onWSMessage(event : MessageEvent){
            this._wsLastUpdateTime = Date.now();
            try{
                if(this.activeDevice !== null){
                    const jobj = JSON.parse(event.data);
                    if(jobj && 'cmd' in jobj){
                        if(jobj.cmd == 'app.monitoring.hmi'){
                            const hmidata = JSON.parse(jobj.data);
                            if(hmidata){
                                MonitoringStore().setStatus(this.activeDevice, hmidata);
                                document.title = "DEV"
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

        this._wsConnectTimer = setInterval(async()=>{
            this.initWsClient();
        }, 1000);

        const mapImage = await FileUtil.createImageBitmapFromDataUrl('../map.png')
        const map = new ProjectMap();

        if(mapImage && mapImage instanceof ImageBitmap){
            map.setMapImage(mapImage).setResolution(0.1);
        }
        else {
            map.setImageWidth(500).setImageHeight(200).setResolution(0.1);
        }
        const proj = new Project().setMap(map).setNode([]);
        MonitoringStore().setProject(proj);
    },

    beforeUnmount(){
        if(this._wsConnectTimer){
            clearInterval(this._wsConnectTimer)
        }
    },
});

</script>

<style scoped lang="scss">

</style>