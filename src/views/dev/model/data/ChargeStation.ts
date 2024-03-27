export class ChargeStation {
    id = 0;
    channel = 0;
    x = 0;
    y = 0;

    get chargeStationList() : ChargeStation[] {
        const list = [
            { id: 1, channel: 101, x: 23.8, y: -16.2 },
            { id: 2, channel: 102, x: 23.8, y: -12.72 },
            { id: 3, channel: 103, x: 23.8, y: -9.4 },
            { id: 4, channel: 104, x: 23.8, y: -5.5 },
            { id: 5, channel: 105, x: 23.8, y: -2.17 },
        ] as ChargeStation[];
        return list.flat();
    }
}
