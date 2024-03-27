<template>
    <div v-if="showModal">
        <v-card>
            <v-container>
                <v-row draggable="true" @dragstart="startDrag" @dragend="endDrag">
                    <v-col cols="12" class="tool-bar">
                        <slot name="title"></slot>
                        <v-icon v-if="useClose" size="30" @click="$emit('close')" style="position: absolute; right: 10px; color: white">mdi-close</v-icon>
                    </v-col>
                </v-row>

                <!-- contents -->
                <v-row>
                    <v-col cols="12" class="contents">
                        <slot name="content"></slot>
                    </v-col>
                </v-row>

            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";


export default defineComponent({
    props: {
        showModal: {
            type: Boolean,
        },
        toolbarBgColor: {
            type: String,
            default: '#0B0B61',
        },
        useClose: {
            type: Boolean,
            default: true,
        },
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 100,
        },
    },
})

</script>

<style>

</style>