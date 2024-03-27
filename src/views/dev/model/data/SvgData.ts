export const SvgData = {
    grid: {
        color: 'gray',
        width: 0.1,
    },
    originMarkerX: {
        color: 'red',
        width: 0.2,
    },
    originMarkerY: {
        color: 'green',
        width: 0.2,
    },
    robot: {
        opacity: 1,
    },
    lidar: {
        color: 'red',
        radius: 0.05,
    },
    camera: {
        color: 'blue',
        radius: 0.05,
    },
    node: {
        color: 'gray',
        opacity: 0.7,
    },
    nodeText: {
        size: 0.25,
        color: 'white',
        opacity: 0.9,
        width: 0.1,
    },
    chargeStation: {
        color: 'green',
        opacity: 1,
        width: 0.6,
        height: 0.6,
        radius: 0.02,
        fontSize: 0.4,
    },
    activePathLine: {
        color: '#74DF00',
        opacity: 0.8,
        width: 0.1,
        linecap: 'square',
    },
    activePathIndex: {
        opacity: 0.8,
        linecap: 'square',
        width: 0.5,
        height: 0.5,
        radius: 0.02,
    },
    activePathText: {
        size: 0.22,
        color: 'white',
    },
    registeredPathPastLine: {       // 등록된 path의 지나온 경로
        color: 'blue',
        opacity: 0.8,
        width: 0.1,
        linecap: 'square',
    },
    registeredPathProgressLine: {    // 등록된 path의 진행될 경로
        color: 'red',
        opacity: 0.8,
        width: 0.1,
        linecap: 'square',
    },
    
} as const;
