
export class BatteryStatus {
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
    
    fromPacket(param: any) : this {
        if('voltage' in param) this.voltage = param.voltage;
        if('temperature' in param) this.temperature = param.temperature;
        if('current' in param) this.current = param.current;
        if('capacity' in param) this.capacity = param.capacity;
        if('designCapacity' in param) this.designCapacity = param.designCapacity;
        if('percentage' in param) this.percentage = param.percentage;
        if('powerSupplyStatus' in param) this.powerSupplyStatus = param.powerSupplyStatus;                  // soc
        if('powerSupplyHealth' in param) this.powerSupplyHealth = param.powerSupplyHealth;                  // soh
        if('powerSupplyTechnology' in param) this.powerSupplyTechnology = param.powerSupplyTechnology;
        if('present' in param) this.present = param.present;
        if('cellVoltage' in param) this.cellVoltage = param.cellVoltage;
        if('cellTemperature' in param) this.cellTemperature = param.cellTemperature;
        if('location' in param) this.location = param.location;
        if('serialNumber' in param) this.serialNumber = param.serialNumber;
        return this;
    }

    get displayBatteryStatus() {
        const status: { key: string; value: number | string | null; }[] = [];
        status.push({key: "Voltage",                    value: this.voltage});
        status.push({key: "Temperature",                value: this.temperature});
        status.push({key: "Current(A)",                 value: this.current});
        status.push({key: "Capacity",                   value: this.capacity});
        status.push({key: "Design Capacity",            value: this.designCapacity});
        status.push({key: "Percentage",                 value: this.percentage});
        status.push({key: "Power Supply Status",        value: this.powerSupplyStatus});
        status.push({key: "Power Supply Health",        value: String(this.powerSupplyHealth)});
        status.push({key: "Power Supply Technology",    value: this.powerSupplyTechnology});
        status.push({key: "Present",                    value: String(this.present)});
        status.push({key: "CellVoltage",                value: String(this.cellVoltage)});
        status.push({key: "CellTemperature",            value: String(this.cellTemperature)});
        status.push({key: "Location",                   value: this.location});
        status.push({key: "SerialNumber",               value: this.serialNumber});
        return status;
    }
}
