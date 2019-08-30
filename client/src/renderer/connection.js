import IO from 'socket.io-client'
import cryptico from 'cryptico'
import { Base64 } from 'js-base64'

import { 
    CLIENT_CONNECTION_SECURE,
    SERVER_CONNECT,
    SERVER_CONNECTION_SECURED,
} from '@/constants'

class Connection {
    constructor(ip){
        this.socket = null
        this.keys = {
            rsa: {
                public: '',
                private: '',
            },
            aes: '',
        }

        this.socket = IO.connect(`ws://${ip}`, {
            upgrade: false,
            transports: ['websocket'],
        })
        
        this.on(SERVER_CONNECT, () => {
            this.generateRSAKeys()
            
            this.onceNoneSecured(SERVER_CONNECTION_SECURED, (data) => {
                this.keys.aes = cryptico.decrypt(data.encryptedKey, this.keys.rsa.private).plaintext
            })
            
            this.sendNoneSecured(CLIENT_CONNECTION_SECURE, {
                publicKey: this.keys.rsa.public,
            })
        })

        this.on('connect_error', (err) => {
            alert("Не удалось установить соединение с сервером!")
        })
    }

    send(event, data){
        this.socket.emit(event, data)
    }
    on(event, callback){
        this.socket.on(event, callback)
    }
    once(event, callback){
        this.socket.once(event, callback)
    }

    sendNoneSecured(event, data){
        this.send(event, this.serialize(data ? data : {}))
    }
    sendSecured(event, data){
        this.send(event, this.encrypt(this.serialize(data)))
    }
    onceNoneSecured(event, callback){
        this.once(event, (data) => {
            callback(this.deserialize(data))
        })
    }
    onceSecured(event, callback){
        this.once(event, (data) => {
            callback(this.deserialize(this.decrypt(data)))
        })
    }
    onNoneSecured(event, callback){
        this.on(event, (data) => {
            callback(this.deserialize(data))
        })
    }
    onSecured(event, callback){
        this.on(event, (data) => {
            callback(this.deserialize(this.decrypt(data)))
        })
    }

    encrypt(data) {
        return cryptico.encryptAESCBC(data, this.keys.aes)
    }

    decrypt(data) {
        return cryptico.decryptAESCBC(data, this.keys.aes)
    }

    generateRSAKeys() {       
        let entropy = Math.random().toString(16).substring(2)
        this.keys.rsa.private = cryptico.generateRSAKey(entropy, 1024)
        this.keys.rsa.public = cryptico.publicKeyString(this.keys.rsa.private)
    }

    serialize(data) {
        return Base64.encode(JSON.stringify(data))
    }
    
    deserialize(data) {
        return JSON.parse(Base64.decode(data))
    }
}

export default Connection