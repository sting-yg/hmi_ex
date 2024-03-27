<template>
    <v-btn class="btn" block :disabled="disabled ? true : false">
        <slot></slot>
    </v-btn>
</template>

<script lang="ts">
import { defineComponent } from "vue"
export default defineComponent({
    props: {
        textColor: {
            type: String,
            default: '#FFF',
        },
        bgColor: {
            type: String,
            default: '#3F51B5',
        },
        height: {
            type: String,
            default: '32px',
        },
        disabled: {
            type: Boolean,
        },
    },
    components: {
    },
    data: () => ({
    }),
    methods: {
    },
});
</script>

<style scoped lang="scss">
@import "public/assets/scss/commonHmi.scss";
.btn {
    height: v-bind(height);
    background-color: v-bind(bgColor) !important;
    color: v-bind(textColor) !important;
    font-size: 10px;
    flex-grow: 1;
    padding: 0px;
}
</style>