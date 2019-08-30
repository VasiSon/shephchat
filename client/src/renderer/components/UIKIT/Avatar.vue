<template>
    <img class="avatar"
        :style="styles"
        :src="image"
    />
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
            default: 35,
        },
        radius: {
            type: Number,
            default: 999,
        }
    },
    computed: {
        styles() {
            return {
                'width': `${this.size}px`,
                'height': `${this.size}px`,
                'border-radius': `${this.radius}px`,
            }
        }
    }
}
</script>