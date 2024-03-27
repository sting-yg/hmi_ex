export const ACTION_TYPE : { [key: string]: number } = {
    Stop: 1,
    Forward: 2,
    Backward: 3,
    LeftForward: 4,     // QD
    LeftBackward: 5,    // QD
    RightForward: 6,    // QD
    RightBackward: 7,   // QD
};

export const ACTION_TYPE_LABEL = [
    { value: ACTION_TYPE.Stop,              label: '정지' },
    { value: ACTION_TYPE.Forward,           label: '직진' },
    { value: ACTION_TYPE.Backward,          label: '후진' },
    { value: ACTION_TYPE.LeftForward,       label: 'QD 좌로 직진' },
    { value: ACTION_TYPE.LeftBackward,      label: 'QD 좌로 후진' },
    { value: ACTION_TYPE.RightForward,      label: 'QD 우로 직진' },
    { value: ACTION_TYPE.RightBackward,     label: 'QD 우로 후진' },
];

export const ACTIVITY_TYPE : { [key: string]: number } = {
    Move: 1,
    DockingIn: 2,
    DockingOut: 3,
    TableTurn: 4,
    KivaTurn: 5,
    Conveyor: 6,
    Lift: 7,
    StartCharge: 8,
    StopCharge: 9,
    Standby: 10,
    AwaitAsync: 11,
};

export const ACTIVITY_TYPE_LABEL = [
    { value: ACTIVITY_TYPE.Move,        label: '주행' },
    { value: ACTIVITY_TYPE.DockingIn,   label: '도킹인' },
    { value: ACTIVITY_TYPE.DockingOut,  label: '도킹아웃' },
    { value: ACTIVITY_TYPE.TableTurn,   label: '테이블턴' },
    { value: ACTIVITY_TYPE.KivaTurn,    label: '키바턴(바디턴)' },
    { value: ACTIVITY_TYPE.Conveyor,    label: '컨베이어' },
    { value: ACTIVITY_TYPE.Lift,        label: '리프트' },
    { value: ACTIVITY_TYPE.StartCharge, label: '충전시작' },
    { value: ACTIVITY_TYPE.StopCharge,  label: '충전해제' },
    { value: ACTIVITY_TYPE.Standby,     label: '대기' },
    { value: ACTIVITY_TYPE.AwaitAsync,  label: '비동기 작업' },
];

export class Path {
    index = 0;                                                   // path index
    x = 0.0;                                                     // (m)
    y = 0.0;                                                     // (m)
    angle = 0.0;                                                 // 방향 각도 (글로벌 좌표계, deg) (stop 시 heading 맞춤)
    actionType = ACTION_TYPE.Forward;                                // 주행 action
    isArc = false;
    arcRadius = null as null | number;
    arcControlPointX = null as null | number;                       // 곡선주행 원호의 중점
    arcControlPointY = null as null | number;
    speed = 0.0;
    obstacleDetectionDistance = null as null | number[];         // 로봇 자체 장애물 감시 거리 ([전,후,좌,우(m)])
    obstacleDetectionAreaAtTarget = null as null | number[];     // 목적지 위치 장애물 감시 영역 ([전,후,좌,우(m)])

    fromPacket(param: Path|any) : this {
        if('index' in param) this.index = param.index;
        if('x' in param) this.x = param.x;
        if('y' in param) this.y = param.y;
        if('angle' in param) this.angle = param.angle;
        if('actionType' in param) this.actionType = param.actionType;
        if('isArc' in param) this.isArc = param.isArc;
        if('arcRadius' in param) this.arcRadius = param.arcRadius;
        if('arcControlPointX' in param) this.arcControlPointX = param.arcControlPointX;
        if('arcControlPointY' in param) this.arcControlPointY = param.arcControlPointY;
        if('speed' in param) this.speed = param.speed;
        if('obstacleDetectionDistance' in param) this.obstacleDetectionDistance = param.obstacleDetectionDistance;
        if('obstacleDetectionAreaAtTarget' in param) this.obstacleDetectionAreaAtTarget = param.obstacleDetectionAreaAtTarget;
        return this;
    }
};

export class MoveParameter {
    driveType = 1;                                      // 1: ByPath, 2: Auto
    pathList = [] as Path[];

    fromPacket(param: DockingInParameter|any) : this {
        if('driveType' in param) this.driveType = param.driveType;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        return this;
    }
};

