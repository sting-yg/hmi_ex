import type { XY } from "@/views/hmi/model/data/Interface"

export const ACTION_TYPE : {[key: string]: number} = {
    Stop: 1,
    Forward: 2,
    Backward: 3,
    LeftForward: 4,
    LeftBackward: 5,
    RightForward: 6,
    RightBackward: 7,
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
    action = ACTION_TYPE.Forward;                                // 주행 action
    isArc = false;
    arcCenter = null as null | XY;                               // 곡률 (곡선 주행 시 사용) (m)
    speed = 0.0;
    obstacleDetectionDistance = null as null | number[];         // 로봇 자체 장애물 감시 거리 ([전,후,좌,우(m)])
    obstacleDetectionAreaAtTarget = null as null | number[];     // 목적지 위치 장애물 감시 영역 ([전,후,좌,우(m)])

    fromPacket(param: Path | any) : this {
        if('index' in param) this.index = param.index;
        if('x' in param) this.x = param.x;
        if('y' in param) this.y = param.y;
        if('angle' in param) this.angle = param.angle;
        if('action' in param) this.action = param.action;
        if('isArc' in param) this.isArc = param.isArc;
        if('arcCenter' in param) this.arcCenter = param.arcCenter;
        if('speed' in param) this.speed = param.speed;
        if('obstacleDetectionDistance' in param) this.obstacleDetectionDistance = param.obstacleDetectionDistance;
        if('obstacleDetectionAreaAtTarget' in param) this.obstacleDetectionAreaAtTarget = param.obstacleDetectionAreaAtTarget;
        return this;
    }
}

export class MoveParameter {
    driveMode = 1;                                      // 1: ByPath, 2: Auto
    pathList = [] as Path[];

    fromPacket(param: DockingInParameter | any) : this {
        if('driveMode' in param) this.driveMode = param.driveMode;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        return this;
    }
}

export class DockingInParameter {
    driveMode = 1;                                      // 1: ByPath, 2: Auto
    pathList = [] as Path[];
    method = 1;                                         // 1: slam, 2: v-marker, 3: qr, 4: 띠 qr, 5: aruco 마커
    arriveBoundaryDistance = 0.0;                       // 도킹 완료 판단 거리 (m)
    arriveBoundaryAngle = 0.0;                          // 도킹 완료 판단 거리 (m)
    cameraROIY = 0.0;                                   // 도킹 시 카메라 장애물 감시 너비 (m)
    cameraROIZ = 0.0;                                   // 도킹 시 카메라 장애물 감시 높이 (m)
    vMarkerPoints = [] as XY[];                         // V마커 최대 길이 3

    fromPacket(param: DockingInParameter | any) : this {
        if('driveMode' in param) this.driveMode = param.driveMode;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        if('method' in param) this.method = param.method;
        if('arriveBoundaryDistance' in param) this.arriveBoundaryDistance = param.arriveBoundaryDistance;
        if('arriveBoundaryAngle' in param) this.arriveBoundaryAngle = param.arriveBoundaryAngle;
        if('cameraROIY' in param) this.cameraROIY = param.cameraROIY;
        if('cameraROIZ' in param) this.cameraROIZ = param.cameraROIZ;
        if('vMarkerPoints' in param) this.vMarkerPoints = param.vMarkerPoints;
        return this;
    }
}

export class DockingOutParameter {
    driveMode = 1;                                      // 주행 방식 (1: ByPath / 2: Auto)
    pathList = [] as Path[];

    fromPacket(param: DockingOutParameter | any) : this {
        if('driveMode' in param) this.driveMode = param.driveMode;
        if('pathList' in param) {
            param.pathList.forEach((path:any) => { this.pathList.push(new Path().fromPacket(path)); });
        }
        return this;
    }
}

export class ConveyorParameter {
    action = 1;                                         // 1: load, 2: unload
    direction = 1;                                      // 1: forward, 2: backward
    productCount = 1;                                   
    productCheck = false;                               // 물품 적재 체크 여부
    pioSide = 1;                                        // 1: 전/좌, 2: 후/우
    pioComType = 1;                                     // 1: RF, 2: IR
    pioId = 0;
    pioChannel = 0;

    fromPacket(param: ConveyorParameter | any) : this {
        if('action' in param) this.action = param.action;
        if('direction' in param) this.direction = param.direction;
        if('productCount' in param) this.productCount = param.productCount;
        if('productCheck' in param) this.productCheck = param.productCheck;
        if('pioSide' in param) this.pioSide = param.pioSide;
        if('pioComType' in param) this.pioComType = param.pioComType;
        if('pioId' in param) this.pioId = param.pioId;
        if('pioChannel' in param) this.pioChannel = param.pioChannel;
        return this;
    }
}

