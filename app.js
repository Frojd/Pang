
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');


server.listen(8888);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

/*
 * Sockets
 */
var theGame = new pang.Game('The game');

io.sockets.on('connection', function (socket) {
  if (theGame.isFull()) {
    socket.emit('connection_status', { connected: false, error: "Server is full" });
    return;
  }

  theGame.join(socket);
  socket.emit('connection_status', { connected: true });
});

