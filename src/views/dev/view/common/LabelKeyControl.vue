<template>
    <span v-if="textList === null" class="label-key">{{ text }}</span>
    <span v-else v-for="(item, index) in textList" :key="index" class="label-key">{{ item }}</span>
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
        fontWeight: {
            type: String,
            default: 'bold',
        },
        align: {
            type: String,
            default: 'left',
        },
        color: {
            type: String,
            default: '#000000',
        },
        height: {
            type: String,
            default: '100%',
        },
        newline: {
            type: String,
            default: '',
        },
        whiteSpace: {
            type: String,
            default: 'normal',
        },
        wordBreak: {
            type: String,
            default: 'break-word',
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
.label-key {
    display: flex;
    align-items: center;
    justify-content: v-bind(align);
    font-weight: v-bind(fontWeight);
    color: v-bind(color);
    width: 100%;
    font-size: v-bind(fontSize);
    height: v-bind(height);
    white-space: v-bind(whiteSpace) !important;
    word-break: v-bind(wordBreak);
    padding: 0px;
}
</style>