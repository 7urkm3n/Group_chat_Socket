
$(document).ready(function(){
	// Capitalizes first letter...
	function capitalize(s){
    	return s[0].toUpperCase() + s.slice(1);
	}

	var socket = io.connect('https://enigmatic-fortress-1383.herokuapp.com'); // Socket goes Here !
	var userId;
	var userName;
	socket.on('socketId', function(data){
		var name = prompt('Whats yr name?') || "Anonymous"; // Prompt name

		userName = name;
		var socket_Id = data;
		var user_Id = localStorage.getItem('userId') || socket_Id;
		userId = user_Id;
		localStorage.setItem('userId', user_Id);
		// console.log(name+': '+ user_Id);
		// Socket, sending 'user_join'
		socket.emit('user_joining', {userId: user_Id, userName: name}); 
	}); // End of socketId

	// Socket user_joiner 
	socket.on('user_joined', function(data){
		$('#in_chat').append('<p class="connected">'+capitalize(data.name)+': joined the chatroom...</p>').scrollTop($("#in_chat")[0].scrollHeight);
	});

	// Socket sending message
	$('#btn_send').click(function(){
		var input_message = $('#message').val();
			if(input_message === ""){
				alert('Omg Type Smth Man, Dnt be Lazeeeeee.');
			}else{
				socket.emit('sending_message', {userName: userName, msg: input_message});		
				$('#message').val('');
			};
	}); //End of btn_send
	$(document).on('keydown', function(e){
		if(e.keyCode === 13){
			$('#btn_send').click();
		}
	});
	
	// Socket, listenim message
	socket.on('messages', function(data){
		var nm = data.messages.userName;
		var ms = data.messages.msg;
		$('#in_chat').append('<p> <i class="username">'+capitalize(nm)+'</i>: '+ms+'</p>').scrollTop($("#in_chat")[0].scrollHeight);
	});

	$('#disc').click(function(){
		socket.emit('disc', {userName: userName});
	});

	socket.on('user_disc', function(data){
		var disnm = capitalize(data.userName);
			$('#in_chat').append('<p class="disconnected">'+ disnm +': has left the room. </p>').scrollTop($("#in_chat")[0].scrollHeight);
		});

		
}); //end of Jquery Document.ready !!!