// var $ = require('jquery');

// var host = '{{config.host}}';
// var socket = io.connect(host + '/roomlist'); // http://localhost:3000/roomlist

// socket.on('connect', function(){
// 	console.log('Connection Established !');
// })

// socket.on('roomupdate', function(data){
// 	var procData = JSON.parse(data);
// 	$('.roomlist').html('');
// 	for(var i = 0; i < procData.length; i++){
// 		var str = '<a href="room/' + procData[i].room_number + '"><li>' + procData[i].room_name + '</li></a>';
// 		$('.roomlist').prepend(str);
// 	}
// })



// $(document).on('click', '#create', function(){
// 	var room_name = $('.newRoom').val();
// 	if(room_name!=''){
// 		var room_number = parseInt(Math.random() * 10000);
// 		socket.emit('newroom', {room_name:room_name, room_number:room_number});
// 		$('.newRoom').val('');
// 	}
// })