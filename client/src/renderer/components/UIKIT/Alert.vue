<template>
    <div 
        class="alert alert-dismissible" 
        role="alert" 
        v-if="message"
        :class="{
            'alert-danger': type === 'error',
            'alert-success': type === 'success',
        }"
    >
        <button type="button" class="close" data-dismiss="alert" aria-label="Close" @click="close">
            <span aria-hidden="true">&times;</span>
        </button>
        {{message}}
    </div>
</template>

<script>
export default {
    props: {
        type: String,
        message: String,
    },
    methods: {
        close() {
            this.$emit('close')
        }
    },
}
</script>
