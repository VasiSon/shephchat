<template>
    <div>
        <div class="filter-wrapper">
            <form-input
                type="text" 
                placeholder="Юзернейм ..." 
                v-model="filter"
                class="filter"
                size="md"
                icon="fa fa-filter"
            />
        </div>
        <div class="users" v-if="!loading">
            <user
                v-for="user in filteredUsers" 
                :key = "user.id"
                :user="user"
                :unread-messages-count="unreadMessagesCountFromUserId(user.id)"
                :last-message="lastMessageWithUserId(user.id)"
                :is-interlocutor="interlocutor && user.id === interlocutor.id"
                @select="setInterlocutor"
            />
        </div>
        <div class="loading" v-if="loading">
            <i class="fa fa-spinner fa-pulse fa-3x"></i>
        </div>
    </div>
</template>

<script>

import { 
    mapState,
    mapActions,
} from 'vuex'

import { 
    ACTION_USER_GET_USERS, 
    ACTION_SET_INTERLOCUTOR,
} from '@/constants';

import FormInput from '@/components/UIKIT/FormInput'
import User from '@/components/UIKIT/User'

export default {
    components: {
        FormInput,
        User,
    },
    data() {
        return {
            filter: "",
        }
    },
    computed: {
        ...mapState({
            loading: state => state.loadings,
            authUser: state => state.authUser,
            users: state => state.users,
            interlocutor: state => state.interlocutor,
            messages: state => state.messages,
        }),
        sortedUsers() {
            let sortedByUsername = this.users.sort((a, b) => {
                if(a.username > b.username) return 1
                if(a.username < b.username) return -1
                return 0
            })

            let sortedByLastMessage = sortedByUsername.sort((a, b) => {
                let lastMessageFromA = this.lastMessageWithUserId(a.id)
                let lastMessageFromB = this.lastMessageWithUserId(b.id)

                let lastMessageFromAId = lastMessageFromA ? lastMessageFromA.id : 0
                let lastMessageFromBId = lastMessageFromB ? lastMessageFromB.id : 0

                if(lastMessageFromAId > lastMessageFromBId) return -1
                if(lastMessageFromAId < lastMessageFromBId) return 1
                return 0
            })

            return sortedByLastMessage
        },
        filteredUsers(){
            return this.sortedUsers.filter((user) => user.username.includes(this.filter) && user.id != this.authUser.id)
        },
    },
    methods: {
        ...mapActions({
            actionGetUsers: ACTION_USER_GET_USERS,
            actionSetInterlocutor: ACTION_SET_INTERLOCUTOR,
        }),
        unreadMessagesCountFromUserId(id) {
            return this.messages.filter((message) => !message.readed && message.from === id).length
        },
        lastMessageWithUserId(id) {
            let messages = this.messages.filter((message) => message.from === id || message.to === id)
            
            if(messages.length === 0) return null

            let lastMessage = messages.reduce((previous, current) => {
                if(current.id > previous.id) return current
                return previous
            })
            
            return lastMessage
        },
        setInterlocutor(user) {
            this.actionSetInterlocutor(user)
        },
    },
    mounted(){
        this.actionGetUsers()
    },
}
</script>

<style scoped>
    .filter-wrapper {
        position: sticky;
        padding: 15px;
        z-index: 999;
        top: 0;
        background: #FFFFFF;
        background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,1) 100%);
    }

    .filter {
        margin-bottom: 0;
    }

    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100% - 80px);
    }
</style>

