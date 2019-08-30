<template>
    <div class="account">
        <avatar 
            :image="authUser.avatar"
            :size="35"
        />
        <span class="username">{{authUser.username}}</span>
        <button class="btn btn-danger btn-sm btn-quit" @click="logout">
            <i class="fa fa-sign-out"></i>
        </button>
    </div>
</template>

<script>
import { 
    mapState,
    mapActions, 
} from 'vuex'

import {
    ACTION_USER_LOGOUT,
    ROUTE_SIGN_IN,
} from '@/constants'

import Avatar from '@/components/UIKIT/Avatar'

export default {
    components: {
        Avatar,
    },
    computed: {
        ...mapState({
            authUser: state => state.authUser
        }),
    },
    methods: {
        ...mapActions({
            actionLogout: ACTION_USER_LOGOUT
        }),
        logout(){
            this.actionLogout().then(() => {
                this.$router.push(ROUTE_SIGN_IN)
            })
        },
    },
}
</script>

<style scoped>
    .account {
        box-sizing: border-box;
        position: relative;
        padding: 15px;
        height: 65px !important;
    }

    .username {
        font-weight: bold;
        padding-left: 15px;
    }

    .btn-quit {
        position: absolute;
        right: 15px;
        top: 17.5px;
    }
</style>