export class DockingInParameter {
    driveType = 1;                                      // 1: ByPath, 2: Auto
    pathList = [] as Path[];
    methodType = 1;                                     // 1: slam, 2: v-marker, 3: qr, 4: 띠 qr, 5: aruco 마커
    vMarkerPoints = null as null | any[];

    fromPacket(param: DockingInParameter|any) : this {
        if('driveType' in param) this.driveType = param.driveType;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        if('methodType' in param) this.methodType = param.methodType;
        if('vMarkerPoints' in param) this.vMarkerPoints = param.vMarkerPoints;
        return this;
    }
};

export class DockingOutParameter {
    driveType = 1;                                      // 주행 방식 (1: ByPath / 2: Auto)
    pathList = [] as Path[];

    fromPacket(param: DockingOutParameter|any) : this {
        if('driveType' in param) this.driveType = param.driveType;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        return this;
    }
};

export class ConveyorParameter {
    actionType = 1;                                     // 1: load, 2: unload
    productInOutType = 1;                               // 1: forward, 2: backward
    productCount = 1;                                   
    useProductCheck = false;                               // 물품 적재 체크 여부
    pioSideType = 1;                                        // 1: 전/좌, 2: 후/우
    pioComType = 1;                                     // 1: RF, 2: IR
    pioId = 0;
    pioChannel = 0;

    fromPacket(param: ConveyorParameter|any) : this {
        if('actionType' in param) this.actionType = param.actionType;
        if('productInOutType' in param) this.productInOutType = param.productInOutType;
        if('productCount' in param) this.productCount = param.productCount;
        if('useProductCheck' in param) this.useProductCheck = param.useProductCheck;
        if('pioSideType' in param) this.pioSideType = param.pioSideType;
        if('pioComType' in param) this.pioComType = param.pioComType;
        if('pioId' in param) this.pioId = param.pioId;
        if('pioChannel' in param) this.pioChannel = param.pioChannel;
        return this;
    }
};

export class StandByParameter {
    seconds = 0;                                        // 0: 무한대, 1~: 해당 초(sec)만큼 대기
    useBatterySaving = false;                           // standby 중 모터 배터리 절약 사용 여부

    fromPacket(param: StandByParameter|any) : this {
        if('seconds' in param) this.seconds = param.seconds;
        if('useBatterySaving' in param) this.useBatterySaving = param.useBatterySaving;
        return this;
    }
};

export class ChargeParameter {
    pioSideType = 1;                                        // 1: 전/좌, 2: 후/우
    pioComType = 1;                                     // 1: RF, 2: IR
    pioId = 0;
    pioChannel = 0;

    fromPacket(param: ChargeParameter|any) : this {
        if('pioSideType' in param) this.pioSideType = param.pioSideType;
        if('pioComType' in param) this.pioComType = param.pioComType;
        if('pioId' in param) this.pioId = param.pioId;
        if('pioChannel' in param) this.pioChannel = param.pioChannel;
        return this;
    }
};

export class TableTurnParameter {
    targetAngle = 0.0;
    speed = 0.0;

    fromPacket(param: TableTurnParameter|any) : this {
        if('targetAngle' in param) this.targetAngle = param.targetAngle;
        if('speed' in param) this.speed = param.speed;
        return this;
    }
};

export class KivaTurnParameter {
    targetAngle = 0.0;
    speed = 0.0;

    fromPacket(param: KivaTurnParameter|any) : this {
        if('targetAngle' in param) this.targetAngle = param.targetAngle;
        if('speed' in param) this.speed = param.speed;
        return this;
    }
};

export class LiftParameter {
    actionType = 1;                                         // 1: load, 2: unload    
    speed = 0.0;
    useProductCheck = false;                               // 물품 적재 체크 여부

    fromPacket(param: LiftParameter|any) : this {
        if('actionType' in param) this.actionType = param.actionType;
        if('speed' in param) this.speed = param.speed;
        if('useProductCheck' in param) this.useProductCheck = param.useProductCheck;
        return this;
    }
};

