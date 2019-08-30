const fs = require('fs')
const isBase64 = require('is-base64')

const {
    SERVER_MESSAGE_GET_MESSAGES,
    SERVER_MESSAGE_SEND,
    SERVER_MESSAGE_RECEIVE,
    SERVER_MESSAGE_READ,
    SERVER_MESSAGE_READED,
} = require('../constants')

class Message {

    constructor(serviceContainer){
        this.configurationService = serviceContainer.get('configuration')
        this.connectionService = serviceContainer.get('connection')
        this.userService = serviceContainer.get('user')

        this.messages = []
        this.loadMessages()
   
        setInterval(() => {
            fs.writeFileSync('./data/messages.json', JSON.stringify(this.messages))
        }, this.configurationService.config.messages.save_interval * 1000)
    }

    loadMessages(){

        let usersFileExists = fs.existsSync('./data/messages.json')
    
        if(!usersFileExists){

            fs.writeFileSync('./data/messages.json', JSON.stringify(this.messages))
        } else {
 
            this.messages = JSON.parse(fs.readFileSync('./data/messages.json'))   
        }
    }

    onSend(connectionId, data){

        if(data.type !== 'text' && data.type !== 'image') return

        if(data.type === 'text' && data.content.length === 0) return
        if(data.type === 'image' && !isBase64(data.content, {mime: true})) return

        let sender = this.userService.userByConnectionId(connectionId)
        let recipient = this.userService.userById(data.to)


        if(!recipient || !sender) return

        let newId = this.messages.reduce((value, message) => {
            return message.id >= value ? (message.id + 1) : (value)
        }, 1)

        let index = this.messages.push({
            id: newId,
            from: sender.id,
            to: recipient.id,
            type: data.type,
            content: data.content,
            dateTime: new Date().toUTCString(),
            readed: false,
        }) - 1

        if(this.userService.isOnlineById(recipient.id)){
            this.connectionService.send(recipient.connectionId, SERVER_MESSAGE_RECEIVE, true, this.messages[index])
        }

        this.connectionService.send(connectionId, SERVER_MESSAGE_SEND, true, this.messages[index])
    }

    onRead(connectionId, data){

        let reader = this.userService.userByConnectionId(connectionId)
        let sender = this.userService.userById(data.id)
        
        if(!reader || !sender) return

        this.messages = this.messages.map((message) => {
            if(message.from === sender.id && message.to === reader.id){
                message.readed = true
            }
            return message
        })

        if(this.userService.isOnlineById(sender.id)){
            this.connectionService.send(sender.connectionId, SERVER_MESSAGE_READED, true, reader.id)
        }

        this.connectionService.send(connectionId, SERVER_MESSAGE_READ, true, sender.id)
    }

    onGetMessages(connectionId){

        let user = this.userService.userByConnectionId(connectionId)

        this.connectionService.send(connectionId, SERVER_MESSAGE_GET_MESSAGES, true, this.messagesByUserId(user.id))
    }

    messagesByUserId(id){
        return this.messages.filter((message) => message.from === id || message.to === id)
    }

}

module.exports = Message