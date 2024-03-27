export class MileageStatus {
    [key : string] : any;

    agvDriveMileage = null as null | number;
    agvDriveHour = null as null | number;
    breakOnOffCount = null as null | number;
    chargeRelayCount = null as null | number;
    conveyorDriveHour = null as null | number;
    conveyorStopperCount = null as null | number;
    liftDriveHour = null as null | number;
    liftUpDownCount = null as null | number;
    powerRelayCount = null as null | number;
    programRunHour = null as null | number;
    turnTableRotationCount = null as null | number;

    fromPacket(param: any): this {
        for (const [key, value] of Object.entries(param)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = value;
            }
        }
        return this;
    }
}