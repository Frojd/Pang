var socket = io.connect('http://10.110.162.120');

$(document).ready(function(){

	socket.on('connection_status', function (data) {
	  if (!data.connected) {
	    console.log(data.error);
	  } else {
	    console.log('You are connected!');
	    pongInit();
	  }
	});

});