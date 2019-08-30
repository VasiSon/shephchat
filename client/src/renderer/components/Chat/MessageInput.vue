<template>
    <div class="message-input">
        <div class="text-field">
            <textarea 
                class="form-control" 
                v-model="text" 
                placeholder="Ваше сообщение ..." 
                rows="3"
                @keydown.enter.prevent="onSendText"
            ></textarea>
        </div>
        <div class="panel">
            <div class="buttons">
                <label class="btn btn-default" v-if="!imageLoading">
                    <i class="fa fa-image"></i> 
                    <input 
                        type="file" 
                        accept="image/jpeg,image/png" 
                        hidden
                        @change="onSendImage"
                    >
                </label>
                <button class="btn btn-default" v-if="imageLoading">
                    <i class="fa fa-spinner fa-pulse"></i>
                </button>
            </div>
            <div class="send-wrapper">
                <button class="btn btn-primary" @click="onSendText">Отправить</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            text: "",
            imageLoading: false,
        }
    },
    methods: {
        onSendText(){
            this.$emit('send', {
                type: 'text',
                content: this.text,
            })
            this.text = ""
        },
        onSendImage(event){
            this.imageLoading = true
            if(!event.target.files[0]){
                this.imageLoading = false
                return
            }
            let filename = event.target.files[0].name.split('.')
            let extension = filename[filename.length - 1]
            
            let image = new Image();
            image.onload = () => {
                let width, height

                let widthIsMax = image.naturalWidth > image.naturalHeight
                let ratio = image.naturalWidth / image.naturalHeight
                
                if(widthIsMax){
                    width = image.naturalWidth > 800 ? 800 : image.naturalWidth
                    height = width / ratio
                } else {
                    height = image.naturalHeight > 800 ? 800 : image.naturalHeight
                    width = height * ratio
                }

                let canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                let context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, width, height)
                this.$emit('send', {
                    type: 'image',
                    content: canvas.toDataURL(`image/${extension}`),
                })
                this.imageLoading = false
            }
            image.src = URL.createObjectURL(event.target.files[0]);
        },
    },
}
</script>

<style scoped>
    .message-input {
        height: 154px;
    }

    .text-field {
        padding: 15px;
    }

    .form-control {
        resize: none;
    }

    .buttons {
        padding: 0 15px;
        float:left;
    }

    .send-wrapper {
        padding: 0 15px;
        float: right;
    }
</style>
