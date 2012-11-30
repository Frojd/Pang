var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , pang = require('pang');

app.listen(4545);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var theGame = new pang.Game('The game');

io.sockets.on('connection', function (socket) {
  if (theGame.isFull()) {
    socket.emit('connection_status', { connected: false, error: "Server is full" });
    return;
  }

  theGame.join(socket);
  socket.emit('connection_status', { connected: true });
});
