<template>
    <input
        v-model="inputValue" :type="type" class="input"
        @input:modelValue="onChange" :placeholder="placeHolder" pattern="\d+\s?\w+"
        :disabled="disabled"
    />
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        textColor: {
            type: String,
            default: '#FFF',
        },
        modelValue: {
            type: [Number, String, Boolean, null] as PropType<number | string | Boolean | null>,
            required: true,
        },
        height: {
            type: String,
            default: '30px',
        },
        type: {
            type: String,
            default: 'text',
        },
        fontSize: {
            type: String,
            default: '10px',
        },
        placeHolder: {
            type: String,
            default: '',
        },
        width: {
            type: String,
            default: '100%',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'black',
        },
    },
    components: {
    },
    computed: {
        inputValue: {
            get() {
                return this.modelValue;
            },
            set(value:any) {
                this.$emit('update:modelValue', value);
            },
        },
    },
    data: () => ({
    }),
    methods: {
        onChange(event:any) {
            this.$emit('update:modelValue', event.target.value);
        }
    },
});
</script>

<style scoped lang="scss">
@import "public/assets/scss/commonDev.scss";
.input{
    height: v-bind(height);
    width: v-bind(width);
    font-size: v-bind(fontSize);
    border-bottom: 1px solid #b3b3b3;
    padding: 5px;
    color: v-bind(color);
}
</style>