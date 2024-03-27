<template>
    <span v-if="textList === null" class="label-value">{{ text }}</span>
    <span v-else v-for="(item, index) in textList" :key="index" class="label-value">{{ item }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { PropType } from "vue";
export default defineComponent({
    props: {
        text: {
            type: [String, Number] as PropType<string | number>,
            default: '',
        },
        size: {
            type: Number,
            default: 11,
        },
        align: {
            type: String,
            default: 'left',
        },
        color: {
            type: String,
            default: 'black',
        },
        height: {
            type: String,
            default: '100%',
        },
        newline: {
            type: String,
            default: '',
        },
    },
    components: {
    },
    data: () => ({
    }),
    computed: {
        fontSize() {
            return this.size.toString()+'px';
        },
        textList() {
            if (this.newline !== '') {
                let strText = String(this.text);
                return strText.split(this.newline);
            }
            else {
                return null;
            }
        },
    },
    methods: {
    },
});
</script>

<style scoped lang="scss">
@import "public/assets/scss/commonHmi.scss";
.label-value {
    display: flex;
    align-items: center;
    justify-content: v-bind(align);
    color: v-bind(color);
    width: 100%;
    font-size: v-bind(fontSize);
    white-space: normal !important;
    word-break: break-word;
    padding: 0px;
    height: v-bind(height);
}
</style>