import { Error } from "@/views/dev/model/status/Error";
import { Warning } from "@/views/dev/model/status/Warning";

export class ControllerStatus {
    [key: string]: any;
    
    datetime = '';
    robotId = '';
    stateMachine = '';
    errors = [] as Error[];
    warnings = [] as Warning[];

    taskId = null as null | number;             // 실행 중인 Task ID
    activityIndex = null as null | number;      // 실행 중인 Activity ID
    pathIndex = null as null | number;          // 실행 중인 Path ID
    pauseReason = 0;                            // pause 사유 ( 0: none, 1: pause, 2: obs )
    chargeState = 0;                            // 충전 상태 ( 0: nonde, 1: station, 2: mobile - 이동식 충전기 )

    tmVersion = '';
    isBumberAlive = false;
    isSensorAlive = false;
    isBatteryAlive = false;
    isPhysicalbuttonsAlive = false;
    isSafetyByPass = false;

    fromPacket(param: any) : this {
        if ('datetime' in param) this.datetime = param.datetime;
        if ('robotId' in param) this.robotId = param.robotId;
        if ('stateMachine' in param) this.stateMachine = param.stateMachine;
        if ('errors' in param) {
            let _error = [] as Error[];
            param.errors.map((x:Error) => _error.push(new Error().fromPacket(x)));
            this.errors = _error;
        }
        if ('warnings' in param) {
            let _warning = [] as Warning[];
            param.errors.map((x:Error) => _warning.push(new Error().fromPacket(x)));
            this.warnings = _warning;
        }
        if ('taskId' in param) this.taskId = param.taskId;
        if ('activityIndex' in param) this.activityIndex = param.activityIndex;
        if ('pathIndex' in param) this.pathIndex = param.pathIndex;
        if ('pauseReason' in param) this.pauseReason = param.pauseReason;
        if ('chargeState' in param) this.chargeState = param.chargeState;

        if ('tmVersion' in param) this.tmVersion = param.tmVersion;

        if ('isBumberAlive' in param) this.isBumberAlive = param.isBumberAlive;
        if ('isSensorAlive' in param) this.isSensorAlive = param.isSensorAlive;
        if ('isBatteryAlive' in param) this.isBatteryAlive = param.isBatteryAlive;
        if ('isPhysicalbuttonsAlive' in param) this.isPhysicalbuttonsAlive = param.isPhysicalbuttonsAlive;
        if ('isSafetyByPass' in param) this.isSafetyByPass = param.isSafetyByPass;

        return this;
    }

    getPauseReason() {
        switch (this.pauseReason) {
            case 1:  return "pause";
            case 2:  return "obstacleDetected";
            default: return "none";
        }
    }
    getChargeState() {
        switch (this.chargeState) {
            case 1:  return "stationCharging";
            case 2:  return "mobileCharging";
            default: return "none";
        }
    }

    get displayControllerStatus() {
        const status: { key: string; value: number | string | null; }[] = [];
        status.push({key: "Update Time",            value: this.datetime});

        status.push({key: "Robot Id",               value: this.robotId});
        status.push({key: "State Machine",          value: this.stateMachine});

        status.push({key: "Pause Reason",           value: this.getPauseReason()});
        status.push({key: "Charge State",           value: this.getChargeState()});

        status.push({key: "TM Version",             value: this.tmVersion});

        status.push({key: "Alive Battery Saving",   value: String(this.isBatterySaving)});
        status.push({key: "Alive Bumper",           value: String(this.isBumberAlive)});
        status.push({key: "Alive Sensor",           value: String(this.isSensorAlive)});
        status.push({key: "Alive Battery",          value: String(this.isBatteryAlive)});
        status.push({key: "Alive Physicalbutton",   value: String(this.isPhysicalbuttonsAlive)});
        return status;
    }
}
