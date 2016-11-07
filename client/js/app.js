(function () {
	'use strict';

	angular
		.module('camera', [
			'ui.router',
			'ngMaterial'
		])

		.config(function ($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('stage', {
					url:          '/main',
					templateUrl:  'partials/main.html',
					controller:   'MainController',
					controllerAs: 'main'
				});

			$urlRouterProvider.otherwise('/main');
		})

		/**
		 * @ngdoc service
		 * @name camera.factory:socket
		 * @requires $rootScope
		 * @description
		 * Handling the socket events within a factory so controllers can
		 * deal with the socket.io stuff.
		 */
		.factory('socket', function ($rootScope) {
			var socket = io.connect();
			return {
				on: function (eventName, callback) {
					socket.on(eventName, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							callback.apply(socket, args);
						});
					});
				},
				emit: function (eventName, data, callback) {
					socket.emit(eventName, data, function () {
						var args = arguments;
						$rootScope.$apply(function () {
							if (callback) {
								callback.apply(socket, args);
							}
						});
					})
				}
			};

		})

		/**
		 * @ngdoc controller
		 * @name camera.controller:MainController
		 * @requires camera.factory:socket
		 * @description
		 * The main controller for handeling the clients interface
		 */
		.controller('MainController', function (socket) {

				var vm = this;

				/**
				 * @ngdoc method
				 * @name init
				 * @methodOf camera.controller:MainController
				 * @description
				 * Initialization of the controller.
				 */
				vm.init = function(){
					vm.streaming = {
						active: false,
						imageSrc: 'image/out.jpg'
					};
				};

				vm.init();

				/**
				 * @ngdoc method
				 * @name startStream
				 * @methodOf camera.controller:MainController
				 * @description
				 * Emitting the socket event for initializing the streaming
				 */
				vm.startStream = function(){
					vm.streaming.active = true;
					socket.emit('camera:startStream');
				}

				/**
				 * @ngdoc method
				 * @name stopStream
				 * @methodOf camera.controller:MainController
				 * @description
				 * Emitting the socket event for stopping the streaming
				 */
				vm.stopStream = function(){
					vm.streaming.active = false;
					socket.emit('camera:stopStream');
					vm.streaming.imageSrc = 'image/out.jpg';
				}

				/**
				* Receiving camera liveStream image.
				* Setting the image to an base64 image.
				* Setting the active flag
				*/
				socket.on('camera:liveStream', function (data) {
					vm.streaming.imageSrc = data;
					vm.streaming.active = true;
				});
		})
})();
