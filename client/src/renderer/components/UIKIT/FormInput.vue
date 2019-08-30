<template>
    <div class="form-group">
        <label v-if="label">
            {{label}}
        </label>
        <div class="input-group">
            <div class="input-group-prepend" v-if="icon">
                <span class="input-group-text">
                    <i :class="icon"></i>
                </span>
            </div>
            <input 
                class="form-control"
                :class="{
                    'is-valid': isValid !== undefined && isValid, 
                    'is-invalid': isValid !== undefined && !isValid && blured,
                    'sm': size === 'sm',
                    }" 
                :type="type" 
                :placeholder="placeholder"
                :value="value"
                :accept="accept ? accept : '*'"
                @input="onInput"
                @change="onChange"
                @blur="onBlur"
            >
        </div>
        <small class="form-text text-muted" v-if="help && !isValid">
            {{help}}
        </small>
    </div>
</template>

<script>

export default {
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        label: String,
        type: String,
        placeholder: String,
        help: String,
        isValid: {
            type: Boolean,
            default: undefined,
        },
        value: String,
        size: {
            type: String,
            default: 'md',
        },
        icon: String,
        accept: String,
    },
    data(){
        return {
            blured: false
        }
    },
    methods: {
        onInput(event){
            this.$emit('input', event.target.value)
        },
        onChange(event){
            this.$emit('change', event)
        },
        onBlur(){
            this.blured = true
        }
    }
}

</script>

<style scoped>
    .sm {
        height: 28px;
        font-size: 12px;
    }
</style>