export class StandByParameter {
    seconds = 0;                                        // 0: 무한대, 1~: 해당 초(sec)만큼 대기
    useBatterySaving = false;                           // standby 중 모터 배터리 절약 사용 여부

    fromPacket(param: StandByParameter | any) : this {
        if('seconds' in param) this.seconds = param.seconds;
        if('useBatterySaving' in param) this.useBatterySaving = param.useBatterySaving;
        return this;
    }
}

export class ChargeParameter {
    pioSide = 1;                                        // 1: 전/좌, 2: 후/우
    pioComType = 1;                                     // 1: RF, 2: IR
    pioId = 0;
    pioChannel = 0;

    fromPacket(param: ChargeParameter | any) : this {
        if('pioSide' in param) this.pioSide = param.pioSide;
        if('pioComType' in param) this.pioComType = param.pioComType;
        if('pioId' in param) this.pioId = param.pioId;
        if('pioChannel' in param) this.pioChannel = param.pioChannel;
        return this;
    }
}

export class TableTurnParameter {
    targetAngle = 0.0;
    speed = 0.0;

    fromPacket(param: TableTurnParameter|any) : this {
        if('targetAngle' in param) this.targetAngle = param.targetAngle;
        if('speed' in param) this.speed = param.speed;
        return this;
    }
}

export class KivaTurnParameter {
    targetAngle = 0.0;
    speed = 0.0;

    fromPacket(param: KivaTurnParameter|any) : this {
        if('targetAngle' in param) this.targetAngle = param.targetAngle;
        if('speed' in param) this.speed = param.speed;
        return this;
    }
}

export class LiftParameter {
    action = 1;                                         // 1: load, 2: unload    
    speed = 0.0;
    productCheck = false;                               // 물품 적재 체크 여부

    fromPacket(param: LiftParameter|any) : this {
        if('action' in param) this.action = param.action;
        if('speed' in param) this.speed = param.speed;
        if('productCheck' in param) this.productCheck = param.productCheck;
        return this;
    }
}

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
}

export class Task {
    taskId = "";
    requesterId = null as null | string;       // 요청자 ID
    requesterName = null as null | string;     // 요청자 명
    requesterOrgName = null as null | string;  // 요청자 조직명
    startPoiName = null as null | string;      // 출발지 poi 이름
    targetPoiName = null as null | string;     // 최종 목적지 poi 이름
    alias = "";                                // dev 전용

    copyFrom(other: Task|any) : this {
        this.taskId = other.taskId;
        this.requesterId = other.requesterId;
        this.requesterName = other.requesterName;
        this.requesterOrgName = other.requesterOrgName;
        this.startPoiName = other.startPoiName;
        this.targetPoiName = other.targetPoiName;   
        this.alias = other.alias;
        return this;
    }

    fromPacket(param: any) : this {
        if('taskId' in param) this.taskId = param.taskId;
        if('startPoiName' in param) this.startPoiName = param.startPoiName;
        if('targetPoiName' in param) this.targetPoiName = param.targetPoiName;
        if('alias' in param) this.alias = param.alias;
        return this;
    }
}

export class TaskStatus {
    taskId = null as null | string;
    requestId = null as null | string;
    requesterName = null as null | string;
    requesterOrgName = null as null | string;
    startPoiName = null as null | string;
    targetPoiName = null as null | string;
    activities = [] as Activities[];

    fromPacket(param: any) : this {
        if('taskId' in param) this.taskId = param.taskId;
        if('requestId' in param) this.requestId = param.requestId;
        if('requesterName' in param) this.requesterName = param.requesterName;
        if('requesterOrgName' in param) this.requesterOrgName = param.requesterOrgName;
        if('startPoiName' in param) this.startPoiName = param.startPoiName;
        if('targetPoiName' in param) this.targetPoiName = param.targetPoiName;
        if('activities' in param) this.activities = param.activities;
        return this;
    }

    displayTaskStatus(lang:string) {
        const status: { Title: string, SubTitle: string }[] = [];
        for (let i=0; i<this.activities.length; i++) {
            status.push({ Title: this.getActivityLabel(lang, this.activities[i].activityType), SubTitle: '' });
        }
        return status;
    }

    getActivityLabel(lang:string, activityType:number) {
        if (lang === 'ko') {
            const label = ACTIVITY_TYPE_LABEL.filter(x => x.value === activityType).map((x:any) => x.label);
            if (label.length > 0) return label[0];
            else                  return '';
        }
        else {
            const _key = Object.keys(ACTIVITY_TYPE).find((key:any) => ACTIVITY_TYPE[key] === activityType);
            return _key ? _key : '';
        }
    }
}