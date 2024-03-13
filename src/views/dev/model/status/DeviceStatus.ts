
import { GridMap } from "@/views/dev/model/status/GridMap";
import { RobotStatus } from "@/views/dev/model/status/RobotStatus";


export class DeviceStatus {
    GridMap = new GridMap();
    RobotStatus = new RobotStatus();


    fromPacket(param:any) : this{
        if('RobotStatus' in param) this.RobotStatus.fromPacket(param.RobotStatus);
        return this;
    }
}

