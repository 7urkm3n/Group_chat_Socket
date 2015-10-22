var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);
// var fs = require('fs');

app.use(express.static('views'));
// app.use(express.static(__dirname + '/views'));
// app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
});

var user = []; // User array
var messages = [] // Messages

// Sockets
io.sockets.on('connection', function(socket){
	socketId = socket.id;
	socket.emit('socketId', socketId);

	// User Joining listening
	socket.on('user_joining', function(data){
		user.push(data);
		io.sockets.emit('user_joined', {name: data.userName})
	}); //end 'user_join' Socket

	// Sending Message
	socket.on('sending_message', function(data){
		messages.push(data);
		console.log(user);
		io.sockets.emit('messages', {messages: messages[messages.length - 1]});
	});

	socket.on('disc', function(data){
		io.sockets.emit('user_disc', data);
	});
});// end of socket connection

// Server Listens
// server.listen(4000, function(){
// 	console.log('Server runs on Port: 4000');
// });


server.set('port', (process.env.PORT || 5000));
server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});