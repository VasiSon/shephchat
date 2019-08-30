<template>
    <div class="center-wrapper">
        <div class="column-left">
            <users class="users block"/>
            <account class="account block"/>
        </div>
        <div class="column-right block">
            <chat/>
        </div>
    </div>
</template>

<script>
import Users from '@/components/Users'
import Account from '@/components/Account'
import Chat from '@/components/Chat/Chat'

export default {
    components: {
        Users,
        Account,
        Chat,
    },
}
</script>

<style scoped>
    .column-left {
        width: 280px;
        height: 100%;
    }
    
    .column-right {
        flex: 1;
        max-width: 960px;
        height: 100%;
        margin-left: 15px;        
    }

    .users {
        height: calc(100% - 80px);
        overflow-y: auto;
    }

    .users::-webkit-scrollbar { 
        width: 0; 
    }

    .account {
        margin-top: 15px;
    }
</style>
