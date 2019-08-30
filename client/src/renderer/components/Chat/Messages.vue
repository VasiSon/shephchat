<template>
    <div class="messages">
        <message 
            v-for="message in messages" 
            :key="message.id"
            :message="message"   
        />
    </div>
</template>

<script>
import {
    mapGetters,
    mapActions,
} from 'vuex'

import {
    GETTER_INTERLOCUTOR_MESSAGES,
    ACTION_MESSAGE_READ,
} from '@/constants'

import Message from '@/components/UIKIT/Message'

export default {
    components: {
        Message,
    },
    computed: {
        ...mapGetters({
            messages: GETTER_INTERLOCUTOR_MESSAGES,
        }),
    },
    watch: {
        messages(newVal, oldVal){
            this.scrollToBottom()
        },
    },
    methods: {
        ...mapActions({
            actionReadMessages: ACTION_MESSAGE_READ,
        }),
        scrollToBottom(){
            setTimeout(() => {
                this.$el.scrollTop = this.$el.scrollHeight
            })   
        }
    },
    mounted(){
        this.scrollToBottom()
    }
}
</script>

<style scoped>
    .messages {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 234px);
    }
</style>
