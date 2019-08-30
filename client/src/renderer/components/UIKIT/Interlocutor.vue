<template>
    <div class="interlocutor">
        <div class="button-close" @click="close">
            <i class="fa fa-close"></i>
        </div>
        <div class="left">
            <avatar
                :image="interlocutor.avatar"
                :size="35"
            />
            <status class="status" :is-online="interlocutor.online"/>
        </div>
        <div class="right">
            <div class="username">{{interlocutor.username}}</div>
        </div>
    </div>
</template>

<script>
import Avatar from '@/components/UIKIT/Avatar'
import Status from '@/components/UIKIT/Status'

export default {
    components: {
        Avatar, 
        Status,
    },
    props: {
        interlocutor: Object,
    },
    methods: {
        close(){
            this.$emit('close')
        }
    },
}
</script>

<style scoped>
    .interlocutor {
        display: flex;
        position: relative;
        box-sizing: border-box;
        height: 65px;
        overflow: hidden;
        border-bottom: 1px solid #EEEEEE;
    }

    .left {
        box-sizing: border-box;
        position: relative;
        width: 65px;
        height: 65px;
        padding: 15px;
    }

    .status {
        position: absolute;
        bottom: 12.5px;
        right: 12.5px;
    }

    .right {
        box-sizing: border-box;
        position: relative;
        height: 65px;
        padding: 20px 0 0 0;
    }

    .top {
        display: flex;
    }

    .username {
        font-weight: bold;
    }

    .button-close {
        position: absolute;
        top: 20px;
        right: 25px;
        z-index: 999;
        cursor: pointer;
    }
</style>
