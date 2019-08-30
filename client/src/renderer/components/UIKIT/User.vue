<template>
    <div 
        class="user" 
        @click="select" 
        :class="{ interlocutor: isInterlocutor }"
    >
        <div class="left">
            <avatar
                :image="user.avatar"
                :size="35"
            />
            <status class="status" :is-online="user.online"/>
        </div>
        <div class="right">
            <div class="top">
                <div class="username">{{user.username}}</div>
                <Messages-counter 
                    class="messages-counter" 
                    :count="unreadMessagesCount"
                />
            </div>
            <div class="last-message" v-if="lastMessage">
                <span v-if="lastMessage.type === 'text'">{{lastMessage.content}}</span>
                <i class="fa fa-image" v-if="lastMessage.type === 'image'"></i>
            </div>
        </div>
    </div>
</template>

<script>
import Avatar from '@/components/UIKIT/Avatar'
import Status from '@/components/UIKIT/Status'
import MessagesCounter from '@/components/UIKIT/MessagesCounter'

export default {
    components: {
        Avatar,
        Status,
        MessagesCounter,
    },
    props: {
        user: Object,
        isInterlocutor: Boolean,
        unreadMessagesCount: Number,
        lastMessage: Object,
    },
    methods: {
        select() {
            this.$emit('select', this.user)
        },
    }
}
</script>

<style scoped>
    .user {
        display: flex;
        cursor: pointer;
        border-bottom: 1px solid #EEEEEE;
    }

    .user:first-of-type {
        border-top: 1px solid #EEEEEE;
    }

    .user:hover {
        background: #EEEEEE;
    }

    .interlocutor {
        background: #EEEEEE;
        cursor: default;
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
        flex: 1;
        height: 65px;
        padding: 10px 0px 15px 0px;
    }

    .top {
        display: flex;
    }

    .username {
        font-weight: bold;
    }

    .messages-counter {
        position: absolute;
        top: 13px;
        right: 15px;
    }

    .last-message {
        box-sizing: border-box;
        width: 215px;
        padding-right: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #777;
    }
</style>