export class Activities {
    activityType = ACTIVITY_TYPE.Move;                              // activity type
    index = 0;                                                      // activity index
    isAsync = false;                                                // 비동기 작업 여부
    palletSize = null as null | number[];                           // 팔레트 크기 (로봇 중심으로부터의 거리, [전,후,좌,우(m)])
    palletHeight = 0 as null | number;                              // 팔레트 높이 (m)
    moveParameter = new MoveParameter();                             
    dockingInParameter = new DockingInParameter();
    dockingOutParameter = new DockingOutParameter();
    conveyorParameter = new ConveyorParameter();
    standByParameter = new StandByParameter();
    chargeParameter = new ChargeParameter();
    tableTurnParameter = new TableTurnParameter();
    kivaTurnParameter = new KivaTurnParameter();
    liftParameter = new LiftParameter();

    clone() : Activities {
        return new Activities().copyFrom(this);
    }

    copyFrom(other: Activities|any) : this {
        this.activityType = other.activityType;
        this.index = other.index;
        this.isAsync = other.isAsync;
        this.palletSize = other.palletSize;
        this.palletHeight = other.palletHeight;
        this.moveParameter = other.moveParameter;
        this.dockingInParameter = other.dockingInParameter;
        this.dockingOutParameter = other.dockingOutParameter;
        this.conveyorParameter = other.conveyorParameter;
        this.standByParameter = other.standByParameter;
        this.chargeParameter = other.chargeParameter;
        this.tableTurnParameter = other.tableTurnParameter;
        this.kivaTurnParameter = other.kivaTurnParameter;
        this.liftParameter = other.liftParameter;
        return this;
    }

    fromPacket(param: any) : this {
        if('activityType' in param)             this.activityType = param.activityType;
        if('index' in param)                    this.index = param.index;
        if('isAsync' in param)                  this.isAsync = param.isAsync;
        if('palletSize' in param)               this.palletSize = param.palletSize;
        if('palletHeight' in param)             this.palletHeight = param.palletHeight;
        if('moveParameter' in param)            this.moveParameter.fromPacket(param.moveParameter);
        if('dockingInParameter' in param)       this.dockingInParameter.fromPacket(param.dockingInParameter);
        if('dockingOutParameter' in param)      this.dockingOutParameter.fromPacket(param.dockingOutParameter);
        if('conveyorParameter' in param)        this.conveyorParameter.fromPacket(param.conveyorParameter);
        if('standByParameter' in param)         this.standByParameter.fromPacket(param.standByParameter);
        if('chargeParameter' in param)          this.chargeParameter.fromPacket(param.chargeParameter);
        if('tableTurnParameter' in param)       this.tableTurnParameter.fromPacket(param.tableTurnParameter);
        if('kivaTurnParameter' in param)        this.kivaTurnParameter.fromPacket(param.kivaTurnParameter);
        if('liftParameter' in param)            this.liftParameter.fromPacket(param.liftParameter);
        return this;
    }
};

export class Task {
    taskInstanceId = null as null | string;
    requesterId = null as null | string;
    requesterName = null as null | string;
    requesterOrganizationName = null as null | string;
    startNodeName = null as null | string;
    targetNodeName = null as null | string;
    alias = ""; // dev 전용
    activities = [] as Activities[];

    copyFrom(other: Task) : this {
        this.taskInstanceId = other.taskInstanceId;
        this.requesterId = other.requesterId;
        this.requesterName = other.requesterName;
        this.requesterOrganizationName = other.requesterOrganizationName;
        this.startNodeName = other.startNodeName;
        this.targetNodeName = other.targetNodeName;   
        this.alias = other.alias;
        return this;
    }

    fromPacket(param: any) : this {
        param.activities = convertActivities(param.activities);
        if('taskInstanceId' in param) this.taskInstanceId = param.taskInstanceId;
        if('requesterId' in param) this.requesterId = param.requesterId;
        if('requesterName' in param) this.requesterName = param.requesterName;
        if('requesterOrganizationName' in param) this.requesterOrganizationName = param.requesterOrganizationName;
        if('startNodeName' in param) this.startNodeName = param.startNodeName;
        if('targetNodeName' in param) this.targetNodeName = param.targetNodeName;
        if('activities' in param) {
            let _activities = [] as Activities[];
            param.activities.map((x:Activities) => {
                return _activities.push(new Activities().fromPacket(x));
            })
            this.activities = _activities;
        }
        if('alias' in param) this.alias = param.alias;
        return this;
    }

    get displayTaskStatus() {
        const status: string[] = [];
        for (let i=0; i<this.activities.length; i++) {
            status.push(`${this.activities[i].index}. ${this.getActivityLabel(this.activities[i].activityType)}`);
        }
        return status;
    }

