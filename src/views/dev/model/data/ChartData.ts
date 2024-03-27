
export const CHART_CONFIG = {
    linearXVelocity: {
        name: 'linear x velocity',
        unit: 'm/s',
        color:{r:255, g:51, b:51},
    },
    angularVelocity: {
        name: 'angular velocity',
        unit: 'deg/s',
        color:{r:255, g:94, b:0},
    },
} as const;

export const REALTIME_CHART_DATA_SIZE = 100;
export const ALL_CHART_DATA_SIZE = 5000;

export class ChartData {
    _ys = {
        linearXVelocity: {
            all: [],
        },
        angularVelocity: {
            all: [],
        },
    };
    all_xs = [] as string[];

    getData(key:string) {
        if(key in this._ys) {
            return this._ys[key];
        }
        else {
            return null;
        }
    }

    addData(data:any) {
        const keys = Object.entries(this._ys).map(x => x[0]);
        for(const key of keys) {
            const val = key in data ? data[key] : 0;
            
            const all = this._ys[key]['all'];
            if(all.length >= ALL_CHART_DATA_SIZE) {
                for(let i=1; i<all.length; i++) {
                    all[i-1] = all[i]; 
                }
                all[all.length-1] = val;
            }
            else {
                all.push(val);
            }
        }
        const now = new Date(Date.now());
        const x = `${now.getHours()}:${now.getMinutes()},${now.getSeconds()}`;
        if(this.all_xs.length >= ALL_CHART_DATA_SIZE) {
            for(let i=1; i<this.all_xs.length; i++) {
                this.all_xs[i-1] = this.all_xs[i]; 
            }
            this.all_xs[this.all_xs.length - 1] = x;
        }
        else {
            this.all_xs.push(x);
        }
    }
    
    resetData() {
        this.all_xs = [];

        const entries = Object.entries(this._ys);
        for(const el in entries) {
            el.all = [];
        }
    }
}
