export const STATE_TYPE = [
    { value : 1, label : 'idle'},
    { value : 2, label : 'running'},
    { value : 3, label : 'error'},
    { value : 4, label : 'safetyStop'},
    { value : 5, label : 'initalizing'},
    { value : 6, label : 'terminating'},
];

export const TASK_STATE_TYPE = [
    { value : 201, label : 'moving'},
    { value : 202, label : 'dockingIn'},
    { value : 203, label : 'dockingOut'},
    { value : 204, label : 'tableTurning'},
    { value : 205, label : 'kivaTurning'},
    { value : 303, label : 'conveyorAction'},
    { value : 304, label : 'liftAction'},
    { value : 401, label : 'standby'},
    { value : 402, label : 'awaitAsync'},
];

export class RobotStatus{
    [key: string]: any;

    x = 0.0;
    y = 0.0;
    angle = 0.0;
    mileage = 0.0;
    linearXVelocity = 0.0;
    linearYVelocity = null as null | number;
    angularVelocity = 0.0;
    state = 0;
    pathSpeed = 0.0;
    obstacleDetected = false;
    mapConfidence = 0;

    fromPacket(param: any) : this {
        if ('x' in param) this.x = param.x;
        if ('y' in param) this.y = param.y;
        if ('angle' in param) this.angle = param.angle;
        if ('mileage' in param) this.mileage = param.mileage;
        if ('linearXVelocity' in param) this.linearXVelocity = param.linearXVelocity;
        if ('linearYVelocity' in param) this.linearYVelocity = param.linearYVelocity;
        if ('angularVelocity' in param) this.angularVelocity = param.angularVelocity;
        if ('state' in param) this.state = param.state;
        if ('pathSpeed' in param) this.pathSpeed = param.pathSpeed;
        if ('obstacleDetected' in param) this.obstacleDetected = param.obstacleDetected;
        if ('mapConfidence' in param) this.mapConfidence = param.mapConfidence;
        return this;
    }

    get DisplayCameleonStatus(){
        const status: { key: string; value: number | string | null; }[] = [];
        status.push({key: "State",    value: this.state ? STATE_TYPE[STATE_TYPE.map(x=>x.value === this.state).indexOf(true)].label : ''});
        status.push({key: "X",                  value: this.x});
        status.push({key: "Y",                  value: this.y});
        status.push({key: "Angle",              value: this.angle});
        status.push({key: "Mileage",            value: this.mileage});
        status.push({key: "LinearXVelocity",    value: this.linearXVelocity});
        status.push({key: "LinearYVelocity",    value: this.linearYVelocity});
        status.push({key: "AngularVelocity",    value: this.angularVelocity});
        status.push({key: "PathSpeed",          value: this.pathSpeed});
        status.push({key: "ObstacleDetected",   value: String(this.obstacleDetected)});
        status.push({key: "mapConfidence",      value: String(this.mapConfidence)+'%'});
        return status;
    }
}

