<template>
    <div 
        class="counter" 
        v-if="count != 0"
    >
        {{displayCount}}
    </div>
</template>

<script>
export default {
    props: {
        count: Number,
    },
    computed: {
        displayCount() {
            return this.count > 9 ? '9+' : this.count
        },
    },
}
</script>

<style scoped>
    .counter {
        height: fit-content;
        width: 34px;
        text-align: center;
        font-size: 12px;
        background: #035AA6;
        color: #FFFFFF;
        border-radius: 15px;
    }
</style>
