<template>
    <div class="center-wrapper">
        <div class="user-form block">
            <h3 class="user-form__header">Вход</h3>
            <Alert
                type="error"
                :message="error"
                @close="error = ''"
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
                <button
                    class="btn btn-primary"
                    :class="{disabled: !formIsValid}" 
                    @click.prevent="signIn"
                >
                    <span v-if="!loading">
                        Войти
                    </span>
                    <i class="fa fa-spinner fa-pulse" v-else></i>
                </button>
                <span> Нет аккаунта?</span> <a href="#" @click.prevent="toSignUp"> Создать</a>.
            </form>
        </div>
    </div>
</template>

<script>
import {
    mapState,
    mapActions,
} from 'vuex'

import {
    ACTION_USER_SIGN_IN,
    ROUTE_SIGN_UP,
    ROUTE_MAIN,
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
            error: '',
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
        formIsValid(){
            return this.loginIsValid && this.passwordIsValid
        },
    },
    methods: {
        ...mapActions({
            actionSignIn: ACTION_USER_SIGN_IN,
        }),
        toSignUp(){
            this.$router.push({
                name: ROUTE_SIGN_UP,
            })
        },
        signIn(){
            if(!this.formIsValid  || this.loading) return

            this.actionSignIn({
                login: this.login,
                password: this.password,
            }).then(() => {
                this.$router.push({
                    name: ROUTE_MAIN
                })
            }).catch((error) => {
                this.error = error
            })
        },
    },
}

</script>
