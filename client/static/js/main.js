//Теперь у типа "Число" есть метод добавления ведущего нуля
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

//Сокет
window.socket = null;

//Создаем приложение
var app = new Vue({
  	el: '#app',
  	data: {
  		nickname: "",
    	users: [],
    	dialogs: [],
        connected: false,
        aes: null,
        currentInterlocutorId: -1,
        lastMessageFrom: -1,
  	},
    watch: {
        currentInterlocutorId: function(val, oldVal){
            var dialog = this.dialogs.find(dialog => dialog.interlocutorId == this.currentInterlocutorId);
            //Нужно проверить, есть ли непрочитанные сообщения
            if(dialog != null && dialog.newMessages > 0){
                dialog.newMessages = 0;
            }
        }
    },
  	methods: {
        connect: function(ip){
            //На всякий случай
            if(window.socket != null){
                window.socket.disconnect();
            }
            window.socket = io('http://' + ip + ':3000');

            alert("Установка соединения ...");      //ТО САМОЕ УВЕДОМЛЕНИЕ

            //Вход выполнен
            window.socket.on('nickname-selected', (nickname) => {
                this.nickname = nickname;
            });
            //Пользователи в сети получены
            window.socket.on('users-received', (users) => {
                this.users = users;
            });
            //Подключился новый пользователь
            window.socket.on('new-user-joined', (user) => {
                this.users.push(user);
            });
            //Получено сообщение
            window.socket.on('received-message', (data) => {
                var date = new Date();
                //Проверить наличие диалога
                var dialog = this.dialogs.find(dialog => dialog.interlocutorId == data.senderId);
                if(dialog == null){
                    //создать диалог
                    this.dialogs.push({
                        interlocutorId: data.senderId,
                        key: data.key,
                        messages: [
                            {
                                type: 'incoming',
                                text: this.aes.decryptText(data.text, data.key),
                                time: date.getHours().pad() + ":" + date.getMinutes().pad(),
                            }
                        ],
                        newMessages: 0,
                    });
                    //Снова ищем диалог, так как при первом поиске = null
                    dialog = this.dialogs.find(dialog => dialog.interlocutorId == data.senderId); //чтоб далее увеличить счетчик сообщений
                } else {
                    //Записать сообщение в диалог
                    dialog.messages.push({
                        type: 'incoming',
                        text: this.aes.decryptText(data.text, dialog.key),
                        time: date.getHours().pad() + ":" + date.getMinutes().pad(),
                    });
                }
                //Уведомляем о новом сообщении
                if(this.currentInterlocutorId != data.senderId){
                    dialog.newMessages++;
                } else {
                    this.lastMessageFrom = data.senderId;
                }
            });
            //Один из пользователей отключился
            window.socket.on('user-leave', (data) => {
                //Если общались с этим пользователем
                if(data.id == this.currentInterlocutorId) this.currentInterlocutorId = -1;
                //очистить запись в массиве диалогов и пользователей; Вывести уведомление
                var userIndex = this.users.indexOf(this.users.find(user => user.id == data.id));
                this.users.splice(userIndex, 1);
                //Удалить диалог (если есть)
                var dialogIndex = this.dialogs.indexOf(this.dialogs.find(dialog => dialog.interlocutorId == data.id));
                if(dialogIndex != -1){
                    this.dialogs.splice(dialogIndex, 1);
                }
            });
            //Проверка подключения
            setTimeout(() => {
                if(window.socket.connected){
                    this.connected = true;
                }
            }, 500);
        },
        selectNickname: function(nickname){
            //Отправка сообщения серверу
            window.socket.emit('select-nickname', nickname);
        },
        openDialog: function(InterlocutorId){
            this.currentInterlocutorId = InterlocutorId;
        },
        sendMessage: function(message){
            var date = new Date();
            var key = null;
            var dialog = this.dialogs.find(dialog => dialog.interlocutorId == this.currentInterlocutorId);
            if(dialog == null){
                //Сгенерировать ключ
                key = this.generateKey(24);
                //Создать экземпляр диалога
                this.dialogs.push({
                    interlocutorId: this.currentInterlocutorId,
                    key: key,
                    messages: [
                        {
                            type: 'outgoing',
                            text: message,
                            time: date.getHours().pad() + ":" + date.getMinutes().pad(),
                        }
                    ],
                    newMessages: 0,
                });
                //Зашифровать текст
                encryptedText = this.aes.encryptText(message, key);
            } else {
                //Записать сообщение в диалог
                dialog.messages.push({
                    type: 'outgoing',
                    text: message,
                    time: date.getHours().pad() + ":" + date.getMinutes().pad(),
                });
                //Зашифровать текст
                encryptedText = this.aes.encryptText(message, dialog.key);
            }
            //Отправить на сервер
            window.socket.emit('send-message', {
                text: encryptedText,
                key: key,
                recepientId: this.currentInterlocutorId,
            });
        },
        generateKey: function(size){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < size; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
  	},
    mounted: function(){
        this.aes = new pidCrypt.AES.CBC();
    }
})
