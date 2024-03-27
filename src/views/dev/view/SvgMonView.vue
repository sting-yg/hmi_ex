<template>
    <div style="position: absolute; width: 100vw; height: 100vh; display:block; background-color: white;" class="ma-0 pa-0"
    @resize="onResize" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @wheel="onMouseWheel"
    >
        <svg width="100%" height="99%"
        :viewBox="`${_worldRect.minx} ${_worldRect.miny} ${_worldRect.dx} ${_worldRect.dy}`"
        :transform="`scale(1,-1)`"
        >       
            <image :x="project?.map.rect.x" :y="project?.map.rect.y" :width="project?.map.rect.w" :height="project?.map.rect.h" href="/map.png" transform="scale(1,-1)"/>
            <!--grid-->
            <template v-if="showGrid">
                <line  v-for="(v, index) in _worldRect.gridXs(5)" :key="index" :x1="v" :x2="v" :y1="_worldRect.miny" :y2="_worldRect.maxy" :stroke="_svgData.grid.color" :stroke-width="_svgData.grid.width"/>       
                <line  v-for="(v, index) in _worldRect.gridYs(5)" :key="index" :x1="_worldRect.minx" :x2="_worldRect.maxx" :y1="v" :y2="v" :stroke="_svgData.grid.color" :stroke-width="_svgData.grid.width"/> 
            </template>
  
            <!--origin marker-->
            <line x1="-3" x2="3" y1="0" y2="0" :stroke="_svgData.originMarkerX.color" :stroke-width="_svgData.originMarkerX.width"/>
            <line x1="0" x2="0" y1="-3" y2="3" :stroke="_svgData.originMarkerY.color" :stroke-width="_svgData.originMarkerY.width"/>
        </svg>
        <div style="display:block; position:absolute; left:calc(50% - 200px); bottom:10px; height:50px; width:400px; background-color: rgba(255,255,255,0.5); text-align: center; font-size: 40px; line-height: 40px;" class="pa-1">
            {{`${Math.floor(_worldPosOnMouse.x*1000)/1000}, ${Math.floor(_worldPosOnMouse.y*1000)/1000}`}}
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { MonitoringStore } from '../stores/MonitoringStore';
import { Rect } from '../model/data/Rect';
import type { XY } from '../model/data/Interfaces';
import { SvgData } from '../model/data/SvgData';

export default defineComponent({
    data: () => ({
        _unsubscribeStore: null as null | any,
        _worldRect: new Rect(-100,-100,200,200),
        _viewport: new Rect(0,0, 1000, 1000),
        _svgData: SvgData,
        _controlMode: null as null | string,
        _downPos : null as null | XY,
        _worldPosOnMouse: {x:0, y:0} as XY,
    }),
    computed:{
        project() {
            return MonitoringStore().project;
        },
        showGrid() {
            return MonitoringStore().showGrid;
        },
    },
    methods:{
        screedToModel(screenCoord: XY) : XY {
            const nx = screenCoord.x/this._viewport.w;
            const ny = 1 - screenCoord.y/this._viewport.h;
            const wx = this._worldRect.x + this._worldRect.dx * nx;
            const wy = this._worldRect.y + this._worldRect.dy * ny;
            return {x:wx, y:wy};
        },
        onResize() {
            this.$emit('receivedEvent', {key:"isFitScene", value:false});
            const viewport0 = this._viewport.clone();
            this._viewport = new Rect(0,0,window.innerWidth,window.innerHeight);
            this._worldRect.expandByRatio(this._viewport.dx / viewport0.dx).setAspect(this._viewport.aspect);
        },
        onPointerDown(event : PointerEvent) {
            /* 0: LEFT */
            /* 1: MIDDLE */
            /* 2: RIGHT */
            switch (event.pointerType) {
                case 'mouse':
                case 'pen':
                case 'touch':
                    {
                        event.preventDefault();

                        if (event.button == 0 /* LEFT */) {
                            this._downPos = this.screedToModel({x:event.clientX, y:event.clientY});
                            this._controlMode = "pan";                            
                        }
                        else if (event.button == 2 /* RIGHT */) {
                            return
                        }
                    }
                    break;
            }
        },
        onPointerMove(event : PointerEvent) {
            this._worldPosOnMouse = this.screedToModel({x:event.clientX, y:event.clientY});
            switch ( event.pointerType ) 
            {
                case 'mouse':
                case 'pen':
                case 'touch':
                    {
                        event.preventDefault();
                    }
                    break;
            }
        },
        onPointerUp(event : PointerEvent) {
            switch ( event.pointerType ) 
            {
                case 'mouse':
                case 'pen':
                    {
                        event.preventDefault();
                        
                        if (event.button == 0 /* LEFT */) 
                        {
                            if(this._controlMode === "pan" && this._downPos != null) 
                            {
                                const curPos = this.screedToModel({x:event.clientX, y:event.clientY});
                                this._worldRect.offset(this._downPos.x - curPos.x, this._downPos.y - curPos.y);
                                this._downPos = curPos;
                            }
                            this._downPos = null;
                            this._controlMode = null;
                        }
                        else if (event.button == 2 /* RIGHT */) {
                            return
                        }
                    }
                    break;
            }            
        },
        onMouseWheel(event: any) {
            event.preventDefault();
            event.stopPropagation();
            const curPos = this.screedToModel({x:event.clientX, y:event.clientY});
            const ratio = event.deltaY < 0 ? 0.9 : 1.1;
            this._worldRect.expandByRatio(ratio, curPos);
        },
        
    },
    created() {
        this._unsubscribeStore = MonitoringStore().$onAction(
            ({name, store, args, after, onError}) => {                
                after((result) => {
                    switch(name) {
                        case 'setProject':
                            if(store.project) {
                                this._worldRect.copyFrom(store.project.map.rect);
                                this.onResize();
                            }           
                            break;
                    }
                });
            }
        );      
    },
})
</script>
<style scoped lang="scss">
@import "public/assets/scss/commonHmi.scss";
</style>