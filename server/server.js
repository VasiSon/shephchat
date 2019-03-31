//Пользователи с никнеймом
var users = [];
//Идентификатор
var nextId = 1;

//Возвращает пользователя по идентификатору
function userById(id){
	return users.find(user => user.id == id);
}

//Возвращает пользователя по идентификатору сокета
function userBySocketId(socketId){
	return users.find(user => user.socketId == socketId);
}

//Создание сервера
const io = require('socket.io')(3000, {
	serveClient: false,
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
});

console.log('server started!');

//Далее идет подписка на события
io.on('connection', (socket) => {
  	console.log('a user connected, socket: ' + socket.id);
  	//Пользователь выбрал никнейм

	//Отправить пользователю список уже подключенных пользователей
	socket.emit('users-received', users);
	//Пользователь выбрал никнейм
  	socket.on('select-nickname', (nickname) => {
  		//Сохраняем данные о пользователе
	  	users.push({
	  		id: nextId,
	  		socketId: socket.id,
	  		nickname: nickname,
	  	});
  		//Отправить пользователю его никнейм, открыв доступ к чатам
  		socket.emit('nickname-selected', nickname);
  		//Оповестить всех остальных пользователей о новом подключении
  		socket.broadcast.emit('new-user-joined', {
    		id: nextId,
    		nickname: nickname,
    	});
    	//Увеличить id
  		nextId++;
  	});

  	//Пользователь отправил сообщение
  	socket.on('send-message', (data) => {
		//Переслать сообщение получателю
  		io.to(userById(data.recepientId).socketId).emit('received-message', {
  			text: data.text,
  			key: data.key,
  			senderId: userBySocketId(socket.id).id,
  		});
  	});
	//Пользователь отключился
	socket.on('disconnect', () => {
		console.log('disconnect user, socket: ' + socket.id);
		//Проверить, содержится ли пользователь в массиве users
		var user = userBySocketId(socket.id);
	    if(user != null){
			//Оповестить всех остальных пользователей о дисконнекте
	      	socket.broadcast.emit('user-leave', {
	        	id: user.id,
	        	nickname: user.nickname,
	      	});
		  	//Удалить пользователя из массива
	      	users.splice(users.indexOf(user), 1);
	    }
	});
});
