// if(document.webkitVisibilityState !== 'prerender') {
  var socket = io.connect('http://10.110.162.112');

  $(document).ready(function(){

    socket.on('connection_status', function (data) {
      if (!data.connected) {
        console.log(data.error);
        var canvas_element = document.getElementById('canvas');
        var canvas = canvas_element.getContext('2d');
        canvas.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());
        canvas.font = 'bold 24px Arial';
        canvas.fillStyle = "#ffffff"; // Set color to black
        canvas.fillText(data.error, 800 / 2 - 164, 600 / 2);
      } else {
        console.log('You are connected!');
        pongInit(data);
      }
    });

  });
// }


