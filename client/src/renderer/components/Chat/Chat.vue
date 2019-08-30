<template>
    <div class="chat-container">
        <div class="chat" v-if="interlocutor">
            <interlocutor 
                :interlocutor="interlocutor"
                @close="this.close"
            />
            <messages/>
            <message-input 
                class="message-input"
                @send="this.send"
            />
        </div>
        <div class="chat-none" v-if="!interlocutor">
            Чтобы начать диалог, выберите собеседника
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
} from 'vuex'

import {
    ACTION_SET_INTERLOCUTOR,    
    GETTER_INTERLOCUTOR_MESSAGES,
    ACTION_MESSAGE_GET_MESSAGES,
    ACTION_MESSAGE_SEND,
} from '@/constants'

import Interlocutor from '@/components/UIKIT/Interlocutor'
import Messages from '@/components/Chat/Messages'
import MessageInput from '@/components/Chat/MessageInput'

export default {
    components: {
        Interlocutor,
        Messages,
        MessageInput,
    },
    computed: {
        ...mapState({
            interlocutor: state => state.interlocutor,
        }),
    },
    methods: {
        ...mapActions({
            actionSendMessage: ACTION_MESSAGE_SEND,
            actionGetMessages: ACTION_MESSAGE_GET_MESSAGES,
            actionSetInterlocutor: ACTION_SET_INTERLOCUTOR,
        }),
        close(){
            this.actionSetInterlocutor(null)
        },
        send(data){
            this.actionSendMessage({
                type: data.type,
                content: data.content,
                to: this.interlocutor.id,
            })
        },
    },
    mounted(){
        this.actionGetMessages()
    },
}
</script>

<style scoped>
    .chat-container {
        height: 100%;
    }

    .chat {
        height: 100%;
        position: relative;
    }

    .chat-none {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }
</style>
