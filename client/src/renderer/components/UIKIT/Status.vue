<template>
    <div 
        class="status" 
        :class="{
            'online': isOnline,
            'offline': !isOnline,
        }"
    />
</template>

<script>
export default {
    props: {
        isOnline: Boolean,
    },
}
</script>

<style scoped>
    .status {
        box-sizing: border-box;
        width: 15px;
        height: 15px;
        border-radius: 15px;
        border: 1px solid #999999;
    }

    .online {
        background: #33EE33;
    }

    .offline {
        background: #DDDDDD;
    }
</style>