    getActivityLabel(activityType:number) {
        let label = ACTIVITY_TYPE_LABEL.filter(x => x.value === activityType).map(x=>x.label);
        if (label.length > 0) return label[0];
        else                  return '';
    }
}

// path 가시화 시 사용 (svg)
export function visualizationActivities(activities:Activities[]) {
    let lastPath = { x:0, y:0 };
    let customActivityList = [] as { activityType: number, pathList: any[] }[];
    activities.map(((x:any) => {
        switch (x.activityType) {
            case ACTIVITY_TYPE.Move:
                if (x.moveParameter.pathList !== null && x.moveParameter.pathList.length > 0) {
                    let customPathList = [] as any[];
                    x.moveParameter.pathList.map((path:Path) => { 
                        customPathList.push({ index: path.index, x: path.x, y: path.y });
                        lastPath.x = path.x;
                        lastPath.y = path.y;
                    });
                    customActivityList.push({ activityType: x.activityType, pathList: customPathList });
                }
                else {
                    customActivityList.push({ activityType: x.activityType, pathList: [{ index: 0, x: lastPath.x, y: lastPath.y }] });
                }
                break;
            case ACTIVITY_TYPE.DockingIn:
                if (x.dockingInParameter.pathList !== null && x.dockingInParameter.pathList.length > 0) {
                    let customPathList = [] as any[];
                    x.dockingInParameter.pathList.map((path:Path) => { 
                        customPathList.push({ index: path.index, x: path.x, y: path.y });
                        lastPath.x = path.x;
                        lastPath.y = path.y;
                    });
                    customActivityList.push({ activityType: x.activityType, pathList: customPathList });
                }
                else {
                    customActivityList.push({ activityType: x.activityType, pathList: [{ index: 0, x: lastPath.x, y: lastPath.y }] });
                }
                break;
            case ACTIVITY_TYPE.DockingOut:
                if (x.dockingOutParameter.pathList !== null && x.dockingOutParameter.pathList.length > 0) {
                    let customPathList = [] as any[];
                    x.dockingOutParameter.pathList.map((path:Path) => { 
                        customPathList.push({ index: path.index, x: path.x, y: path.y });
                        lastPath.x = path.x;
                        lastPath.y = path.y;
                    });
                    customActivityList.push({ activityType: x.activityType, pathList: customPathList });
                }
                else {
                    customActivityList.push({ activityType: x.activityType, pathList: [{ index: 0, x: lastPath.x, y: lastPath.y }] });
                }
                break;
            default:
                customActivityList.push({ activityType: x.activityType, pathList: [{ index: 0, x: lastPath.x, y: lastPath.y }] });
                break;
        }
    }));
    return customActivityList;
}

// tm에서 넘어오는 task status를 dev에서 사용할 수 있도록 convert 한다.
// nullable인 param은 key를 제거하여 사용한다.
export function convertActivities(activities:Activities[]) {
    let _activities = [] as any[];
    activities.map((activity:any) => {
        let _activity = activity;
        if ('activityType' in _activity) {
            if (activity.activityType !== ACTIVITY_TYPE.Move && 'moveParameter' in activity)
                delete _activity.moveParameter;
            if (activity.activityType !== ACTIVITY_TYPE.DockingIn && 'dockingInParameter' in activity)
                delete _activity.dockingInParameter;
            if (activity.activityType !== ACTIVITY_TYPE.DockingOut && 'dockingOutParameter' in activity)
                delete _activity.dockingOutParameter;
            if (activity.activityType !== ACTIVITY_TYPE.TableTurn && 'tableTurnParameter' in activity)
                delete _activity.tableTurnParameter;
            if (activity.activityType !== ACTIVITY_TYPE.KivaTurn && 'kivaTurnParameter' in activity)
                delete _activity.kivaTurnParameter;
            if (activity.activityType !== ACTIVITY_TYPE.Conveyor && 'conveyorParameter' in activity)
                delete _activity.conveyorParameter;
            if (activity.activityType !== ACTIVITY_TYPE.Lift && 'liftParameter' in activity)
                delete _activity.liftParameter;
            if (activity.activityType !== ACTIVITY_TYPE.StartCharge && activity.activityType !== ACTIVITY_TYPE.StopCharge && 'chargeParameter' in activity)
                delete _activity.chargeParameter;
            if (activity.activityType !== ACTIVITY_TYPE.Standby && 'standByParameter' in activity)
                delete _activity.standByParameter;
            _activities.push(_activity);
        }
    });
    return _activities;
}

