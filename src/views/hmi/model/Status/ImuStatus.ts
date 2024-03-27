export class ImuStatus {
    [key : string] : any;

    roll = 0.0;
    pitch = 0.0;
    yaw = 0.0;

    orientation_x = 0.0;
    orientation_y = 0.0;
    orientation_z = 0.0;
    orientation_w = 0.0;
    orientation_cov = [] as number[];
    angular_vel_x = 0.0;
    angular_vel_y = 0.0;
    angular_vel_z = 0.0;
    angular_vel_cov = [] as number[];
    linear_acc_x = 0.0;
    linear_acc_y = 0.0;
    linear_acc_z = 0.0;
    linear_acc_cov = [] as number[];

    fromPacket(param: any): this {
        for (const [key, value] of Object.entries(param)) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {
                this[key] = value;
            }
        }
        return this;
    }
}