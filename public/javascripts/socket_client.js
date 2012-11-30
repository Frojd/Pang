var socket = io.connect('http://localhost');
socket.on('connection_status', function (data) {
  if (!data.connected) {
    console.log(data.error);
  } else {
    console.log('You are connected!');
  }
});
