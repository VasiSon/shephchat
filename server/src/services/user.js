const sha3 = require('js-sha3').sha3_256
const fs = require('fs')
const isBase64 = require('is-base64')

const {
    SERVER_USER_SIGN_IN,
    SERVER_USER_SIGN_UP,
    SERVER_USER_NEW_USER,
    SERVER_USER_GET_USERS,
    SERVER_USER_LOGGED,
    SERVER_USER_LOGOUT,
} = require('../constants')

class User {

    constructor(serviceContainer){
        this.connectionService = serviceContainer.get('connection')

        this.users = []
        this.loadUsers()
    }

    loadUsers(){
        
        let usersFileExists = fs.existsSync('./data/users.json')
      
        if(!usersFileExists){
           
            fs.writeFileSync('./data/users.json', JSON.stringify(this.users))
        } else {
         
            this.users = JSON.parse(fs.readFileSync('./data/users.json'))   
        }
    }

    saveUsers(){
      
        let users = this.users.map((user) => {
            return {
                id: user.id,
                login: user.login,
                password: user.password,
                username: user.username,
                avatar: user.avatar,
            }
        })
        fs.writeFileSync('./data/users.json', JSON.stringify(this.users))
    }

    onSignIn(connectionId, data){
  
        if(!this.signInValidate(data.login, data.password)) return


        let user = this.users.find((user) => user.login === data.login && user.password === sha3(data.password))


        if(!user){
            this.connectionService.send(connectionId, SERVER_USER_SIGN_IN, true, {
                error: 'Неверная пара логин/пароль',
            })
            return
        }


        this.makeOnline(user, connectionId)

        this.connectionService.send(connectionId, SERVER_USER_SIGN_IN, true, {
            id: user.id,
            login: user.login,
            username: user.username,
            avatar: user.avatar,
        })
    }

    onSignUp(connectionId, data){
        if(!this.signUpValidate(data.login, data.password, data.username, data.avatar)) return

 
        if(this.users.find((user) => user.login === data.login)){
            this.connectionService.send(connectionId, SERVER_USER_SIGN_UP, true, {
                error: 'Пользователь с заданным логином уже существует',
            })
            return
        }


        let newId = this.users.reduce((value, user) => {
            return user.id >= value ? (user.id + 1) : (value)
        }, 1)


        let user = {
            id: newId,
            login: data.login,
            password: sha3(data.password),
            username: data.username,
            avatar: data.avatar,
        }
        this.users.push(user)
        this.saveUsers()


        this.connectionService.send(connectionId, SERVER_USER_SIGN_UP, true, {})

   
        this.connectionService.sendToMany(this.getOnlineUsers().map((onlineUser) => onlineUser.connectionId), SERVER_USER_NEW_USER, true, {
            id: user.id,
            login: user.login,
            username: user.username,
            avatar: user.avatar,
            online: false,
        })
    }

    onGetUsers(connectionId){

        let users = this.users.map((user) => {
            return {
                id: user.id,
                login: user.login,
                username: user.username,
                avatar: user.avatar,
                online: user.connectionId ? true : false,
            }
        })

        this.connectionService.send(connectionId, SERVER_USER_GET_USERS, true, users)
    }

    onLogout(connectionId){
        let user = this.userByConnectionId(connectionId)

        if(!user){
            return
        }

        this.makeOffline(user)
    }

    makeOnline(user, connectionId){

        this.connectionService.sendToMany(this.getOnlineUsers().map((onlineUser) => onlineUser.connectionId), SERVER_USER_LOGGED, true, {
            id: user.id,
        })

        user['connectionId'] = connectionId
    }

    makeOffline(user){

        delete user['connectionId']

        this.connectionService.sendToMany(this.getOnlineUsers().map((onlineUser) => onlineUser.connectionId), SERVER_USER_LOGOUT, true, {
            id: user.id,
        })
    }

    userById(id) {
        return this.users.find((user) => user.id === id) 
    }

    userByConnectionId(connectionId) {
        return this.users.find((user) => user.connectionId === connectionId) 
    }

    getOnlineUsers() {
        return this.users.filter((user) => user.connectionId !== undefined)
    }

    getUsersExceptId(id) {
        return this.users.filter((user) => user.id !== id)
    }

    isOnlineById(id){
        return Boolean(this.users.find((user) => user.id === id).connectionId)
    }
    
    signInValidate(login, password) {
        const loginRegexp = /^[a-zA-Z0-9-_]+$/
        const loginIsValid =  login.length >= 6 && login.length <= 24 && loginRegexp.test(login)

        const passwordIsValid = password.length >= 6 && password.length <= 24

        return loginIsValid && passwordIsValid
    }

    signUpValidate(login, password, username, avatar) {
        const loginRegexp = /^[a-zA-Z0-9-_]+$/
        const loginIsValid =  login.length >= 6 && login.length <= 24 && loginRegexp.test(login)

        const passwordIsValid = password.length >= 6 && password.length <= 24

        const usernameRegexp = /^[a-zA-Zа-яА-Я0-9-_]+$/
        const usernameIsValid = username.length >= 6 && username.length <= 24 && usernameRegexp.test(username)
        
        const avatarIsValid = isBase64(avatar, {mime: true})

        return loginIsValid && passwordIsValid && usernameIsValid && avatarIsValid
    }

}

module.exports = User