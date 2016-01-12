module.exports = function(io, rooms) {
	var chatrooms = io.of('/roomlist').on('connection', function(socket) {
		console.log('connection establised on the server');
		// when connection established receive array
		socket.emit('roomupdate', JSON.stringify(rooms));

		socket.on('newroom', function(roomData) {
			rooms.push(roomData);
			// emit new event and convert array to string
			// broadcast event sent to all users and current user
			socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
			socket.emit('roomupdate', JSON.stringify(rooms));
		});
	});

	// looking for connection event and if does run callback
	var messages = io.of('/messages').on('connection', function(socket) {
		console.log('Connected to the chatroom');

		socket.on('joinroom', function(data) {
			socket.username = data.user;
			socket.userPic = data.userPic;
			//socket.join allows active user to join this particular partition (this certain room)
			socket.join(data.room);
			// updates user list whenever someone joins the room
			updateUserList(data.room, true);
		});

		socket.on('newMessage', function(data) {
			// broadcast to all users except active users because active user typed
			// it and created event/already has in feed
			//.to makes sure these messages only go to users in this specific chatroom
			socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
		});

		function updateUserList(room, updateAll) {
			var getUsers = io.of('/messages').clients(room);
			var userList = [];
			for (var i in getUsers) {
				userList.push({user: getUsers[i].username});
			}
			socket.to(room).emit('updateUserList', JSON.stringify(userList));

			if (updateAll) {
				socket.broadcast.to(room).emit('updateUserList', JSON.stringify(userList));
			}
		}

		socket.on('updateList', function(data) {
			updateUserList(data.room);
		});
	});
}