# raspi-camera-nodejs

A simple example of how to add camera support to your Raspberry Pi  using Node.js and AngularJS.

At first you need to enable camera support for your Pi.

## Configuration

    sudo raspi-config

    6 Enable Camera -> Ok -> reboot


## NPM packages
To install the nodejs dependencies for the server part. In the root directory of the Application run

    npm install

## Bower packages
Go into the client/ folder and run

    bower install

## To Use
Require the camera.js in your node application, define some configuration and then use the constructor to create a new camera object.

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
    
    // to start the stream
    cameraStream.start();
    
    // reacting to the taken pictures
    cameraStream.on('liveStream', function(){
      // do stuff here
    });
    
    // and stop the stream
    cameraStream.stop();
    
## Node.JS, Socket.io, AngularJS
To give you a quick jump right into node.js and socket.io connection with an AngularJS App, the demo application should speak for it's own. It is straight forward and easy to understand. - Sourcecode tells more than a thousand words. - 
 
    ----------------------------------------------------------------------------
    "THE BEER-WARE LICENSE" (Revision 42):
    Daniel Kugler wrote this file. As long as you retain this notice you
    can do whatever you want with this stuff. If we meet some day, and you think
    this stuff is worth it, you can buy me a beer in return Poul-Henning Kamp
    ----------------------------------------------------------------------------
