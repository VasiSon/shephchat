<template>
    <div class="center-wrapper">
        <div class="user-form block">
            <h3 class="user-form__header">Регистрация</h3>
            <Alert
                type="error"
                :message="error"
                @close="error = ''"
            />
            <Alert
                type="success"
                :message="success"
                @close="success = ''"
            />
            <form>
                <form-input 
                    label="Логин" 
                    type="text" 
                    placeholder="Введите логин" 
                    help="Логин должен иметь длину от 6 до 24 символов и содержать только алфавитные символы и цифры"
                    v-model="login"
                    :is-valid="loginIsValid"
                    icon="fa fa-user"
                />  
                <form-input 
                    label="Пароль" 
                    type="password" 
                    placeholder="Введите пароль" 
                    help="Пароль должен содержать от 6 до 24 символов"
                    v-model="password"
                    :is-valid="passwordIsValid"
                    icon="fa fa-lock"
                />
                <form-input 
                    label="Имя пользователя" 
                    type="text" 
                    placeholder="Введите имя пользователя" 
                    help="Имя пользователя должно иметь длину от 6 до 24 символов и содержать только кирилические или латинские символы и цифры"
                    v-model="username"
                    :is-valid="usernameIsValid"
                    icon="fa fa-id-card"
                />
                <form-input 
                    label="Аватар" 
                    type="file"
                    accept="image/jpeg,image/png"
                    :is-valid="avatarIsValid"
                    icon="fa fa-image"
                    @change="onAvatarChanged"
                />
                <button 
                    class="btn btn-primary" 
                    :class="{disabled: !formIsValid}" 
                    @click.prevent="signUp"
                >
                    <span v-if="!loading">
                        Зарегистрироваться
                    </span>
                    <i class="fa fa-spinner fa-pulse" v-else></i>
                </button>
                <span> Есть аккаунт? </span> <a href="#" @click.prevent="toSignIn">Войти</a>.
            </form>
        </div>
    </div>
</template>

<script>
import { 
    mapActions,
    mapState,
} from 'vuex'

import { 
    ACTION_USER_SIGN_UP,
    ROUTE_SIGN_IN,
} from '@/constants'

import Alert from '@/components/UIKIT/Alert'
import FormInput from '@/components/UIKIT/FormInput'

export default {
    components: {
        Alert,
        FormInput,
    },
    data() {
        return {
            login: '',
            password: '',
            username: '',
            avatar: '',
            error: '',
            success: '',
        }
    },
    computed: {
        ...mapState({
            loading: state => state.loadings,
        }),
        loginIsValid(){
            const regexp = /^[a-zA-Z0-9-_]+$/
            return this.login.length >= 6 && this.login.length <= 24 && regexp.test(this.login)
        },
        passwordIsValid(){
            return this.password.length >= 6 && this.password.length <= 24
        },
        usernameIsValid(){
            const regexp = /^[a-zA-Zа-яА-Я0-9-_]+$/
            return this.username.length >= 6 && this.username.length <= 24 && regexp.test(this.username)
        },
        avatarIsValid(){
            return this.avatar != ''
        },
        formIsValid(){
            return this.loginIsValid && this.passwordIsValid && this.usernameIsValid && this.avatarIsValid
        },
    },
    methods: {
        ...mapActions({
            actionSignUp: ACTION_USER_SIGN_UP,
        }),
        onAvatarChanged(event){
            if(!event.target.files[0]){
                this.avatar = ''
                return
            }

            let filename = event.target.files[0].name.split('.')
            let extension = filename[filename.length - 1]
            
            let image = new Image();
            image.width = 150;
            image.height = 150;
            image.onload = () => {
                let canvas = document.createElement('canvas')
                canvas.width = 150
                canvas.height = 150
                let context = canvas.getContext('2d')
                context.drawImage(image, 0, 0, 150, 150)
                this.avatar = canvas.toDataURL(`image/${extension}`);
            }
            image.src = URL.createObjectURL(event.target.files[0]);
        },
        toSignIn(){
            this.$router.push({
                name: ROUTE_SIGN_IN
            })
        },
        signUp(){
            if(!this.formIsValid || this.loading) return
            
            this.actionSignUp({
                login: this.login,
                password: this.password,
                username: this.username,
                avatar: this.avatar,
            }).then(() => {
                this.success = 'Регистрация прошла успешно! Теперь Вы можете войти.'
            }).catch(error => {
                this.error = error
            })
        },
    },
}

</script>

<style scoped>
    .avatar {
        display: block;
        margin: 0 auto;
        width: 200px;
        height: 200px;
        margin-bottom: 15px;
    }

    .btn-back {
        float: right;
    }
</style>