// request use api
export const SET_DATA_TYPE : { [key: string]: number } = {
    AddTask: 0,
    EditTask: 1,
    DeleteTask: 2,
    AddNode: 3,
    EditNode: 4,
    DeleteNode: 5,
};

// default task data (test)
export const TEST_TASK = {
    "taskInstanceId": "0",
    "requesterId": null,
    "requesterName": null,
    "requesterOrganizationName": null,
    "startNodeName": "default task start node",
    "targetNodeName": "default task target node",
    "alias": "test",
    "activities": [
        {
            "activityType": 1,
            "index": 0,
            "isAsync": false,
            "palletSize": [
                1,
                1,
                1,
                1
            ],
            "palletHeight": "1",
            "moveParameter": {
                "driveType": "2",
                "pathList": [
                    {
                        "index": 0,
                        "x": -31.502,
                        "y": 11.921,
                        "angle": 0,
                        "action": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0.5,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 1,
                        "x": -23.414,
                        "y": 12.241,
                        "angle": 0,
                        "action": "3",
                        "isArc": true,
                        "arcRadius": 5,
                        "arcControlPointX": 3,
                        "arcControlPointY": 3,
                        "speed": 0.5,
                        "obstacleDetectionDistance": [
                            1,
                            1,
                            1,
                            1
                        ],
                        "obstacleDetectionAreaAtTarget": null
                    }
                ]
            }
        },
        {
            "activityType": 2,
            "index": 1,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "dockingInParameter": {
                "driveType": 1,
                "pathList": [
                    {
                        "index": 0,
                        "x": -23.414,
                        "y": 12.241,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0.5,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 1,
                        "x": -20.211,
                        "y": 9.078,
                        "angle": 0,
                        "actionType": "2",
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0.5,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    }
                ],
                "methodType": 1,
                "vMarkerPoints": [
                    [{"x": 1,"y": 2},{"x": 2,"y": 3},{"x": 3,"y": 4}],
                    [{"x": 1,"y": 2},{"x": 2,"y": 3},{"x": 3,"y": 4}],
                ]
            }
        },
        {
            "activityType": 3,
            "index": 2,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "dockingOutParameter": {
                "driveType": 1,
                "pathList": [
                    {
                        "index": 0,
                        "x": -20.211,
                        "y": 9.078,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 1,
                        "x": -20.051,
                        "y": 1.511,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    }
                ]
            }
        },
        {
            "activityType": 1,
            "index": 3,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "moveParameter": {
                "driveType": 1,
                "pathList": [
                    {
                        "index": 0,
                        "x": -20.051,
                        "y": 1.511,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 1,
                        "x": -20.411,
                        "y": -5.696,
                        "angle": 0,
                        "actionType": "3",
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 2,
                        "x": -15.807,
                        "y": -9.26,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    }
                ]
            }
        },
        {
            "activityType": 8,
            "index": 4,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "chargeParameter": {
                "pioSideType": 1,
                "pioComType": 1,
                "pioId": 101,
                "pioChannel": 11
            }
        },
        {
            "activityType": 9,
            "index": 5,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "chargeParameter": {
                "pioSideType": 1,
                "pioComType": 1,
                "pioId": 101,
                "pioChannel": 11
            }
        },
        {
            "activityType": 1,
            "index": 6,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "moveParameter": {
                "driveType": 1,
                "pathList": [
                    {
                        "index": 0,
                        "x": -15.807,
                        "y": -9.26,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    },
                    {
                        "index": 1,
                        "x": -10.762,
                        "y": -9.14,
                        "angle": 0,
                        "actionType": 2,
                        "isArc": false,
                        "arcRadius": null,
                        "arcControlPointX": null,
                        "arcControlPointY": null,
                        "speed": 0,
                        "obstacleDetectionDistance": null,
                        "obstacleDetectionAreaAtTarget": null
                    }
                ]
            }
        },
        {
            "activityType": 10,
            "index": 7,
            "isAsync": false,
            "palletSize": null,
            "palletHeight": 0,
            "standByParameter": {
                "seconds": 10,
                "useBatterySaving": false
            }
        }
    ]
};
