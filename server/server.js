var express = require('express'),
	app = express(),
	server = require('http').Server(app),
	io = require('socket.io')(server),
    fs = require('fs');

// app.use(express.static('app'));

// app.use(express.static(__dirname + '/static'));
// app.set('views', __dirname + '/views');

app.use(express.static('static'));
app.use(express.static('views'));

// app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
});

// fs.readFile('views/404.html', 'utf8', function (errors, contents){
//     response.writeHead(404, {'Content-Type': 'text/html'});  // send data about response
//     response.write(contents);  //  send response body
//     response.end();
// });

var user = []; // User array
var messages = [] // Messages


// Sockets
io.sockets.on('connection', function(socket){
	// console.log('Socket # '+socket.id);
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
		// console.log(data);
		console.log(user);
		io.sockets.emit('messages', {messages: messages[messages.length - 1]});
	});

	socket.on('disc', function(data){
		// console.log(data);

		io.sockets.emit('user_disc', data);
	});
});// end of socket connection


// Server Listens
server.listen(4000, function(){
	console.log('Server runs on Port: 4000');
});
