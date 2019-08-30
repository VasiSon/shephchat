const IO = require('socket.io')
const IP = require('ip')
const cryptico = require('cryptico')
const helpers = require('../helpers')
const Base64 = require('js-base64').Base64

const {
    CLIENT_CONNECTION,
    SERVER_CONNECTION_SECURED,
} = require('../constants')

class Connection {

    constructor(serviceContainer) {
        this.configurationService = serviceContainer.get('configuration')
        
        this.server = null
        this.routes = []
        this.securedConnections = []
    }

    serverStart() {
        this.server = IO(this.configurationService.config.host.port)
        this.bindRoutes()
        console.log(`server started on <${IP.address()}:${this.configurationService.config.host.port}>`)
    }

    serverStop() {
        this.server.close()
        this.server.unsetRoutes()
    }

    onDisconnect(connectionId) {
        this.removeSecuredConnectionById(connectionId)
    }

    onSecureConnection(connectionId, data) 
        if(this.securedConnectionById(connectionId)) {
            return
        }

        let key = helpers.getRandomString(32)
    
        this.securedConnections.push({
            id: connectionId,
            key: key
        })

        this.send(connectionId, SERVER_CONNECTION_SECURED, false, {
            encryptedKey: cryptico.encrypt(key, data.publicKey).cipher,
        })
    }

    send(connectionId, eventName, isCrypt, data) {

        let dataString = this.serialize(data)
        let dataPrepared = isCrypt ? this.encrypt(connectionId, dataString) : dataString

        this.server.to(connectionId).emit(eventName, dataPrepared)
    }

    sendToMany(connectionIds, eventName, isCrypt, data) {

        let dataString = this.serialize(data)

        connectionIds.forEach((connectionId) => {

            let dataPrepared = isCrypt ? this.encrypt(connectionId, dataString) : dataString
  
            this.server.to(connectionId).emit(eventName, dataPrepared)
        })
    }

    securedConnectionById(id){
        return this.securedConnections.find((securedConnection) => securedConnection.id === id)
    }

    removeSecuredConnectionById(id){
        let index = this.securedConnections.findIndex((securedConnection) => securedConnection.id === id)

        if(index === -1) return

        this.securedConnections.splice(index, 1)
    }

    decrypt(connectionId, encryptedData){
        let securedConnection = this.securedConnectionById(connectionId)
        return cryptico.decryptAESCBC(encryptedData, securedConnection.key)
    }

    encrypt(connectionId, data){
        let securedConnection = this.securedConnectionById(connectionId)
        return cryptico.encryptAESCBC(data, securedConnection.key)
    }

    addRoutes(routes){
        routes.forEach((route) => {
            this.routes.push(route)
        })
    }

    bindRoutes(){
        this.server.on(CLIENT_CONNECTION, (socket) => {
            this.routes.forEach((route) => {
                socket.on(route.name, (data) => {
  
                    let dataString = route.isCrypt ? this.decrypt(socket.id, data) : data
                    
                    let preparedData
           
                    if(route.withData){
                        try {
                            preparedData = this.deserialize(dataString)
                        } catch(error) {
                            return
                        }
                    }
            
                    route.handler(socket.id, preparedData)
                })
            })
        })
    }

    serialize(data) {
        return Base64.encode(JSON.stringify(data))
    }
    
    deserialize(data) {
        return JSON.parse(Base64.decode(data))
    }

}

module.exports = Connection