
var pongInit = function() {

    window.keydown = {};

    function keyName(event) {
        return jQuery.hotkeys.specialKeys[event.which] ||
        String.fromCharCode(event.which).toLowerCase();
    }

    $(document).bind("keydown", function(event) {
        keydown[keyName(event)] = true;
        socket.emit("move", {down : 10});
    });

    $(document).bind("keyup", function(event) {
        keydown[keyName(event)] = false;
    });


    var CANVAS_WIDTH = $('#canvas').width();
    var CANVAS_HEIGHT = $('#canvas').height();

    var canvas_element = document.getElementById('canvas');
    var canvas = canvas_element.getContext('2d');


    var FPS = 1000;
    var game_running = setInterval(function() {
        update();
        draw();
    }, 1000/FPS);

    var PLAYER_SPEED = 3;
    var PLAYER_WIDTH = 6;
    var PLAYER_HEIGHT = 100;
    var BALL_SPEED = 4;
    var BALL_RADIUS = 10;
    var BALL_DIRECTIONS = [1, -1];

    var player_1 = {
        score: 0,
        speed: PLAYER_SPEED,
        color: "#ffffff",
        x: 10,
        y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    var player_2 = {
        score: 0,
        speed: PLAYER_SPEED,
        color: "#ffffff",
        x: CANVAS_WIDTH - 10 - PLAYER_WIDTH,
        y: CANVAS_HEIGHT / 2 - PLAYER_HEIGHT / 2,
        width: PLAYER_WIDTH,
        height: 100,
        draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    };


    var ball = {
        speed: BALL_SPEED,
        xd: 0,
        yd: 0,
        color: "#ffffff",
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        width: BALL_RADIUS * 2,
        height: BALL_RADIUS * 2,
        radius: BALL_RADIUS,
        draw: function() {
/*            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);*/
            canvas.beginPath();
            canvas.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            canvas.closePath();
            canvas.fill();
        }
    };

    function draw() {

        canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        /*Draw line*/
        canvas.moveTo(CANVAS_WIDTH/2, 0);
        canvas.lineTo(CANVAS_WIDTH/2, CANVAS_HEIGHT);
        canvas.strokeStyle = '#ffffff';
        canvas.stroke();

        /*Display scores*/
        canvas.fillStyle = "#ffffff"; // Set color to black
        canvas.font = 'normal 10px Arial';

        canvas.fillText(add_zero(player_1.score), CANVAS_WIDTH / 2 - 16, 10);
        canvas.fillText(add_zero(player_2.score), CANVAS_WIDTH / 2 + 5, 10);

        ball.draw();
        player_1.draw();
        player_2.draw();

    }

    socket.on("start", function(data) {
        console.log("started");
        ball.xd = data;
    });

    socket.on('move', function (data) {
      var player = data.side === "left" ? player_1 : player_2;
      player.y = data.offset.y;
    });

    socket.on('score', function (data) {
      var side = data === "left" ? player_1 : player_2;
      side.score += 1;
    });

    socket.on('ballmove', function (data) {
        ball.x = data.x;
        ball.y = data.y;
    });

    function update() {

        if (keydown.space) {
            socket.emit("ready");
            console.log("You are ready.");
        }

        /*PLayer 1*/
        if (keydown.w) {
            socket.emit('move', {direction: 'up' });
        }

        if (keydown.s) {
            socket.emit('move', {direction: 'down' });
        }

        /*PLayer 2*/
        if (keydown.up) {
            socket.emit('move', {direction: 'up' });
        }

        if (keydown.down) {
            socket.emit('move', {direction: 'down' });
        }
    }

    function add_zero(digit) {
        return (digit < 10) ? '0' + digit : digit;
    }


}
