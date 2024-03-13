import { DeviceStatus } from "./DeviceStatus";

export class Device{
    id = 1;
    name = '';
    status = new DeviceStatus();
    webSocketClient = null as WebSocket | null;
    wsConnectState = '';

    constructor(){

    }

    setId(id: number): this{
        this.id = id;
        return this;
    }

    setName(name: string): this{
        this.name = name;
        return this;
    }
}