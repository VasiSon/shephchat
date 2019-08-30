import Vue from 'vue'
import Vuex from 'vuex'
import Connection from '@/connection'

import {
    //USERS
    ACTION_USER_SIGN_IN,
    ACTION_USER_SIGN_UP,
    ACTION_USER_GET_USERS,
    ACTION_USER_LOGOUT,

    ACTION_ON_USER_LOGGED,
    ACTION_ON_USER_LOGOUT,
    ACTION_ON_USER_NEW_USER,
    
    CLIENT_USER_SIGN_IN,
    CLIENT_USER_SIGN_UP,
    CLIENT_USER_GET_USERS,
    CLIENT_USER_LOGOUT,

    SERVER_USER_SIGN_IN,
    SERVER_USER_SIGN_UP,
    SERVER_USER_GET_USERS,
    SERVER_USER_LOGGED,
    SERVER_USER_LOGOUT,
    SERVER_USER_NEW_USER,

    //MESSAGES
    ACTION_MESSAGE_GET_MESSAGES,
    ACTION_MESSAGE_SEND,
    ACTION_MESSAGE_READ,
    
    ACTION_ON_MESSAGE_READED,
    ACTION_ON_MESSAGE_RECEIVE,

    CLIENT_MESSAGE_SEND,
    CLIENT_MESSAGE_READ,
    CLIENT_MESSAGE_GET_MESSAGES,

    SERVER_MESSAGE_GET_MESSAGES,
    SERVER_MESSAGE_SEND,
    SERVER_MESSAGE_READ,
    SERVER_MESSAGE_RECEIVE,
    SERVER_MESSAGE_READED,

    ACTION_SET_INTERLOCUTOR,

    GETTER_INTERLOCUTOR_MESSAGES,
} from '@/constants'

Vue.use(Vuex)

const fs = require('fs')
let serverFile = `${process.cwd()}/server.txt`

if(!fs.existsSync(serverFile)) {
    alert(`${serverFile} не найден!`)
    process.kill(process.pid)
}

let serverIpPort = fs.readFileSync(serverFile, 'utf8')

