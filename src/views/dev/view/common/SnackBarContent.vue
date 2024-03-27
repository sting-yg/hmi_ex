<template>
    <v-snackbar
        v-model="show"
        :location="location"
    >
        <span>{{ text ? text : '' }}</span>
        <template v-slot:actions>
            <v-btn
                color="blue"
                variant="text"
                @click="$emit('close')"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    props: {
        show: {
            type: Boolean,
        },
        text: {
            type: String,
        },
        // location: top / bottom / left / right / top start / top end / bottom start / bottom end
        location: {
            type: String,
            default: 'top',
        },
    },
    data: () => ({
        timeout: 2000,
    }),
    mounted() {
        setTimeout(() => {
            this.$emit('close');
        }, this.timeout);
    },
});
</script>

<style scoped lang="scss">
@import "public/assets/scss/commonHmi.scss";
</style>
