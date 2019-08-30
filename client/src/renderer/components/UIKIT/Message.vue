<template>
    <div 
        class="wrapper"
        :class="{'not-readed': !message.readed}"    
    >
        <div 
            class="message"
            :class="{
                'incoming': isIncoming,
                'outcoming': !isIncoming,
                'message-text': message.type === 'text',
                'message-image': message.type === 'image',
            }"
        >
            <div class="content">
                <span v-if="message.type === 'text'">{{message.content}}</span>
                <img v-if="message.type === 'image'" :src="message.content"/>
            </div>
            <div class="date-time">
                <i>{{message.dateTime}}</i>
            </div>
        </div>
        
    </div>
</template>

<script>

import {
    mapState,
} from 'vuex'

export default {
    props: {
        message: Object,
    },
    computed: {
        ...mapState({
            authUser: state => state.authUser,
        }),
        isIncoming(){
            return this.message.to === this.authUser.id
        },
    }
}
</script>

<style scoped>

    .wrapper {
        padding: 10px 15px;
        display: flex;
        flex-direction: column;
    }

    .message {
        padding: 5px 10px;
        border-radius: 3px;
        -webkit-box-shadow: 0px 1px 3px 0px rgba(50, 50, 50, 0.3);
        -moz-box-shadow:    0px 1px 3px 0px rgba(50, 50, 50, 0.3);
        box-shadow:         0px 1px 3px 0px rgba(50, 50, 50, 0.3);
    }

    .message-text {
        max-width: 70%;
    }

    .message-image {
        max-width: 30%;
    }

    .content {
        font-size: 14px;
    }

    .content > img {
        margin-top: 5px;
        max-width: 100%;
    }

    .date-time {
        font-size: 10px;
    }

    .incoming {
        background: #EEEEEE;
        align-self: flex-start;
    }

    .outcoming {
        background: #343a40;
        color: white;
        align-self: flex-end;
    }

    .outcoming > .date-time {
        text-align: right;
    }

    .not-readed {
        background: #F4F4F4;
    }
</style>