if(!/^([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5])\.([01]?\d\d?|2[0-4]\d|25[0-5]):((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/.test(serverIpPort)){
    alert(`Содержимое ${serverFile} не содержит корректные ip:port`)
    process.kill(process.pid)
}
const connection = new Connection(serverIpPort)

const store = new Vuex.Store({
    state: {
        authUser: {
            id: null,
            login: null,
            username: null,
            avatar: null,
        },
        users: [],
        messages: [],
        interlocutor: null,
        loadings: 0,
    },
    actions: {
        [ACTION_USER_SIGN_IN](context, payload){
            return new Promise((resolve, reject) => {
                context.state.loadings++
                connection.sendSecured(CLIENT_USER_SIGN_IN, payload)
                connection.onceSecured(SERVER_USER_SIGN_IN, (data) => {
                    context.state.loadings--
                    if(data.error){
                        reject(data.error)
                    } else {
                        context.state.authUser = data
                        resolve(data)
                    }
                })
            })
        },
        [ACTION_USER_SIGN_UP](context, payload){
            return new Promise((resolve, reject) => {
                context.state.loadings++
                connection.sendSecured(CLIENT_USER_SIGN_UP, payload)
                connection.onceSecured(SERVER_USER_SIGN_UP, (data) => {
                    context.state.loadings--
                    if(data.error){
                        reject(data.error)
                    } else {
                        resolve(data)
                    }
                })
            })
        },
        [ACTION_USER_GET_USERS](context){
            return new Promise((resolve, reject) => {
                context.state.loadings++
                connection.sendSecured(CLIENT_USER_GET_USERS)
                connection.onceSecured(SERVER_USER_GET_USERS, (data) => {
                    context.state.loadings--
                    if(data.error){
                        reject(data.error)
                    } else {
                        context.state.users = data
                        resolve(data)
                    }
                })
            })
        },
        [ACTION_USER_LOGOUT](context){
            return new Promise((resolve, reject) => {
                connection.sendNoneSecured(CLIENT_USER_LOGOUT)
                context.state.authUser = {
                    id: null,
                    login: null,
                    username: null,
                    avatar: null,
                }
                context.state.users = []
                context.state.messages = []
                context.state.interlocutor = null
                resolve()
            })
        },
        [ACTION_ON_USER_LOGGED](context, payload){
            let user = context.state.users.find(user => user.id === payload.id)
            user.online = true
        },
        [ACTION_ON_USER_LOGOUT](context, payload){
            let user = context.state.users.find(user => user.id === payload.id)
            user.online = false
        },
        [ACTION_ON_USER_NEW_USER](context, payload){
            context.state.users.push(payload)
        },
        [ACTION_SET_INTERLOCUTOR](context, payload){
            context.state.interlocutor = payload
            
            if(!context.state.interlocutor) return

            if(context.state.messages.some((message) => message.from === payload.id && !message.readed)){
                context.dispatch(ACTION_MESSAGE_READ, payload.id)
            }
        },
        [ACTION_MESSAGE_GET_MESSAGES](context){
            return new Promise((resolve, reject) => {
                context.state.loadings++
                connection.sendSecured(CLIENT_MESSAGE_GET_MESSAGES)
                connection.onceSecured(SERVER_MESSAGE_GET_MESSAGES, (data) => {
                    context.state.loadings--
                    if(data.error){
                        reject(data.error)
                    } else {
                        context.state.messages = data
                        resolve(data)
                    }
                })
            })
        },
        [ACTION_MESSAGE_SEND](context, payload){
            return new Promise((resolve, reject) => {
                connection.sendSecured(CLIENT_MESSAGE_SEND, payload)
                connection.onceSecured(SERVER_MESSAGE_SEND, (data) => {
                    if(data.error){
                        reject(data.error)
                    } else {
                        context.state.messages.push(data)
                        resolve(data)
                    }
                })
            })
        },
        [ACTION_MESSAGE_READ](context, payload){
            return new Promise((resolve, reject) => {
                connection.sendSecured(CLIENT_MESSAGE_READ, {
                    id: payload,
                })
                connection.onceSecured(SERVER_MESSAGE_READ, () => {
                    context.state.messages = context.state.messages.map((message) => {
                        if(message.from === payload) {
                            message.readed = true
                        }
                        return message
                    })
                    resolve()
                })
            })
        },
        [ACTION_ON_MESSAGE_RECEIVE](context, payload){

            if(context.state.interlocutor && context.state.interlocutor.id === payload.from){
                this.dispatch(ACTION_MESSAGE_READ, payload.from)

                payload.readed = true
            }

            context.state.messages.push(payload)
        },
        [ACTION_ON_MESSAGE_READED](context, payload){
            context.state.messages = context.state.messages.map((message) => {
                if(message.to === payload) {
                    message.readed = true
                }
                return message
            })
        },

    },
    getters: {
        [GETTER_INTERLOCUTOR_MESSAGES](state){
            return state.messages.filter(message => message.from === state.interlocutor.id || message.to === state.interlocutor.id)
        },
    }
})

connection.onSecured(SERVER_USER_LOGGED, (data) => {
    store.dispatch(ACTION_ON_USER_LOGGED, data)
})

connection.onSecured(SERVER_USER_LOGOUT, (data) => {
    store.dispatch(ACTION_ON_USER_LOGOUT, data)
})

connection.onSecured(SERVER_USER_NEW_USER, (data) => {
    store.dispatch(ACTION_ON_USER_NEW_USER, data)
})

connection.onSecured(SERVER_MESSAGE_RECEIVE, (data) => {
    store.dispatch(ACTION_ON_MESSAGE_RECEIVE, data)
})

connection.onSecured(SERVER_MESSAGE_READED, (data) => {
    store.dispatch(ACTION_ON_MESSAGE_READED, data)
})

export default store