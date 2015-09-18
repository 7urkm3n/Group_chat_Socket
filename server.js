var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server);

// app.use(express.static('app'));

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
});


var user = []; // User array
var messages = [] // Messages


// Sockets
io.sockets.on('connection', function(socket){
	console.log('Socket # '+socket.id);
	socketId = socket.id;
	socket.emit('socketId', socketId);

	// User Joining listening
	socket.on('user_joining', function(data){
		console.log(data);
		user.push(data);

		io.sockets.emit('user_joined', {name: data.userName})
	}); //end 'user_join' Socket

	// Sending Message
	socket.on('sending_message', function(data){
		
		messages.push(data);
		console.log(messages[messages.length - 1]);
		io.sockets.emit('messages', {messages: messages[messages.length - 1]});
	});

});// end of socket connection


// Server Listens
server.listen(4000, function(){
	console.log('Server runs on Port: 4000');
});
