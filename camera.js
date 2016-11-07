(function(){
    'use strict';

    var util = require('util');
    var EventEmitter = require('events').EventEmitter;
    var fs = require('fs');
    var spawn = require('child_process').spawn;
    var proc;

    // Constructor function
    function cameraHandler(options) {

        var self = this;

        try {
           self.config = options;
        } catch (error) {
           console.error('No camera configuration given');
           return;
        }

        var streamImage = self.config.camera.image.file.path + '/' + self.config.camera.image.file.name + '.' + self.config.camera.image.encoding;

        // stop method
        self.stop = function(){
            stopStreaming();
        }

        // starting method - check for already running instances
        self.start = function(){
            if (!self.config.camera.streaming.active) {
                startStreaming();
            } else {
                sendImage();
            }
        }

        // private -> starting the stream
        function startStreaming() {
            self.config.camera.streaming.active = true;
        	if (self.config.camera.streaming.interval  === null) {
        	    self.config.camera.streaming.interval = setInterval(takeImage, self.config.camera.capture.rate);
        	}
        }

        // private -> stopping the stream
        function stopStreaming() {
            self.config.camera.streaming.active = false;
            (proc) && proc.kill();
            clearInterval(self.config.camera.streaming.interval);
        	self.config.camera.streaming.interval = null;
        }

        // private -> taking the image
        function takeImage() {
            var _args = [
                '-w', self.config.camera.image.width,
                '-h', self.config.camera.image.height,
                '-t', self.config.camera.capture.time,
        		'-e', self.config.camera.image.encoding,
                '-o', streamImage
            ];
            proc = spawn('raspistill', _args);
            proc.on('exit', sendImage);
        }

        // private -> sending an on event
        function sendImage() {
            fs.readFile(streamImage, function(err, buffer){
        		(err) && console.log('ERROR: ', err);
                try {
                    self.emit('liveStream', 'data:image/jpg;base64,' + buffer.toString('base64'));
                } catch (error) {
                    console.error('Error while trying to send image: ', error);
                }
            });
        }
    }

    util.inherits(cameraHandler, EventEmitter);
	module.exports = cameraHandler;
})();
