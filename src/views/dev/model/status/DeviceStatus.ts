import type { XY } from "@/views/dev/model/data/Interfaces";
import { ChartData } from "@/views/dev/model/data/ChartData";
import { RobotStatus } from "@/views/dev/model/status/RobotStatus";
import { GridMapStatus } from "@/views/dev/model/status/GridMapStatus";
import { MileageStatus } from "@/views/dev/model/status/MileageStatus";
import { Lidar } from "@/views/dev/model/status/Lidar";
import { Camera } from "@/views/dev/model/status/Camera";
import { Obstacle } from "@/views/dev/model/status/Obstacle";
import { Task } from "@/views/dev/model/status/TaskStatus";
import { ControllerStatus } from "@/views/dev/model/status/ControllerStatus";
import { BatteryStatus } from "@/views/dev/model/status/BatteryStatus";
import { ImuStatus } from "@/views/dev/model/status/ImuStatus";
import { SwitchStatus } from "@/views/dev/model/status/SwitchStatus";
import { CpuStatus } from "@/views/dev/model/status/CpuStatus";
import { ConveyorSensorStatus } from "@/views/dev/model/status/ConveyorSensorStatus";
import { LedStatus } from "@/views/dev/model/status/LedStatus";
import { SoundStatus } from "@/views/dev/model/status/SoundStatus";
import { ParameterStatus } from "@/views/dev/model/status/ParameterStatus";

export class DeviceStatus {
    ChartData = new ChartData();
    RobotStatus = new RobotStatus();
    ControllerStatus = new ControllerStatus();
    TaskStatus = new Task();
    BatteryStatus = new BatteryStatus();
    ImuStatus = new ImuStatus();
    SwitchStatus = new SwitchStatus();
    LocalPath = [] as XY[];
    GlobalPath = [] as XY[];
    
    CpuStatus = new CpuStatus();
    GridMapStatus = new GridMapStatus();
    ConveyorSensorStatus = new ConveyorSensorStatus();
    LedStatus = new LedStatus();
    SoundStatus = new SoundStatus();
    ParameterStatus = new ParameterStatus();

    CameraData = new Camera();
    LidarData = new Lidar();
    ObstacleData = new Obstacle();
    MileageStatus = new MileageStatus();

    get robotDisplayColor():number {
        let color = 0xAAAAAA;
        return color;
    }
    get robotDisplayColorString():string {
        const hexString = this.robotDisplayColor.toString(16).padStart(6, "0").toUpperCase();
        return `#${hexString}`;
    }

    fromPacket(param:any) : this {
        if ('RobotStatus' in param) this.RobotStatus.fromPacket(param.RobotStatus);
        if ('ControllerStatus' in param) this.ControllerStatus.fromPacket(param.ControllerStatus);
        if ('TaskStatus' in param) {
            if (param.TaskStatus !== null) this.TaskStatus.fromPacket(param.TaskStatus);
            else this.TaskStatus = new Task();
        }
        // if ('BatteryStatus' in param) this.BatteryStatus.fromPacket(param.BatteryStatus);
        // if ('ImuStatus' in param) this.ImuStatus.fromPacket(param.ImuStatus);
        // if ('SwitchStatus' in param) this.SwitchStatus.fromPacket(param.SwitchStatus);
        // if ('CpuStatus' in param) this.CpuStatus.fromPacket(param.CpuStatus);
        // if ('GridMapStatus' in param) this.GridMapStatus.fromPacket(param.GridMapStatus);
        // if ('ConveyorSensorStatus' in param) this.ConveyorSensorStatus.fromPacket(param.ConveyorSensorStatus);
        // if ('LedStatus' in param) this.LedStatus.fromPacket(param.LedStatus);
        // if ('SoundStatus' in param) this.SoundStatus.fromPacket(param.SoundStatus);
        // if ('ParameterStatus' in param) this.ParameterStatus.fromPacket(param.ParameterStatus);
        
        if ('LocalPath' in param && 'localPath' in param.LocalPath) this.LocalPath = param.LocalPath.localPath;
        if ('GlobalPath' in param && 'globalPath' in param.GlobalPath) this.GlobalPath = param.GlobalPath.globalPath;

        this.ChartData.addData({
            linearXVelocity: this.RobotStatus.linearXVelocity,
            angularVelocity: this.RobotStatus.angularVelocity,
        });
        return this;
    }
}
