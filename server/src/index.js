const {
    CLIENT_DISCONNECT,
    CLIENT_CONNECTION_SECURE,
    CLIENT_USER_SIGN_IN,
    CLIENT_USER_SIGN_UP,
    CLIENT_USER_GET_USERS,
    CLIENT_USER_LOGOUT,
    CLIENT_MESSAGE_GET_MESSAGES,
    CLIENT_MESSAGE_SEND,
    CLIENT_MESSAGE_READ,
} = require('./constants')


var serviceContainer = require('./serviceContainer')

var connectionService = serviceContainer.get('connection')
var userService = serviceContainer.get('user')
var messageService = serviceContainer.get('message')


connectionService.addRoutes([
    { name: CLIENT_CONNECTION_SECURE, handler: connectionService.onSecureConnection.bind(connectionService), isCrypt: false, withData: true },
    { name: CLIENT_DISCONNECT, handler: connectionService.onDisconnect.bind(connectionService), isCrypt: false, withData: false },
    { name: CLIENT_USER_SIGN_IN, handler: userService.onSignIn.bind(userService), isCrypt: true, withData: true },
    { name: CLIENT_USER_SIGN_UP, handler: userService.onSignUp.bind(userService), isCrypt: true, withData: true },
    { name: CLIENT_USER_GET_USERS, handler: userService.onGetUsers.bind(userService), isCrypt: false, withData: false },
    { name: CLIENT_USER_LOGOUT, handler: userService.onLogout.bind(userService), isCrypt: false, withData: false },
    { name: CLIENT_DISCONNECT, handler: userService.onLogout.bind(userService), isCrypt: false, withData: false },
    { name: CLIENT_MESSAGE_GET_MESSAGES, handler: messageService.onGetMessages.bind(messageService), isCrypt: false, withData: false},
    { name: CLIENT_MESSAGE_SEND, handler: messageService.onSend.bind(messageService), isCrypt: true, withData: true },
    { name: CLIENT_MESSAGE_READ, handler: messageService.onRead.bind(messageService), isCrypt: true, withData: true },
])

connectionService.serverStart()