
var express = require('express');
var app = express();
var socket = require('socket.io');

var cameraHandler = require('./camera.js');

var cameraConfig = {
	camera: {
		capture: {
			time: 100,
			rate: 800
		},
		streaming: {
			active: false,
			interval: null
		},
		image: {
			width: 360,
			height: 240,
			encoding: 'jpg',
			file: {
				path: './stream',
				name: 'stream_image',
			}
		}
	}
};

var cameraStream = new cameraHandler(cameraConfig);

// open server connection for client side communication
var server = app.use('/', express.static(__dirname + '/client')).listen(8080,
	function () {
		console.log('Camera app listening on http://localhost:8080!');
	}
);

var listener = socket.listen(server);
var sockets = {};

listener.sockets.on('connection', function (socket) {

	// collect connections
	sockets[socket.id] = socket;
	console.log("Total clients connected : ", Object.keys(sockets).length);

	// We delete the disconnected client from the global object
	socket.on('disconnect', function() {
		delete sockets[socket.id];
		// no more sockets, stop all and kill the stream
		if (Object.keys(sockets).length === 0) {
			cameraStream.stop();
		}
	});

	// reacting on the client's request for a stream
	socket.on('camera:startStream', function() {
        cameraStream.start();
	});

	// reacting on the clients request for stopping the stream
	socket.on('camera:stopStream', function() {
		cameraStream.stop();
	});

	// sending out the cameras image
    cameraStream.on('liveStream', function(image){
        socket.emit('camera:liveStream', image);
    });
});

function exitHandler(options, err) {
    if (err) {
		console.error('Exiting on error: ', err);
		 cameraStream.stop();
	 }
    if (options && options.exit) {
		cameraStream.stop();
		process.exit();
	}
}


// so the program will not close instantly
process.stdin.resume();
// do something when app is closing
process.on('exit', exitHandler.bind(null, {exit:true}));
// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// catches uncaught exceptions
//process.on('uncaughtException', exitHandler.bind(null, {exit:true}, error));
