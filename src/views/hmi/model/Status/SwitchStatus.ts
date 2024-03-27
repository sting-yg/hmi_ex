export class SwitchStatus {
    [key: string]: any;
    
    emo = false;
    frontBumperPressedState = false;
    rearBumperPressedState = false;
    resetSwitch = false;
    positionSwitch = false;
    brakeOffSwitch = false;
    maintenanceSwitch = false;
    manualConveyorCW = false;
    manualConveyorCCW = false;
    manualStopper = false;
    autoModeSwitch = false;
    manualModeSwitch = false;
    manualChargerPlugin = false;

    fromPacket(param: any): this {
        for (const [key, value] of Object.entries(param)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = value;
            }
        }
        return this;
    }
}