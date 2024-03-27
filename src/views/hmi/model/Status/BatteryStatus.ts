export class BatteryStatus {
    [key: string]: any;

    voltage = 0.0;
    temperature = 0.0;
    current = 0.0;
    capacity = 0.0;
    designCapacity = 0.0;
    percentage = 0.0;
    powerSupplyStatus = 0;
    powerSupplyHealth = 0;
    powerSupplyTechnology = 0;
    present = false;
    cellVoltage = null as null | number[];
    cellTemperature = null as null | number[];
    location = '';
    serialNumber = '';

    fromPacket(param: any): this {
        for (const [key, value] of Object.entries(param)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = value;
            }
        }
        return this;
    }
}