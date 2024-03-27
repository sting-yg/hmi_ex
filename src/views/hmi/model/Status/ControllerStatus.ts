import type { Warning } from "@/views/dev/model/status/Warning";

export class ControllerStatus {
    [key: string]: any;

    dateTime = "";
    robotId = "";
    stateMachine = "";
    errors = [] as Error[];
    warnings = [] as Warning[];

    taskId = null as null | number;
    activityIndex = null as null | number;
    pathIndex = null as null | number;
    state = 1;
    taskState = null as null | string;
    pauseReason = 0;
    chargeState = 0;
    isBatterySaving = null as null | boolean;
    isHardwareAlive = false;
    isChameleonAlive = false;

    ledPattern = 0;
    soundPattern = 0;

    tmVersion = "";
    subStates = null as null | SubState[];

    fromPacket(param: any): this {
        for (const [key, value] of Object.entries(param)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = value;
            }
        }
        return this;
    }
}