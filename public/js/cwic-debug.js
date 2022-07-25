var cwic =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	// Loading all controller modules
	var MultimediaControllerModule  = __webpack_require__(1);
	var TelephonyControllerModule   = __webpack_require__(15);
	var LoginControllerModule       = __webpack_require__(25);
	var SystemControllerModule      = __webpack_require__(27);
	var WindowControllerModule      = __webpack_require__(35);
	var CertificateControllerModule = __webpack_require__(45);
	
	// Exposing Controllers as public API
	module.exports.MultimediaController  = MultimediaControllerModule.MultimediaController;
	module.exports.TelephonyController   = TelephonyControllerModule.TelephonyController;
	module.exports.LoginController       = LoginControllerModule.LoginController;
	module.exports.SystemController      = SystemControllerModule.SystemController;
	module.exports.WindowController      = WindowControllerModule.WindowController;
	module.exports.CertificateController = CertificateControllerModule.CertificateController;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule   = __webpack_require__(7);
	
	// Multimedia Modules
	var SpeakerModule    = __webpack_require__(8);
	var MicrophoneModule = __webpack_require__(10);
	var CameraModule     = __webpack_require__(11);
	var RingerModule     = __webpack_require__(12);
	var RingtoneModule   = __webpack_require__(13);
	var MonitorModule    = __webpack_require__(14);
	
	
	var cwic = {
	    Speaker    : SpeakerModule.Speaker,
	    Microphone : MicrophoneModule.Microphone,
	    Camera     : CameraModule.Camera,
	    Ringer     : RingerModule.Ringer,
	    Ringtone   : RingtoneModule.Ringtone,
	    Monitor    : MonitorModule.Monitor,
	
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender   : MessageSenderModule.MessageSender
	};
	
	/**
	 * @class MultimediaController
	 *
	 * @classdesc
	 * Multimedia controller is responsible for managing [Media Devices]{@link MediaDevice}, [Ringtones]{@link Ringtone}
	 * and [Monitors]{@link Monitor} that are used for screen share. <br>
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 *
	 */
	function MultimediaController()
	{
	    this.speakerList    = [];
	    this.microphoneList = [];
	    this.ringerList     = [];
	    this.cameraList     = [];
	    this.ringtoneList   = [];
	    var m_EventHandlers  = {};
	
	    cwic.MessageReceiver.addMessageHandler('multimediacapabilitiesstarted', onCapabilitiesStarted.bind(this));
	    cwic.MessageReceiver.addMessageHandler('multimediacapabilitiesstopped', onCapabilitiesStopped.bind(this));
	
	    function onCapabilitiesStarted()
	    {
	        cwic.MessageReceiver.addMessageHandler('multimediadevicechange', mediaDeviceListChanged.bind(this));
	        cwic.MessageReceiver.addMessageHandler('ringtonechanged', onRingtoneChanged.bind(this));
	        this.refreshMediaDeviceList();
	        this.refreshRingtoneList();
	    }
	
	    function onCapabilitiesStopped()
	    {
	        cwic.MessageReceiver.removeMessageHandler('multimediadevicechange');
	
	        this.speakerList.length = 0;
	        this.cameraList.length = 0;
	        this.microphoneList.length = 0;
	        this.ringerList.length = 0;
	
	        var eventHandler = m_EventHandlers['onMediaDeviceListChanged'];
	
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function mediaDeviceListChanged()
	    {
	        this.refreshMediaDeviceList();
	    }
	
	    function onMediaDeviceListChanged(content)
	    {
	        var deviceList = content.multimediadevices;
	
	        this.speakerList.length = 0;
	        this.cameraList.length = 0;
	        this.microphoneList.length = 0;
	        this.ringerList.length = 0;
	
	        for (var index = 0; index < deviceList.length; ++index)
	        {
	            var device = deviceList[index];
	
	            if (device.canPlayout === true)
	            {
	                var speaker = new cwic.Speaker(device);
	                this.speakerList.push(speaker);
	            }
	
	            if(device.canRecord === true)
	            {
	                var microphone = new cwic.Microphone(device);
	                this.microphoneList.push(microphone);
	            }
	
	            if(device.canCapture === true)
	            {
	                var camera = new cwic.Camera(device);
	                this.cameraList.push(camera);
	            }
	
	            if(device.canRing === true)
	            {
	                var ringer = new cwic.Ringer(device);
	                this.ringerList.push(ringer);
	            }
	        }
	
	        var eventHandler = m_EventHandlers['onMediaDeviceListChanged'];
	
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onRingtoneListChanged(content)
	    {
	        var ringtoneNames = content.ringtones;
	        this.ringtoneList = [];
	
	        for(var index=0; index<ringtoneNames.length; index++)
	        {
	            var ringtone = new cwic.Ringtone(ringtoneNames[index].name);
	            this.ringtoneList.push(ringtone);
	        }
	
	        var eventHandler = m_EventHandlers['onRingtoneListChanged'];
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onRingtoneChanged(content)
	    {
	        var ringtone = new cwic.Ringtone(content.ringtone);
	        var eventHandler = m_EventHandlers['onRingtoneChanged'];
	        if(eventHandler)
	        {
	            eventHandler(ringtone);
	        }
	    }
	
	    function onMonitorListChanged(content)
	    {
	        var monitorList = content.monitors;
	        var monitors = [];
	
	        for(var index=0; index < monitorList.length; ++index)
	        {
	            var monitor = new cwic.Monitor(monitorList[index]);
	            monitors.push(monitor);
	        }
	
	        var eventHandler = m_EventHandlers['onMonitorListChanged'];
	
	        if(eventHandler)
	        {
	            eventHandler(monitors);
	        }
	    }
	
	    /**
	     * @memberof MultimediaController
	     * @method refreshMediaDeviceList
	     * @description
	     * Refresh the list of available media devices:
	     *  - Speakers
	     *  - Microphones
	     *  - Ringers
	     *  - Cameras
	     *
	     * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.refreshMediaDeviceList = function(errorHandler)
	    {
	        var messageName    = "getMultimediaDevices";
	        var messageData    = {};
	        var successHandler = onMediaDeviceListChanged.bind(this);
	
	        cwic.MessageSender.sendMessage(messageName, messageData, errorHandler, successHandler);
	    };
	
	    /**
	     * @memberof MultimediaController
	     * @method refreshRingtoneList
	     * @description
	     * Refresh the list of available ringtones.
	     *
	     * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.refreshRingtoneList = function(errorHandler)
	    {
	        var messageType = "getAvailableRingtones";
	        var messageData = {};
	        var successHandler = onRingtoneListChanged.bind(this);
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler, successHandler);
	    };
	
	    /**
	     * @memberof MultimediaController
	     * @method refreshMonitorList
	     * @description
	     * Refresh the list of connected monitors.
	     *
	     * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.refreshMonitorList = function(errorHandler)
	    {
	        var messageType    = "getMonitorList";
	        var messageData    = {};
	        var successHandler = onMonitorListChanged.bind(this);
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler, successHandler);
	    };
	
	    /**
	     * @memberof MultimediaController
	     * @method addEventHandler
	     * @description
	     * Add handler function for multimedia controller's events.
	     *
	     * @param eventName {String} - Name of the event.
	     * @param eventHandler {Function} - Function that will be called when event is fired.
	     *
	     * @since 11.7.0
	     */
	    this.addEventHandler = function(eventName, eventHandler)
	    {
	        m_EventHandlers[eventName] = eventHandler;
	    };
	
	    /**
	     * @memberof MultimediaController
	     * @method removeEventHandler
	     * @description
	     * Remove handler function for multimedia controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     *
	     * @since 11.7.0
	     */
	    this.removeEventHandler = function(eventName)
	    {
	        delete m_EventHandlers[eventName];
	    };
	}
	
	/**
	 * @memberof MultimediaController
	 * @member speakerList
	 * @description
	 * List of available speakers.
	 *
	 * @type {Speaker[]}
	 * @since 11.7.0
	 */
	MultimediaController.prototype.speakerList = [];
	
	/**
	 * @memberof MultimediaController
	 * @member ringerList
	 * @description
	 * List of available ringers.
	 *
	 * @type {Ringer[]}
	 * @since 11.7.0
	 */
	MultimediaController.prototype.ringerList = [];
	
	/**
	 * @memberof MultimediaController
	 * @member microphoneList
	 * @description
	 * List of available microphones.
	 *
	 * @type {Microphone[]}
	 * @since 11.7.0
	 */
	MultimediaController.prototype.microphoneList = [];
	
	/**
	 * @memberof MultimediaController
	 * @member cameraList
	 * @description
	 * List of available cameras.
	 *
	 * @type {Camera[]}
	 * @since 11.7.0
	 */
	MultimediaController.prototype.cameraList = [];
	
	/**
	 * @memberof MultimediaController
	 * @member ringtoneList
	 * @description
	 * List of available ringtones.
	 *
	 * @type {Array}
	 * @since 11.7.0
	 */
	MultimediaController.prototype.ringtoneList = [];
	
	/**
	 * @memberof MultimediaController
	 * @method selectSpeaker
	 * @description
	 * Select new active speaker.
	 *
	 * @param speaker {Speaker} - Speaker that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if speaker is not instance of {@link Speaker}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectSpeaker = function(speaker, errorHandler)
	{
	    if(!(speaker instanceof cwic.Speaker))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = 'setPlayoutDevice';
	    var messageData = {
	        'clientPlayoutID' : speaker.deviceID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method selectMicrophone
	 * @description
	 * Select new active microphone.
	 *
	 * @param microphone {Microphone} - Microphone that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if microphone is not instance of {@link Microphone}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectMicrophone = function(microphone, errorHandler)
	{
	    if(!(microphone instanceof cwic.Microphone))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "setRecordingDevice";
	    var messageData = {
	        'clientRecordingID' : microphone.deviceID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method selectCamera
	 * @description
	 * Select new active camera.
	 *
	 * @param camera {Camera} - Camera that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if camera is not instance of {@link Camera}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectCamera = function(camera, errorHandler)
	{
	    if(!(camera instanceof cwic.Camera))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "setCaptureDevice";
	    var messageData = {
	        'clientCaptureID' : camera.deviceID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method selectRinger
	 * @description
	 * Select new active camera.
	 *
	 * @param ringer {Ringer} - Ringer that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if ringer is not instance of {@link Ringer}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectRinger = function(ringer, errorHandler)
	{
	    if(!(ringer instanceof cwic.Ringer))
	    {
	        throw Error("Invalid Object")
	    }
	
	    var messageType = "setRingerDevice";
	    var messageData = {
	        'clientRingerID' : ringer.deviceID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method playRingtoneOnAllRingers
	 * @description
	 * On incoming call, ringtone will be played on all ringer devices. Calling this method will ignore any ringer device
	 * previously set as active. Once a new ringer device is set as active ringtone will then only play on active ringer
	 * device.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 */
	MultimediaController.prototype.playRingtoneOnAllRingers = function(errorHandler)
	{
	    var messageType = "setPlayRingerOnAllDevices";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method selectRingtone
	 * @description
	 * Select new active ringtone for incoming calls.
	 *
	 * @param ringtone {Ringtone} - Ringtone that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if ringtone is not instance of {@link Ringtone}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectRingtone = function (ringtone, errorHandler)
	{
	    if (!(ringtone instanceof cwic.Ringtone))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "setCurrentRingtone";
	    var messageData = {
	        'ringtone' : ringtone.name
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method selectMonitor
	 * @description
	 * Select new active monitor that will be used for screen sharing.
	 *
	 * @param monitor {Monitor} - Monitor that will be set as active.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if monitor is not instance of {@link Monitor}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.selectMonitor = function(monitor, errorHandler)
	{
	    if(!(monitor instanceof cwic.Monitor))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "selectMonitor";
	    var messageData = {
	        monitorID : monitor.id
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method highlightMonitor
	 * @description
	 * Highlights monitor by displaying border around its edges.
	 *
	 * @param monitor {Monitor} - Monitor that will be highlighted.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if monitor is not instance of {@link Monitor}.
	 *
	 * @since 11.7.0
	 */
	MultimediaController.prototype.highlightMonitor = function (monitor, errorHandler)
	{
	    if(!(monitor instanceof cwic.Monitor))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "showMonitorBorderIndicator";
	    var messageData = {
	        monitorID : monitor.id
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method unHighlightMonitor
	 * @description
	 * UnHighlights current highlighted monitor by hiding border around its edges.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	MultimediaController.prototype.unHighlightMonitor = function(errorHandler)
	{
	    var messageType = "hideMonitorBorderIndicator";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof MultimediaController
	 * @method setMonitorHighlightColor
	 * @description
	 * Set new monitor highlight color.
	 *
	 * @param red - Red color value.
	 * @param green - Green color value.
	 * @param blue - blue color value.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	MultimediaController.prototype.setMonitorHighlightColor = function(red, green, blue, errorHandler)
	{
	    var messageType = "setMonitorBorderIndicatorColor";
	    var messageData = {
	        redValue : red,
	        greenValue : green,
	        blueValue : blue
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	
	
	module.exports.MultimediaController = new MultimediaController();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageResponseHandlerModule = __webpack_require__(3);
	var LoggerModule                 = __webpack_require__(4);
	var SystemErrorsModule           = __webpack_require__(6);
	
	var cwic = {
	    MessageResponseHandler : MessageResponseHandlerModule.MessageResponseHandler,
	    Logger                 : LoggerModule.Logger,
	    SystemErrors           : SystemErrorsModule.SystemErrors
	};
	
	
	function MessageReceiver()
	{
	    var m_MessageHandlers = {};
	
	    this.addMessageHandler = function(messageType, handlerFunction)
	    {
	        m_MessageHandlers[messageType] = handlerFunction;
	    };
	
	    this.removeMessageHandler = function(messageType)
	    {
	        delete m_MessageHandlers[messageType];
	    };
	
	    this.onMessageReceived = function(message)
	    {
	        if (message.ciscoSDKServerMessage)
	        {
	            this.onServerMessageReceived(message.ciscoSDKServerMessage);
	        }
	        else if(message.ciscoChannelServerMessage)
	        {
	            this.onChannelMessage(message.ciscoChannelServerMessage);
	        }
	        else
	        {
	            cwic.Logger.error('Unknown message from plugin: ', message);
	        }
	    };
	
	    this.onServerMessageReceived = function(serverMessage)
	    {
	        var content   = serverMessage.content;
	        var error     = serverMessage.error;
	        var messageId = serverMessage.replyToMessageId;
	        var name      = serverMessage.name;
	
	        cwic.Logger.debug('Received Message: ' + name, serverMessage);
	
	        if(error)
	        {
	            cwic.Logger.debug('Error response for Message: ' + name, serverMessage);
	
	            if(cwic.MessageResponseHandler.errorHandlerExists(messageId))
	            {
	                var errorHandler = cwic.MessageResponseHandler.getErrorHandler(messageId);
	                errorHandler(cwic.SystemErrors[error]);
	                cwic.MessageResponseHandler.removeErrorHandler(messageId);
	            }
	
	            return;
	        }
	
	        if(cwic.MessageResponseHandler.successHandlerExist(messageId))
	        {
	            cwic.Logger.debug('Success response for Message: ' + name, serverMessage);
	
	            var successHandler = cwic.MessageResponseHandler.getSuccessHandler(messageId);
	            successHandler(content);
	        }
	
	        if(m_MessageHandlers[name])
	        {
	            var messageHandler = m_MessageHandlers[name];
	            messageHandler(content);
	        }
	    };
	
	    this.onChannelMessage = function(channelMessage)
	    {
	        if (channelMessage.name === 'ChannelDisconnect' || channelMessage.name === 'HostDisconnect')
	        {
	            cwic.Logger.error("Connection with add-on has been lost", "");
	            var messageHandler = m_MessageHandlers['addonConnectionLost'];
	            if(messageHandler)
	            {
	                messageHandler();
	            }
	        }
	        else
	        {
	            cwic.Logger.debug("Unknown channel message: " + channelMessage.name);
	        }
	    };
	}
	
	module.exports.MessageReceiver = new MessageReceiver();

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	function MessageResponseHandler()
	{
	    var m_ErrorMessageHandlers   = {};
	    var m_SuccessMessageHandlers = {};
	
	    this.addErrorHandler = function(messageID, handler)
	    {
	        m_ErrorMessageHandlers[messageID] = handler;
	    };
	
	    this.addSuccessHandler = function(messageID, handler)
	    {
	        m_SuccessMessageHandlers[messageID] = handler;
	    };
	
	    this.removeErrorHandler = function(messageID)
	    {
	        delete m_ErrorMessageHandlers[messageID];
	    };
	
	    this.removeSuccessHandler = function(messageID)
	    {
	        delete m_SuccessMessageHandlers[messageID];
	    };
	
	    this.errorHandlerExists = function(messageID)
	    {
	        return m_ErrorMessageHandlers[messageID] ? true : false;
	    };
	
	    this.successHandlerExist = function(messageID)
	    {
	        return m_SuccessMessageHandlers[messageID] ? true : false;
	    };
	
	    this.getErrorHandler = function(messageID)
	    {
	        return m_ErrorMessageHandlers[messageID];
	    };
	
	    this.getSuccessHandler = function (messageID)
	    {
	        return m_SuccessMessageHandlers[messageID];
	    }
	}
	
	
	module.exports.MessageResponseHandler = new MessageResponseHandler();


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var UtilitiesModule = __webpack_require__(5);
	
	var cwic = {
	    Utilities : UtilitiesModule.Utilities
	};
	
	var LogLevels =
	{
	    debug   : 0,
	    info    : 1,
	    warning : 2,
	    error   : 3
	};
	
	function Logger()
	{
	}
	
	Logger.prototype.logLevel = 0;
	
	Logger.prototype.debug = function(message, context)
	{
	    context = context ? context : "";
	    if(this.logLevel <= LogLevels.debug)
	    {
	        var currentTime = new Date();
	        var timeStamp   =
	            ('0' + currentTime.getHours()).slice(-2) + ':' +
	            ('0' + currentTime.getMinutes()).slice(-2) + ':' +
	            ('0' + currentTime.getSeconds()).slice(-2) + '.' +
	            ('00' + currentTime.getMilliseconds()).slice(-3);
	
	        if(cwic.Utilities.getBrowserType() === "InternetExplorer")
	        {
	            console.log('[cwic][DEBUG][' + timeStamp + '] ' +  message, context);
	        }
	        else
	        {
	            console.log('%c[cwic][DEBUG][' + timeStamp + '] ' +  message, 'color: green', context);
	        }
	    }
	};
	
	Logger.prototype.info = function(message, context)
	{
	    context = context ? context : "";
	    if(this.logLevel <= LogLevels.info)
	    {
	        var currentTime = new Date();
	        var timeStamp   =
	            ('0' + currentTime.getHours()).slice(-2) + ':' +
	            ('0' + currentTime.getMinutes()).slice(-2) + ':' +
	            ('0' + currentTime.getSeconds()).slice(-2) + '.' +
	            ('00' + currentTime.getMilliseconds()).slice(-3);
	
	        if(cwic.Utilities.getBrowserType() === "InternetExplorer")
	        {
	            console.log('[cwic][INFO ][' + timeStamp + '] ' + message, context);
	        }
	        else
	        {
	            console.log('%c[cwic][INFO ][' + timeStamp + '] ' + message, 'color: black', context);
	        }
	    }
	};
	
	
	Logger.prototype.warning = function(message, context)
	{
	    context = context ? context : "";
	    if(this.logLevel <= LogLevels.warning)
	    {
	        var currentTime = new Date();
	        var timeStamp   =
	            ('0' + currentTime.getHours()).slice(-2) + ':' +
	            ('0' + currentTime.getMinutes()).slice(-2) + ':' +
	            ('0' + currentTime.getSeconds()).slice(-2) + '.' +
	            ('00' + currentTime.getMilliseconds()).slice(-3);
	
	        if(cwic.Utilities.getBrowserType() === "InternetExplorer")
	        {
	            console.log('[cwic][WARNI][' + timeStamp + '] ' +  message, context);
	        }
	        else
	        {
	            console.log('%c[cwic][WARNI][' + timeStamp + '] ' + message, 'color: #FF8000', context);
	        }
	    }
	};
	
	
	Logger.prototype.error = function(message, context)
	{
	    context = context ? context : "";
	    if(this.logLevel <= LogLevels.error)
	    {
	        var currentTime = new Date();
	        var timeStamp   =
	            ('0' + currentTime.getHours()).slice(-2) + ':' +
	            ('0' + currentTime.getMinutes()).slice(-2) + ':' +
	            ('0' + currentTime.getSeconds()).slice(-2) + '.' +
	            ('00' + currentTime.getMilliseconds()).slice(-3);
	
	        if(cwic.Utilities.getBrowserType() === "InternetExplorer")
	        {
	            console.log('[cwic][ERROR][' + timeStamp + '] ' +  message, context);
	        }
	        else
	        {
	            console.log('%c[cwic][ERROR][' + timeStamp + '] ' + message, 'color: red', context);
	        }
	    }
	};
	
	module.exports.Logger = new Logger();


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	function Utilities()
	{
	}
	
	Utilities.prototype.getBrowserType = function()
	{
	    var type = 'Unknown';
	
	    if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 )
	    {
	        type = 'Opera';
	    }
	    else if(navigator.userAgent.indexOf("Chrome") != -1 )
	    {
	        type = 'Chrome';
	    }
	    else if(navigator.userAgent.indexOf("Safari") != -1)
	    {
	        type = 'Safari';
	    }
	    else if(navigator.userAgent.indexOf("Firefox") != -1 )
	    {
	        type = 'Firefox';
	    }
	    else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) //IF IE > 10
	    {
	        type = 'InternetExplorer';
	    }
	
	    return type;
	};
	
	Utilities.prototype.getBrowserVersion = function()
	{
	    var N= navigator.appName, ua= navigator.userAgent, tem;
	    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
	    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
	    return M[1];
	};
	
	Utilities.prototype.getOSType = function()
	{
	    var OSName = "Unknown";
	    if (window.navigator.userAgent.indexOf("Windows NT 10.0")!= -1) OSName="Windows 10";
	    if (window.navigator.userAgent.indexOf("Windows NT 6.2") != -1) OSName="Windows 8";
	    if (window.navigator.userAgent.indexOf("Windows NT 6.1") != -1) OSName="Windows 7";
	    if (window.navigator.userAgent.indexOf("Windows NT 6.0") != -1) OSName="Windows Vista";
	    if (window.navigator.userAgent.indexOf("Windows NT 5.1") != -1) OSName="Windows XP";
	    if (window.navigator.userAgent.indexOf("Windows NT 5.0") != -1) OSName="Windows 2000";
	    if (window.navigator.userAgent.indexOf("Mac")!=-1) OSName="Mac";
	
	    return OSName;
	};
	
	Utilities.prototype.generateUniqueId = function()
	{
	    return (new Date()).valueOf().toString() + Math.floor((Math.random() * 10000) + 1).toString();
	};
	
	module.exports.Utilities = new Utilities();


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	/**
	 * @enum SystemError {Enum}
	 * @description
	 * These errors are passed in API error handler functions.
	 *
	 * @since 11.7.0
	 */
	var SystemError = {
	    /**
	     * Error occurred in add-on.
	     * @type {String}
	     */
	    NativeError : "Error",
	
	    /**
	     * System not started or fully operational.
	     * @type {String}
	     */
	    OperationFailed : "OperationFailed",
	
	    /**
	     * User has not authorized add-on through Access Control Dialogue.
	     * @type {String}
	     */
	    UserNotAuthorized : "UserNotAuthorized",
	
	    /**
	     * Invalid arguments passed.
	     * @type {String}
	     */
	    InvalidArguments : "InvalidArguments",
	
	    /**
	     * System has no capabilities to execute API call.
	     * @type {String}
	     */
	    CapabilityMissing : "CapabilityMissing",
	
	    /**
	     * More then one instance of Add-on is running.
	     * @type {String}
	     */
	    MoreThenOneInstanceRunning : "MoreThenOneInstanceRunning",
	
	    /**
	     * Invalid monitor has been used. (Monitor is no longer connected to local machine).
	     * @type {String}
	     */
	    InvalidMonitor : "InvalidMonitor",
	
	    /**
	     * Failed to execute operation on conversation that no longer exists.
	     * @type {String}
	     */
	    InvalidConversation : "InvalidConversation"
	};
	
	var SystemErrorAliasMap = {
	    eSyntaxError       : "NativeError",
	    eOperationFailed   : "OperationFailed",
	    eNotUserAuthorized : "UserNotAuthorized",
	    eInvalidArgument   : "InvalidArguments",
	    eCapabilityMissing : "CapabilityMissing",
	    eLoggedInLock      : "MoreThenOneInstanceRunning",
	    eInvalidMonitor    : "InvalidMonitor",
	    eInvalidMonitorID  : "InvalidMonitor",
	    eInvalidCallID     : "InvalidConversation"
	};
	
	module.exports.SystemErrors = SystemErrorAliasMap;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageResponseHandlerModule = __webpack_require__(3);
	var LogModule                    = __webpack_require__(4);
	var UtilitiesModule              = __webpack_require__(5);
	
	var cwic = {
	    MessageResponseHandler : MessageResponseHandlerModule.MessageResponseHandler,
	    Logger                 : LogModule.Logger,
	    Utilities              : UtilitiesModule.Utilities
	};
	
	function SystemException(message)
	{
	    this.message = message;
	}
	
	SystemException.prototype = Object.create(Error.prototype);
	SystemException.prototype.name = "cwic.SystemException";
	SystemException.prototype.constructor = SystemException;
	
	
	function MessageSender()
	{
	    var m_EventHandlers = [];
	}
	
	MessageSender.prototype.sendMessage = function(messageType, messageData, errorHandler, successHandler)
	{
	    if(this.plugin == null)
	    {
	        throw new SystemException();
	    }
	
	    var messageID = cwic.Utilities.generateUniqueId();
	
	    if(typeof errorHandler === 'function')
	    {
	        cwic.MessageResponseHandler.addErrorHandler(messageID, errorHandler);
	    }
	
	    if(typeof successHandler === 'function')
	    {
	        cwic.MessageResponseHandler.addSuccessHandler(messageID, successHandler);
	    }
	
	    var message = {
	        ciscoSDKClientMessage: {
	            'messageId': messageID,
	            'name': messageType,
	            'content': messageData || {}
	        }
	    };
	
	    this.plugin.sendMessage(message);
	};
	
	MessageSender.prototype.addEventHandler = function(eventName, eventHandler)
	{
	    this.eventHandlers[eventName] = eventHandler;
	};
	
	MessageSender.prototype.plugin = null;
	MessageSender.prototype.eventHandlers = [];
	
	module.exports.MessageSender = new MessageSender();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	// Multimedia Modules
	var DeviceModule = __webpack_require__(9);
	
	var cwic = {
	    MessageSender : MessageSenderModule.MessageSender,
	    MediaDevice : DeviceModule.MediaDevice
	};
	
	/**
	 * @class Speaker
	 * @classdesc Speaker device plugged into PC.
	 * @extends {MediaDevice}
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Speaker(genericDevice)
	{
	    var deviceInfo = {
	        deviceID : genericDevice.clientPlayoutID,
	        hardwareID : genericDevice.hardwareID,
	        isSelected : genericDevice.isSelectedPlayoutDevice,
	        name : genericDevice.playoutName,
	        vendorID : genericDevice.vendorID
	    };
	
	    cwic.MediaDevice.call(this, deviceInfo);
	
	    this.volume = genericDevice.volume;
	}
	
	Speaker.prototype = Object.create(cwic.MediaDevice.prototype);
	Speaker.prototype.constructor = Speaker;
	
	/**
	 * @memberof Speaker
	 * @member volume
	 * @description
	 * Speaker's output volume level.
	 *
	 * @type {number}
	 * @since 11.7.0
	 */
	Speaker.prototype.volume = 0;
	
	/**
	 * @memberof Speaker
	 * @method setVolume
	 * @description
	 * Sets a new output volume level of the ringer.
	 *
	 * @param volume {Number} - New volume level that will be set. Allowed values are 0 - 100.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 *
	 * @throw Invalid Volume Value - Thrown if volume level value is less then 0 or more then 100.
	 */
	Speaker.prototype.setVolume = function(volume, errorHandler)
	{
	    if(volume < 0 || volume > 100)
	    {
	        throw Error("Invalid Volume Value");
	    }
	
	    this.volume = volume;
	
	    var messageType = "setCurrentSpeakerVolume";
	    var messageContent = {
	        volume : volume
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	module.exports.Speaker = Speaker;
	
	


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/**
	 * @class MediaDevice
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function MediaDevice(deviceInfo)
	{
	    this.deviceID   = deviceInfo.deviceID;
	    this.hardwareID = deviceInfo.hardwareID;
	    this.isSelected = deviceInfo.isSelected;
	    this.name       = deviceInfo.name;
	    this.vendorID   = deviceInfo.vendorID;
	}
	
	/**
	 * @memberof MediaDevice
	 * @memeber deviceID
	 * @description
	 * Unique device ID given by operating system.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	MediaDevice.prototype.deviceID = null;
	
	/**
	 * @memberof MediaDevice
	 * @memeber hardwareID
	 * @description
	 * Unique hardwareID of device.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	MediaDevice.prototype.hardwareID = null;
	
	/**
	 * @memberof MediaDevice
	 * @memeber isSelected
	 * @description
	 * Indicates whether this device is selected or not.
	 *
	 * @type {Boolean}
	 * @since 11.7.0
	 */
	MediaDevice.prototype.isSelected = null;
	
	/**
	 * @memberof MediaDevice
	 * @memeber name
	 * @description
	 * Name of the device.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	MediaDevice.prototype.name = null;
	
	/**
	 * @memberof MediaDevice
	 * @memeber vendorID
	 * @description
	 * Unique ID for device given by vendor.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	MediaDevice.prototype.vendorID = null;
	
	module.exports.MediaDevice = MediaDevice;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	// Multimedia Modules
	var DeviceModule = __webpack_require__(9);
	
	var cwic = {
	    MessageSender : MessageSenderModule.MessageSender,
	    MediaDevice : DeviceModule.MediaDevice
	};
	
	/**
	 * @class Microphone
	 * @classdesc Microphone device plugged into PC.
	 * @extends {MediaDevice}
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Microphone(genericDevice)
	{
	    var deviceInfo = {
	        deviceID : genericDevice.recordingID,
	        hardwareID : genericDevice.hardwareID,
	        isSelected : genericDevice.isSelectedRecordingDevice,
	        name : genericDevice.recordingName,
	        vendorID : genericDevice.vendorID
	    };
	
	    cwic.MediaDevice.call(this, deviceInfo);
	
	    this.volume = genericDevice.volume;
	}
	
	Microphone.prototype = Object.create(cwic.MediaDevice.prototype);
	Microphone.prototype.constructor = Microphone;
	
	/**
	 * @memberof Microphone
	 * @member volume
	 * @description
	 * Microphone's input volume level.
	 *
	 * @type {number}
	 * @since 11.7.0
	 */
	Microphone.prototype.volume = 0;
	
	/**
	 * @memberof Microphone
	 * @method setVolume
	 * @description
	 * Sets a new input volume level of the microphone.
	 *
	 * @param volume {Number} - New volume level that will be set. Allowed values are 0 - 100.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Volume Value - Thrown if volume level value is less then 0 or more then 100.
	 *
	 * @since 11.7.0
	 */
	Microphone.prototype.setVolume = function(volume, errorHandler)
	{
	    if(volume < 0 || volume > 100)
	    {
	        throw Error("Invalid Volume Value");
	    }
	
	    this.volume = volume;
	
	    var messageType = "setCurrentMicrophoneVolume";
	    var messageContent = {
	        volume : volume
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	
	module.exports.Microphone = Microphone;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var DeviceModule = __webpack_require__(9);
	
	var cwic = {
	    MediaDevice : DeviceModule.MediaDevice
	};
	
	/**
	 * @class Camera
	 * @classdesc Camera device plugged into PC.
	 * @extends {MediaDevice}
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Camera(genericDevice)
	{
	    var deviceInfo = {
	        deviceID : genericDevice.captureID,
	        hardwareID : genericDevice.hardwareID,
	        isSelected : genericDevice.isSelectedCaptureDevice,
	        name : genericDevice.captureName,
	        vendorID : genericDevice.vendorID
	    };
	
	    cwic.MediaDevice.call(this, deviceInfo);
	}
	
	Camera.prototype = Object.create(cwic.MediaDevice.prototype);
	Camera.prototype.constructor = Camera;
	
	module.exports.Camera = Camera;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	// Multimedia Modules
	var DeviceModule = __webpack_require__(9);
	
	var cwic = {
	    MessageSender : MessageSenderModule.MessageSender,
	    MediaDevice : DeviceModule.MediaDevice
	};
	
	/**
	 * @class Ringer
	 * @classdesc Ringer device plugged into PC. Any speaker device can also be a ringer device.
	 * @extends {MediaDevice}
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Ringer(genericDevice)
	{
	    var deviceInfo = {
	        deviceID : genericDevice.ringerID,
	        hardwareID : genericDevice.hardwareID,
	        isSelected : genericDevice.isSelectedRingerDevice,
	        name : genericDevice.ringerName,
	        vendorID : genericDevice.vendorID
	    };
	
	    cwic.MediaDevice.call(this, deviceInfo);
	
	    this.volume = genericDevice.volume;
	}
	
	Ringer.prototype = Object.create(cwic.MediaDevice.prototype);
	Ringer.prototype.constructor = Ringer;
	
	/**
	 * @memberof Ringer
	 * @member volume
	 * @description
	 * Ringer's output volume level.
	 *
	 * @type {number}
	 * @since 11.7.0
	 */
	Ringer.prototype.volume = 0;
	
	/**
	 * @memberof Ringer
	 * @method setVolume
	 * @description
	 * Sets a new output volume level of the ringer.
	 *
	 * @param volume {Number} - New volume level that will be set. Allowed values are 0 - 100.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Volume Value - Thrown if volume level value is less then 0 or more then 100.
	 *
	 * @since 11.7.0
	 */
	Ringer.prototype.setVolume = function(volume, errorHandler)
	{
	    if(volume < 0 || volume > 100)
	    {
	        throw Error("Invalid Volume Value");
	    }
	
	    this.volume = volume;
	
	    var messageType = "setCurrentRingerVolume";
	    var messageContent = {
	        volume : volume
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	module.exports.Ringer = Ringer;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	// Required Modules
	
	/**
	 * @class Ringtone
	 * @classdesc Sound that will be played on incoming telephony conversation.
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Ringtone(name)
	{
	    this.name = name;
	}
	
	/**
	 * @memberof Ringtone
	 * @member name
	 * @description Name of the ringtone.
	 * @type {string}
	 * @since 11.7.0
	 */
	Ringtone.prototype.name = "unknown";
	
	module.exports.Ringtone = Ringtone;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	/**
	 * @class Monitor
	 * @classdesc
	 * Monitor currently connected to PC.
	 * @constructor
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function Monitor(monitorInfo)
	{
	    this.id = monitorInfo.ID;
	    this.name = monitorInfo.name;
	}
	
	/**
	 * @memberof Monitor
	 * @meber id
	 * @description
	 * Unique monitor ID.
	 * @type {string}
	 * @since 11.7.0
	 */
	Monitor.prototype.id = "Unknown";
	
	/**
	 * @memberof Monitor
	 * @member name
	 * @description
	 * Name of the monitor.
	 * @type {string}
	 * @since 11.7.0
	 */
	Monitor.prototype.name = "Unknown";
	
	module.exports.Monitor = Monitor;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule   = __webpack_require__(7);
	
	// Telephony Modules.
	var TelephonyControllerCapabilitiesModule = __webpack_require__(16);
	var TelephonyConnectionStateModule = __webpack_require__(17);
	var TelephonyConversationModule = __webpack_require__(18);
	var TelephonyDeviceModule       = __webpack_require__(21);
	var SoftPhoneModule             = __webpack_require__(22);
	var DeskPhoneModule             = __webpack_require__(23);
	var RemotePhoneModule           = __webpack_require__(24);
	
	// Utils Modules
	var LoggerModule = __webpack_require__(4);
	
	var cwic = {
	    TelephonyControllerCapabilities : TelephonyControllerCapabilitiesModule.TelephonyControllerCapabilities,
	    TelephonyConnectionStateMap : TelephonyConnectionStateModule.TelephonyConnectionStateMap,
	    TelephonyConversation : TelephonyConversationModule.TelephonyConversation,
	    TelephonyDevice       : TelephonyDeviceModule.TelephonyDevice,
	    SoftPhone             : SoftPhoneModule.SoftPhone,
	    DeskPhone             : DeskPhoneModule.Deskphone,
	    RemotePhone           : RemotePhoneModule.RemotePhone,
	
	    MessageSender         : MessageSenderModule.MessageSender,
	    MessageReceiver       : MessageReceiverModule.MessageReceiver,
	    Logger                : LoggerModule.Logger
	};
	
	/**
	 * @class TelephonyController
	 * @constructor
	 */
	function TelephonyController()
	{
	    var m_EventHandlers = {};
	
	    cwic.MessageReceiver.addMessageHandler('telephonydeviceschange', onTelephonyDeviceListChanged.bind(this));
	    cwic.MessageReceiver.addMessageHandler('connectionstatuschange', onConnectionStateChanged.bind(this));
	    cwic.MessageReceiver.addMessageHandler('connectionfailure', onConnectionFailure.bind(this));
	    cwic.MessageReceiver.addMessageHandler('conversationCallStateChanged', onConversationCallStateChanged.bind(this));
	    cwic.MessageReceiver.addMessageHandler('conversationStateChanged', onConversationStateChanged.bind(this));
	    cwic.MessageReceiver.addMessageHandler('audioCallPickupNotification', onAudioCallPickupNotification.bind(this));
	    cwic.MessageReceiver.addMessageHandler('visualCallPickupNotification', onVisualCallPickupNotification.bind(this));
	    cwic.MessageReceiver.addMessageHandler('callPickupError', onCallPickupError.bind(this));
	    cwic.MessageReceiver.addMessageHandler('telephonyservicechange', onCapabilitiesChanged.bind(this));
	
	    function onTelephonyDeviceListChanged(content)
	    {
	        var index;
	        var telephonyDevices = content.devices;
	
	        this.telephonyDevices.length = 0;
	
	        for(index = 0; index < telephonyDevices.length; ++index)
	        {
	            var device = telephonyDevices[index];
	            var controlMode = device.controlMode;
	
	            switch(controlMode)
	            {
	                case "Deskphone":
	                {
	                    var deskPhone = new cwic.DeskPhone(telephonyDevices[index]);
	                    this.telephonyDevices.push(deskPhone);
	                    break;
	                }
	                case "Softphone":
	                {
	                    var softPhone = new cwic.SoftPhone(telephonyDevices[index]);
	                    this.telephonyDevices.push(softPhone);
	                    break;
	                }
	                case "ExtendConnect":
	                {
	                    var remotePhone = new cwic.RemotePhone(telephonyDevices[index]);
	                    this.telephonyDevices.push(remotePhone);
	                    break;
	                }
	            }
	
	            var eventHandler = m_EventHandlers['onTelephonyDeviceListChanged'];
	            if(eventHandler)
	            {
	                eventHandler();
	            }
	        }
	    }
	
	    function onConnectionStateChanged(state)
	    {
	        this.connectionState = cwic.TelephonyConnectionStateMap[state];
	
	        var eventHandler = m_EventHandlers['onConnectionStateChanged'];
	        if(eventHandler)
	        {
	            eventHandler(this.connectionState);
	        }
	    }
	
	    function onConnectionFailure(content)
	    {
	        var connectionFailure = content;
	        cwic.Logger.error("Failed to connect with CUCM or connection has been broken. Reason: " + connectionFailure);
	
	        var eventHandler = m_EventHandlers['onConnectionFailure'];
	        if(eventHandler)
	        {
	            eventHandler(connectionFailure);
	        }
	    }
	
	    function onConversationStateChanged(content)
	    {
	        var eventHandler = m_EventHandlers['onConversationUpdated'];
	
	        if(eventHandler)
	        {
	            var telephonyConversation = new cwic.TelephonyConversation(content);
	            eventHandler(telephonyConversation);
	        }
	    }
	
	    function onConversationCallStateChanged(content)
	    {
	        var telephonyConversation = new cwic.TelephonyConversation(content);
	        var eventHandler;
	
	        switch(telephonyConversation.callState)
	        {
	            case 'OffHook':
	                eventHandler = m_EventHandlers['onConversationOutgoing'];
	                break;
	            case 'Ringin':
	                eventHandler = m_EventHandlers['onConversationIncoming'];
	                break;
	            case 'OnHook':
	                eventHandler = m_EventHandlers['onConversationEnded'];
	                break;
	            case 'Connected':
	                eventHandler = m_EventHandlers['onConversationStarted'];
	                break;
	            default:
	                eventHandler = m_EventHandlers['onConversationUpdated'];
	        }
	
	        if(eventHandler)
	        {
	            eventHandler(telephonyConversation);
	        }
	    }
	
	    function onVisualCallPickupNotification(content)
	    {
	        var notificationInfo = content.notificationInfo;
	
	        var eventHandler = m_EventHandlers['onVisualCallPickupNotification'];
	
	        if(eventHandler)
	        {
	            eventHandler(notificationInfo);
	        }
	    }
	
	    function onAudioCallPickupNotification(content)
	    {
	        var isAudioEnabled = content.isAudioEnabled;
	
	        var eventHandler = m_EventHandlers['onAudioCallPickupNotification'];
	
	        if(eventHandler)
	        {
	            eventHandler(isAudioEnabled);
	        }
	    }
	
	    function onCallPickupError(content)
	    {
	
	    }
	
	    function onCapabilitiesChanged(content)
	    {
	        var telephonyCapabilities = new cwic.TelephonyControllerCapabilities(content);
	        this.capabilities = telephonyCapabilities;
	
	        this.recentGroupCallPickupNumbers = content.recentGroupCallPickupNumbers ? content.recentGroupCallPickupNumbers : [];
	    }
	
	    /**
	     * @memberof TelephonyController
	     * @method addEventHandler
	     * @description Add handler function for Telephony Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     * @param handler {Function} - Function that will be called when event is fired.
	     *
	     * @since 11.7.0
	     */
	    this.addEventHandler = function(eventName, handler)
	    {
	        m_EventHandlers[eventName] = handler;
	    };
	
	    /**
	     * @memberof TelephonyController
	     * @method removeEventHandler
	     *
	     * @description Remove handler function for TelephonyController's event.
	     *
	     * @param eventName {String} - Name of the event.
	     *
	     * @since 11.7.0
	     */
	    this.removeEventHandler = function(eventName)
	    {
	        delete m_EventHandlers[eventName];
	    };
	
	    /**
	     * @memberof TelephonyController
	     * @method refreshTelephonyDeviceList
	     *
	     * @description Send request to client to refresh telephony device list.
	     *
	     * @since 11.7.0
	     */
	    this.refreshTelephonyDeviceList = function()
	    {
	        var messageType    = "getAvailableDevices";
	        var messageData    = {};
	        var errorHandler   = null;
	        var successHandler = onTelephonyDeviceListChanged.bind(this);
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler, successHandler);
	    };
	}
	
	/**
	 * @memberof TelephonyController
	 * @property telephonyDevices
	 *
	 * @description
	 * List of available telephony devices.
	 * @type {TelephonyDevice[]}
	 * @since 11.7.0
	 */
	TelephonyController.prototype.telephonyDevices = [];
	
	/**
	 * @memberof TelephonyController
	 * @member connectionState
	 *
	 * @description
	 * Current connection state with CUCM.
	 * @type {TelephonyConnectionState}
	 * @since 11.7.0
	 */
	TelephonyController.prototype.connectionState = "Disconnected";
	
	/**
	 * @memberof TelephonyController
	 * @member capabilities
	 * @description
	 * List of telephony controller capabilities.
	 * @type {TelephonyControllerCapabilities}
	 * @since 11.7.0
	 */
	TelephonyController.prototype.capabilities = null;
	
	/**
	 * @memberof TelephonyController
	 * @member recentGroupCallPickupNumbers
	 * @description
	 * List of recently dialed group pickup numbers
	 * @type {String[]}
	 * @since 11.7.0
	 */
	TelephonyController.prototype.recentGroupCallPickupNumbers = [];
	
	/**
	 * @memberof TelephonyController
	 * @method TelephonyController#getConnectedTelephonyDevice
	 * @description Retrieves telephony device that is currently connected with CUCM.
	 *
	 * @returns {TelephonyDevice} Currently connected telephony device.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.getConnectedTelephonyDevice = function()
	{
	    var telephonyDevice = null;
	
	    for(var index in this.telephonyDevices)
	    {
	        if(this.telephonyDevices[index].isSelected)
	        {
	            telephonyDevice = this.telephonyDevices[index];
	            break;
	        }
	    }
	    return telephonyDevice;
	};
	
	/**
	 * @memberof TelephonyController
	 * @method startAudioConversation
	 *
	 * @description
	 * Starts new audio conversation. Before calling this function it is necessary to add 'onConversationStarted' event
	 * handler through addEventHandler in order to receive TelephonyConversation object.
	 *
	 * @param number {String} - Number that will be called to start a conversation.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.startAudioConversation = function(number, errorHandler)
	{
	    var messageType = "originate";
	    var messageData = {
	        recipient : number,
	        videoDirection : "RecvOnly"
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof TelephonyController
	 * @method startVideoConversation
	 *
	 * @description
	 * Starts new video conversation. Before calling this function it is necessary add to 'onConversationStarted' event
	 * handler through addEventHandler in order to receive TelephonyConversation object.
	 *
	 * @param number {String} - Number that will be called to start a conversation.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.startVideoConversation = function(number, errorHandler)
	{
	    var messageType = "originate";
	    var messageData = {
	        recipient : number,
	        videoDirection : "sendRecv"
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof TelephonyController
	 * @method callPickup
	 * @description
	 * Pick up incoming call in call pickup group in which currently connected telephony device's line is associated with.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.callPickup = function(errorHandler)
	{
	    var messageType = "callPickup";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof TelephonyController
	 * @method groupCallPickup
	 * @description
	 * Can be used for both direct call pickup and group call pickup. Group call pickup, picks up incoming call in another
	 * call pickup group. Group number is specified passed as parameter. Direct call pickup, picks up incoming call on the
	 * specified directory number. Directory number is specified as parameter.
	 *
	 * @param number - Group number if used for group call pickup. Directory number if used for direct call pick up.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.groupCallPickup = function(number, errorHandler)
	{
	    var messageType = "groupCallPickup";
	    var messageData = {
	        pickupNumber: number
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof TelephonyController
	 * @method otherGroupPickup
	 * @description
	 * Pick up incoming call, in a group that is associated with group in which currently connected telephony device's line
	 * is associated with.
	 *
	 * @param [errorHandler] - Called if error has occurred in add-on, passes {@link SystemError}.
	 * @since 11.7.0
	 */
	TelephonyController.prototype.otherGroupPickup = function(errorHandler)
	{
	    var messageType = "otherGroupPickup";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	module.exports.TelephonyController = new TelephonyController();

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	/**
	 * @class TelephonyControllerCapabilities
	 * @classdesc
	 * List of telephony capabilities.
	 *
	 * @description This class cannot be instantiated.
	 * @since 11.7.0
	 */
	function TelephonyControllerCapabilities(capabilites)
	{
	    this.isHuntGroupEnabled = capabilites.isHuntGroupEnabled;
	    this.isCallPickupEnabled = capabilites.isCallPickupEnabled;
	    this.isGroupCallPickupEnabled = capabilites.isGroupCallPickupEnabled;
	    this.isOtherGroupPickupEnabled = capabilites.isOtherGroupPickupEnabled;
	}
	
	/**
	 * @memberof TelephonyControllerCapabilities
	 * @member isHuntGroupEnabled
	 * @description Indicates whether hunt group feature is enabled or not.
	 * @type {boolean}
	 *
	 * @since 11.7.0
	 */
	TelephonyControllerCapabilities.prototype.isHuntGroupEnabled = false;
	
	/**
	 * @memberof TelephonyControllerCapabilities
	 * @member isCallPickupEnabled
	 * @description Indicates whether call pickup feature is enabled or not.
	 * @type {boolean}
	 *
	 * @since 11.7.0
	 */
	TelephonyControllerCapabilities.prototype.isCallPickupEnabled = false;
	
	/**
	 * @memberof TelephonyControllerCapabilities
	 * @member isGroupCallPickupEnabled
	 * @description Indicates whether group call pickup feature is enabled or not.
	 * @type {boolean}
	 *
	 * @since 11.7.0
	 */
	TelephonyControllerCapabilities.prototype.isGroupCallPickupEnabled = false;
	
	/**
	 * @memberof TelephonyControllerCapabilities
	 * @member isOtherGroupPickupEnabled
	 * @description Indicates whether other group pickup feature is enabled or not.
	 * @type {boolean}
	 *
	 * @since 11.7.0
	 */
	TelephonyControllerCapabilities.prototype.isOtherGroupPickupEnabled = false;
	
	module.exports.TelephonyControllerCapabilities = TelephonyControllerCapabilities;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	/**
	 * @enum TelephonyConnectionState {Enum}
	 * @description
	 * Represents connection state between CUCM and telephony device.
	 *
	 * @since 11.7.0
	 */
	var TelephonyConnectionState = {
	    /**
	     * Connection is established with CUCM.
	     * @type {String}
	     */
	    Connected : "Connected",
	
	    /**
	     * Establishing connection with CUCM.
	     * @type {String}
	     */
	    Connecting : "Connecting",
	
	    /**
	     * Disconnected from CUCM.
	     * @type {String}
	     */
	    Disconnected : "Disconnected"
	};
	
	var TelephonyConnectionStateMap = {
	    "eReady"                : "Connected",
	    "eIdle"                 : "Disconnected",
	    "eRegistering"          : "Connecting",
	    "eConnectionTerminated" : "Disconnected"
	};
	
	module.exports.TelephonyConnectionStateMap = TelephonyConnectionStateMap;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule   = __webpack_require__(7);
	
	// TelephonyModules
	var TelephonyConversationStatesModule = __webpack_require__(19);
	var TelephonyConversationCapabilitiesModule = __webpack_require__(20);
	
	var cwic = {
	    MessageSender   : MessageSenderModule.MessageSender,
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	
	    TelephonyConversationState : TelephonyConversationStatesModule.TelephonyConversationStates,
	    TelephonyConversationCapabilities : TelephonyConversationCapabilitiesModule.TelephonyConversationCapabilities
	};
	
	/**
	 * @class TelephonyConversation
	 *
	 * @static
	 * @since 11.7.0
	 *
	 * @classdesc
	 * Telephony conversation class can be used to manipulate incoming, ongoing and outcoming conversations. It is the actual
	 * representation of one telephony call.
	 *
	 */
	function TelephonyConversation(conversation)
	{
	    this.ID = conversation.callId;
	
	    // Mapping of video direction to canStartVideo capability
	    // TODO: Do this in addon
	    var canStartVideo = {
	        Inactive : true,
	        SendRecv : false,
	        SendOnly : false,
	        RecvOnly : true
	    };
	
	    // Mapping of video direction to canStopVideo capability
	    // TODO: Do this in addon
	    var canStopVideo = {
	        Inactive : false,
	        SendRecv : true,
	        SendOnly : true,
	        RecvOnly : false
	    };
	
	    this.capabilities = new cwic.TelephonyConversationCapabilities(conversation.capabilities);
	    this.capabilities.canStartVideo = canStartVideo[conversation.videoDirection];
	    this.capabilities.canStopVideo = canStopVideo[conversation.videoDirection];
	
	    this.callState = conversation.callState;
	    this.states = new cwic.TelephonyConversationState(conversation);
	
	    // Participant objects
	    this.localParticipant = conversation.localParticipant;
	    this.maxParticipants  = conversation.maxParticipants;
	    this.participants     = conversation.participants;
	
	
	
	    this.videoDirection   = conversation.videoDirection;
	}
	
	/**
	 * @memberof TelephonyConversation
	 * @member states
	 * @description
	 * List of different active/inactive conversation states.
	 *
	 * @type {TelephonyConversationStates}
	 */
	TelephonyConversation.prototype.states = null;
	
	/**
	 * @memberof TelephonyConversation
	 * @member capabilities
	 * @description
	 * List of capable actions that telephony conversation can perform.
	 *
	 * @type {TelephonyConversationCapabilities}
	 */
	TelephonyConversation.prototype.capabilities = null;
	
	/**
	 * @memberof TelephonyConversation
	 * @member callState
	 * @description
	 * Current call state of telephony conversation.
	 *
	 * @type {String}
	 */
	TelephonyConversation.prototype.callState = null;
	
	/**
	 * @memberof TelephonyConversation
	 * @method answerAudio
	 * @description
	 * Answers incoming telephony conversation with audio.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.answerAudio = function(errorHandler)
	{
	    var messageType = "answer";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method answerVideo
	 * @description
	 * Answers incoming telephony conversation with video.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.answerVideo = function(errorHandler)
	{
	    var messageType = "answer";
	    var messageContent = {
	        callId : this.ID,
	        videoDirection : 'SendRecv'
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method reject
	 * @description
	 * Rejects(Immediate Divert) incoming telephony conversation.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.reject = function(errorHandler)
	{
	    var messageType = "iDivert";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method end
	 * @description
	 * Ends telephony conversation/
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.end = function(errorHandler)
	{
	    var messageType = "endCall";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method hold
	 * @description
	 * Puts telephony conversation on hold.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.hold = function(errorHandler)
	{
	    var messageType = "hold";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method resume
	 * @description
	 * Resumes telephony conversation that was previously been put on hold.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.resume = function(errorHandler)
	{
	    var messageType = "resume";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method startVideo
	 * @description
	 * Start sending video to other participants.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.startVideo = function(errorHandler)
	{
	    var messageType = "setVideoDirection";
	    var messageContent = {
	        callId: this.ID,
	        videoDirection: "SendRecv"
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method stopVideo
	 * @description
	 * Stop sending video to to other participants.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.stopVideo = function(errorHandler)
	{
	    var messageType = "setVideoDirection";
	    var messageContent = {
	        callId: this.ID,
	        videoDirection: "RecvOnly"
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method muteAudio
	 * @description
	 * Mute audio on the telephony conversation.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.muteAudio = function(errorHandler)
	{
	    var messageType = "mute";
	    var messageContent = {
	        callId : this.ID,
	        muteVideo: false,
	        muteAudio: true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method unmuteAudio
	 * @description
	 * Unmute audio on the telephony conversation.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.unmuteAudio = function(errorHandler)
	{
	    var messageType = "unmute";
	    var messageContent = {
	        callId : this.ID,
	        unmuteAudio: true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method muteVideo
	 * @description
	 * Mute video on the telephony conversation. When video is muted remote side will still receive video but it will
	 * only see 'frozen' frame.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.muteVideo = function(errorHandler)
	{
	    var messageType = "mute";
	    var messageContent = {
	        callId : this.ID,
	        muteVideo: true,
	        muteAudio: false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method unmuteVideo
	 * @description
	 * Unmute video on the telephony conversation.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.unmuteVideo = function(errorHandler)
	{
	    var messageType = "unmute";
	    var messageContent = {
	        callId : this.ID,
	        unmuteVideo: true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method transferConversation
	 * @description
	 * Initiates conversation transfer to another directory number. In order for transfer to be complete, successive call to
	 * completeTransfer() must be made.
	 *
	 * @param number {Number} - Number to witch conversation will be transferred.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 *
	 * @see completeTransfer
	 */
	TelephonyConversation.prototype.transferConversation = function(number, errorHandler)
	{
	    var messageType = "transferCall";
	    var messageContent = {
	        callId : this.ID,
	        transferToNumber : number
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method completeTransfer
	 * @description
	 * Completes telephony conversation transfer that was previously initiated.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 *
	 * @see transferConversation
	 */
	TelephonyConversation.prototype.completeTransfer = function(errorHandler)
	{
	    var messageType = "completeTransfer";
	    var messageContent = {
	        callId : this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method merge
	 * @description
	 * Merge two telephony conversations in conference conversation.
	 *
	 * @param conversation {TelephonyConversation} - Conversation that will be merged.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if conversation is not instance of {@link TelephonyConversation}.
	 *
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.merge = function(conversation, errorHandler)
	{
	    if(!(conversation instanceof TelephonyConversation))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = "joinCalls";
	    var messageContent = {
	        callId : this.ID,
	        joinCallId : conversation.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method startScreenShare
	 * @description
	 * Starts sharing of the screen. If this function is called and no screen has been selected for sharing through
	 * MultimediaController.selectMonitor(), default screen will be selected for sharing. Defaulted screen is the first
	 * screen retrieved when monitors are being enumerated during plugin initialization or the previously set monitor
	 * through MultimediaController.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 *
	 * @see MultimedaiController
	 */
	TelephonyConversation.prototype.startScreenShare = function(errorHandler)
	{
	    var messageType = "requestDesktopShare";
	    var messageContent = {
	        callId: this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method stopScreenShare
	 * @description
	 * Stops sharing of the screen.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.stopScreenShare = function(errorHandler)
	{
	    var messageType = "releaseDesktopShare";
	    var messageContent = {
	        callId: this.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method sendDTMF
	 * @description
	 * Send one or more DTMF characters.
	 *
	 * @param dtmfDigit{String} - DTMF characters that will be sent.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.sendDTMF = function(dtmfDigit, errorHandler)
	{
	    var messageType = "sendDTMF";
	    var messageContent = {
	        callId: this.ID,
	        digit: dtmfDigit
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method startRemoteCameraAction
	 * @description
	 * Starts remote camera action.
	 * Once this method is called remote camera will continuously perform specified action. To stop specified
	 * action {@link TelephonyConversation.stopRemoteCameraAction} needs to be called.
	 *
	 * @param action{String} - Action to will be started. For supported camera actions please see {@link RemoteCameraAction}
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.startRemoteCameraAction = function (action, errorHandler)
	{
	    var messageType = "startFECCAction";
	    var messageContent = {
	        callId: this.ID,
	        action: action
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent,errorHandler);
	};
	
	/**
	 * @memberof TelephonyConversation
	 * @method stopRemoteCameraAction
	 * @description
	 * Stops remote camera action previously started with {@link TelephonyConversation.startRemoteCameraAction}.
	 *
	 * @param action{String} - Action to will be stopped. For supported camera actions please see {@link RemoteCameraAction}
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyConversation.prototype.stopRemoteCameraAction = function (action, errorHandler)
	{
	    var messageType = "stopFECCAction";
	    var messageContent = {
	        callId: this.ID,
	        action: action
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageContent, errorHandler);
	};
	
	exports.TelephonyConversation = TelephonyConversation;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/**
	 * @class TelephonyConversationStates
	 * @static
	 *
	 * @description
	 * Represents different conversation states that can be present or not.
	 *
	 * @since 11.7.0
	 */
	function TelephonyConversationStates(conversation)
	{
	    this.isAudioMuted = conversation.audioMuted;
	    this.isVideoMuted = conversation.videoMuted;
	    this.isLocalSharing = conversation.isLocalSharing;
	    this.isRemoteSharing = conversation.isRemoteSharing;
	}
	
	/**
	 * @property isAudioMuted
	 * @description
	 * Indicates if audio is muted or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationStates.prototype.isAudioMuted = false;
	
	/**
	 * @property isVideoMuted
	 * @description
	 * Indicates if video is muted or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationStates.prototype.isVideoMuted = false;
	
	/**
	 * @property isLocalSharing
	 * @description
	 * Indicates if screen is shared or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationStates.prototype.isLocalSharing = false;
	
	/**
	 * @property isRemoteSharing
	 * @description
	 * Indicates if screen is shared by remote participant or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationStates.prototype.isRemoteSharing = false;
	
	
	module.exports.TelephonyConversationStates = TelephonyConversationStates;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	/**
	 * @class TelephonyConversationCapabilities
	 * @static
	 * @description
	 * List of capabilities that telephony conversation can perform.
	 *
	 * @since 11.7.0
	 */
	function TelephonyConversationCapabilities(capabilities)
	{
	    this.canAnswer              = capabilities.canAnswerCall;
	    this.canEnd                 = capabilities.canEndCall;
	    this.canReject              = capabilities.canRejectCall;
	    this.canHold                = capabilities.canHold;
	    this.canResume              = capabilities.canResume;
	    this.canMerge               = capabilities.canJoinAcrossLine;
	    this.canTransfer            = capabilities.canDirectTransfer;
	    this.canMuteAudio           = capabilities.canMuteAudio;
	    this.canUnmuteAudio         = capabilities.canUnmuteAudio;
	    this.canMuteVideo           = capabilities.canMuteVideo;
	    this.canUnmuteVideo         = capabilities.canUnmuteVideo;
	    this.canStartScreenShare    = capabilities.canRequestShare;
	    this.canStopScreenShare     = capabilities.canReleaseShare;
	    this.canSendDTMF            = capabilities.canSendDigit;
	    this.canControlRemoteCamera = capabilities.canFarEndCameraControl;
	    this.canCameraTiltUp        = capabilities.canTiltUp;
	    this.canCameraTiltDown      = capabilities.canTiltDown;
	    this.canCameraPanLeft       = capabilities.canPanLeft;
	    this.canCameraPanRight      = capabilities.canPanRight;
	    this.canCameraZoomIn        = capabilities.canZoomIn;
	    this.canCameraZoomOut       = capabilities.canZoomOut;
	    this.canUpdateVideo = capabilities.canUpdateVideoCapability;
	}
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canAnswer
	 * @description
	 * If true telephony conversation can be answered;
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canAnswer = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canEnd
	 * @description
	 * If true telephony conversation can be ended.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canEnd = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canReject
	 * @description
	 * If true telephony conversation can be rejected (Immediate Divert).
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canReject = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canHold
	 * @description
	 * If true telephony conversation can be put on hold.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canHold = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canResume
	 * @description
	 * If true telephony conversation previously put on hold can be resumed.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canResume = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canMerge
	 * @description
	 * If true telephony conversation can be merged with another one and form a conference conversation.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canMerge = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canTransfer
	 * @description
	 * If true telephony conversation can be transferred to another number.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canTransfer = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canMuteAudio
	 * @description
	 * If true telephony conversation's audio can be muted.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canMuteAudio = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canUnmuteAudio
	 * @description
	 * If true telephony conversation's audio can be unmuted.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canUnmuteAudio = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canMuteVideo
	 * @description
	 * If true telephony conversation's video can be muted.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canMuteVideo = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canUnmuteVideo
	 * @description
	 * If true telephony conversation's video can be unmuted.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canUnmuteVideo = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canUpdateVideo
	 * @description
	 * If true telephony conversation's video can be started or stopped. This capability is
	 * used in combination with [canStartVideo]{@link TelephonyConversationCapabilities#canStartVideo} and
	 * [canStopVideo]{@link TelephonyConversationCapabilities#canStopVideo} capabilities
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canUpdateVideo = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canStartVideo
	 * @description
	 * If true telephony conversation's video can be started.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canStartVideo = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canStopVideo
	 * @description
	 * If true telephony conversation's video can be stopped.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canStopVideo = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canStopScreenShare
	 * @description
	 * If true telephony conversation can stop screen share.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canStopScreenShare = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canStartScreenShare
	 * @description
	 * If true telephony conversation can start screen share.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canStartScreenShare = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canSendDTMF
	 * @description
	 * If true telephony conversation can send DTMF digits.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canSendDTMF = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canControlRemoteCamera
	 * @description
	 * If true remote camera can be controlled.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canControlRemoteCamera = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraTiltUp
	 * @description
	 * If true remote camera can be tilted up.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraTiltUp = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraTiltDown
	 * @description
	 * If true remote camera can be tilted down.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraTiltDown = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraPanLeft
	 * @description
	 * If true remote camera can be panned left.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraPanLeft = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraPanRight
	 * @description
	 * If true remote camera can be panned right.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraPanRight = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraZoomIn
	 * @description
	 * If true remote camera can zoom in.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraZoomIn = false;
	
	/**
	 * @memberof TelephonyConversationCapabilities
	 * @member canCameraZoomOut
	 * @description
	 * If true remote camera can zoom out.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	TelephonyConversationCapabilities.prototype.canCameraZoomOut = false;
	
	module.exports.TelephonyConversationCapabilities = TelephonyConversationCapabilities;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	var cwic = {
	    MessageSender : MessageSenderModule.MessageSender
	};
	
	/**
	 * @class TelephonyDevice
	 * @classdesc
	 * Telephony Device represents abstraction of actual phone device.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function TelephonyDevice(device)
	{
	    this.name                 = device.name;
	    this.controlMode          = device.controlMode;
	    this.description          = device.description;
	    this.type                 = device.modelDescription;
	    this.lineDirectoryNumbers = device.lineDNs;
	    this.activeLine           = device.activeLineNumber;
	    this.isSelected           = device.isSelected;
	    this.huntGroupState       = device.huntGroupState;
	    this.guid                 = device.guid;
	}
	
	/**
	 * @memberof TelephonyDevice
	 * @member name
	 * @description
	 * Name of telephony device. Reflects the value set on CUCM.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.name = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member controlMode
	 * @description
	 * Mod in which telephony device is controlled: SoftPhone, DeskPhone, RemotePhone
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.controlMode = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member description
	 * @description
	 * Telephony device's description. Reflects the value set on CUCM.
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.description = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member type
	 * @description
	 * Telephony device's type. Reflects the value set on CUCM.
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.type = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member lineDirectoryNumbers
	 * @description
	 * Line directory numbers associated with this device. This property is set only when device is connected to CUCM.
	 * List of available lines reflects the ones set up on CUCM.
	 *
	 * @type {Array}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.lineDirectoryNumbers = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member activeLine
	 * @description
	 * Line that is used by telephony device when it is connected to CUCM.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.activeLine = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member isSelected
	 * @description
	 * Tells whether telephony device is connected to CUCM or not.
	 *
	 * @type {Boolean}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.isSelected = false;
	
	/**
	 * @memberof TelephonyDevice
	 * @member huntGroupState
	 * @description
	 * Telephony device's current hunt group state.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.huntGroupState = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @member guid
	 * @description
	 * Telephony device's GUID.
	 *
	 * @type {String}
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.guid = null;
	
	/**
	 * @memberof TelephonyDevice
	 * @method connect
	 * @description
	 * Connect telephony device to CUCM.
	 *
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.connect = function(){};
	
	/**
	 * @memberof TelephonyDevice
	 * @method huntGroupLogin
	 * @description
	 * Login telephony device to hunt group.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.huntGroupLogin = function(errorHandler)
	{
	    if(this.huntGroupState === "LoggedOut")
	    {
	        var messageType = "toggleHuntGroupLogin";
	        var messageData = {
	            deviceGuid : this.guid
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    }
	};
	
	/**
	 * @memberof TelephonyDevice
	 * @method huntGroupLogout
	 * @description
	 * Logout telephony device from hunt group.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	TelephonyDevice.prototype.huntGroupLogout = function(errorHandler)
	{
	    if(this.huntGroupState === "LoggedIn")
	    {
	        var messageType = "toggleHuntGroupLogin";
	        var messageData = {
	            deviceGuid : this.guid
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    }
	};
	
	module.exports.TelephonyDevice = TelephonyDevice;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var TelephonyDeviceModule = __webpack_require__(21);
	
	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	var cwic = {
	    TelephonyDevice : TelephonyDeviceModule.TelephonyDevice,
	    MessageSender   : MessageSenderModule.MessageSender
	};
	
	/**
	 * @class SoftPhone
	 * @extends {TelephonyDevice}
	 * @classdesc SoftPhone represents software telephony device.
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function SoftPhone(device)
	{
	    cwic.TelephonyDevice.call(this, device)
	}
	
	SoftPhone.prototype = Object.create(cwic.TelephonyDevice.prototype);
	SoftPhone.prototype.constructor = SoftPhone;
	
	
	/**
	 * @memberof SoftPhone
	 * @method connect
	 * @description
	 * Connect to and register softphone device with CUCM. If force registration is set to true, and this device is
	 * registered elsewhere, device will first be disconnected then connected again.
	 *
	 * @param isForceRegistration {Boolean} - Flag that tells whether its a force registration or not.
	 * @throw Invalid Number Of Arguments - Thrown if isForceRegistration is not specified.
	 *
	 * @since 11.7.0
	 */
	SoftPhone.prototype.connect = function(isForceRegistration)
	{
	    if(arguments.length !== 1)
	    {
	        throw Error("Invalid Number of Arguments");
	    }
	
	    var messageType = "connect";
	    var messageData = {
	        phoneMode: "Softphone",
	        deviceName: this.name,
	        lineDN: "",
	        forceRegistration: isForceRegistration
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData);
	};
	
	// Module Exports
	module.exports.SoftPhone = SoftPhone;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// Telephony Modules
	var TelephonyDeviceModule = __webpack_require__(21);
	
	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	
	var cwic = {
	    TelephonyDevice : TelephonyDeviceModule.TelephonyDevice,
	    MessageSender   : MessageSenderModule.MessageSender
	};
	
	
	/**
	 * @class DeskPhone
	 * @extends {TelephonyDevice}
	 * @classdesc
	 * Deskphone represents physical telephony device. Along with all capabilities of telephony device it can also change
	 * active line.
	 *
	 * @description This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function DeskPhone(device)
	{
	    cwic.TelephonyDevice.call(this, device)
	}
	
	DeskPhone.prototype = Object.create(cwic.TelephonyDevice.prototype);
	DeskPhone.prototype.constructor = DeskPhone;
	
	/**
	 * @memberof DeskPhone
	 * @method selectLine
	 * @description
	 * Change active line to a new one.
	 *
	 * @param line {String} - A line that will be selected.
	 *
	 * @since 11.7.0
	 */
	DeskPhone.prototype.selectLine = function(line)
	{
	    var messageType = "connect";
	    var messageData = {
	        phoneMode: "Softphone",
	        deviceName: this.name,
	        lineDN: line,
	        forceRegistration: false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData);
	};
	
	/**
	 * @memberof DeskPhone
	 * @method connect
	 * @description
	 * Connect to and register deskphone device with CUCM. If force registration is set to true, and this device is
	 * registered elsewhere, device will first be disconnected then connected again.
	 *
	 * @param isForceRegistration {Boolean} - Flag that tells whether its a force registration or not.
	 *
	 * @throw Invalid Number Of Arguments - Thrown if isForceRegistration is not specified.
	 *
	 * @since 11.7.0
	 */
	DeskPhone.prototype.connect = function(isForceRegistration)
	{
	    if(arguments.length !== 1)
	    {
	        throw Error("Invalid number of arguments");
	    }
	
	    var messageType = "connect";
	    var messageData = {
	        phoneMode: "Softphone",
	        deviceName: this.name,
	        lineDN: "",
	        forceRegistration: isForceRegistration
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData);
	};
	
	// Module Exports
	module.exports.Deskphone = DeskPhone;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var telephonyDeviceModule = __webpack_require__(21);
	
	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	
	var cwic = {
	    TelephonyDevice     : telephonyDeviceModule.TelephonyDevice,
	    MessageSender       : MessageSenderModule.MessageSender
	};
	
	RemotePhone.prototype = Object.create(cwic.TelephonyDevice.prototype);
	RemotePhone.prototype.constructor = RemotePhone;
	
	/**
	 * @class RemotePhone
	 * @extends {TelephonyDevice}
	 * @classdesc
	 * RemotePhone represents remote device that can be connected to CUCM through "Extened&Connect" feature.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function RemotePhone(device)
	{
	    cwic.TelephonyDevice.call(this, device);
	
	    var m_Number = "";
	
	    this.getNumber = function()
	    {
	        return m_Number;
	    };
	
	    this.setNumber = function(number)
	    {
	        m_Number = number;
	    };
	}
	
	/**
	 * @memberof RemotePhone
	 * @method connect
	 * @description
	 * Connect to and register deskphone device with CUCM. If force registration is set to true, and this device is
	 * registered elsewhere, device will first be disconnected then connected again.
	 *
	 * @param number (String} - Number that will be associated with this device (Represents remoteDestinationNumber on CUCM).
	 * @param isForceRegistration {Boolean} - Flag that tells whether its a force registration or not.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Number Of Arguments - Thrown if isForceRegistration is not specified.
	 *
	 * @since 11.7.0
	 */
	RemotePhone.prototype.connect = function(number, isForceRegistration, errorHandler)
	{
	    if(arguments.length !== 2)
	    {
	        throw Error("Invalid Number of Arguments");
	    }
	
	    var messageType = "selectRemoteDestination";
	    var messageData = {
	        deviceName : this.name,
	        remoteDestinationNumber : number,
	        forceRegistration : isForceRegistration
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof RemotePhone
	 * @method deleteNumber
	 * @description
	 * Delete remote number used for remote phone. Doing this will also disconnect from and unregister remote phone from
	 * the CUCM.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	RemotePhone.prototype.deleteNumber = function(errorHandler)
	{
	    var messageType = "deleteRemoteDestination";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	
	// Module Exports
	module.exports.RemotePhone = RemotePhone;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule   = __webpack_require__(7);
	var LoggerModule          = __webpack_require__(4);
	var AuthenticationEnumModule = __webpack_require__(26);
	
	
	var cwic = {
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender   : MessageSenderModule.MessageSender,
	    Logger          : LoggerModule.Logger,
	    AuthenticationState : AuthenticationEnumModule.AuthenticationState,
	    AuthenticationError : AuthenticationEnumModule.AuthenticationError,
	    AuthenticationStateMap : AuthenticationEnumModule.AuthenticationStateMap,
	    AuthenticationErrorMap : AuthenticationEnumModule.AuthenticationErrorMap
	};
	
	
	/**
	 * @class LoginController
	 * @constructor
	 */
	function LoginController()
	{
	    var m_EventHandlers = {};
	    var m_CTIServers    = [];
	    var m_CCMCIPServers = [];
	    var m_TFTPServers   = [];
	    var m_SSORedirectURL = "";
	    this.signInType    = "Unknown";
	
	    cwic.MessageReceiver.addMessageHandler('lifecyclestatechanged', onLoginStateChanged.bind(this));
	    cwic.MessageReceiver.addMessageHandler('userprofilecredentialsrequired', onCredentialsRequired.bind(this));
	    cwic.MessageReceiver.addMessageHandler('userprofileemailaddressrequired', onEmailRequired.bind(this));
	    cwic.MessageReceiver.addMessageHandler('loggedin', onLoggedIn.bind(this));
	    cwic.MessageReceiver.addMessageHandler('authenticationresult', onAuthenticationResults.bind(this));
	    cwic.MessageReceiver.addMessageHandler('ssonavigateto', onSSONavigateRequired);
	
	    function onEmailRequired()
	    {
	        if(this.signInType == "Manual")
	        {
	            this.setEmail('dummy@jsdk.com');
	        }
	        else
	        {
	            cwic.Logger.info("E-mail address is required.");
	            var eventHandler = m_EventHandlers['onEmailRequired'];
	            if(eventHandler)
	            {
	                // TODO Add additional logic here
	                eventHandler();
	            }
	        }
	    }
	
	    function onCredentialsRequired()
	    {
	        cwic.Logger.info("Credentials are required.");
	        var eventHandler = m_EventHandlers['onCredentialsRequired'];
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onLoginStateChanged(content)
	    {
	        var lifecycleState = content;
	        var eventHandler   = null;
	        var loginState     = "";
	
	        switch(lifecycleState)
	        {
	            case "SIGNEDOUT" :
	            {
	                eventHandler = m_EventHandlers['onSignedOut'];
	                loginState = "Signed Out";
	                break;
	            }
	            case "SIGNINGOUT" :
	            {
	                eventHandler = m_EventHandlers['onSigningOut'];
	                loginState = "Signing Out";
	                break;
	            }
	            case "SIGNEDIN" :
	            {
	                eventHandler = m_EventHandlers['onSignedIn'];
	                loginState = "Signed In";
	                break;
	            }
	            case "SIGNINGIN" :
	            {
	                eventHandler = m_EventHandlers['onSigningIn'];
	                loginState = "Signing In";
	                break;
	            }
	            case "DISCOVERING" :
	            {
	                eventHandler = m_EventHandlers['onServiceDiscovering'];
	                loginState = "Discovering Services";
	                break;
	            }
	            case "RESETTING" :
	            {
	                eventHandler = m_EventHandlers['onDataResetting'];
	                loginState = "Resetting User Data";
	                break;
	            }
	        }
	
	        cwic.Logger.info("Login state has changed to: " + loginState + ".");
	
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onAuthenticationResults(content)
	    {
	        var authenticationResult = content.result;
	
	        var eventParam  = "";
	        var eventHandler = null;
	
	        switch(authenticationResult)
	        {
	            case "":
	            case "eNoError":
	                eventHandler = m_EventHandlers["onAuthenticationStateChanged"];
	                eventParam = cwic.AuthenticationStateMap[content.status];
	                cwic.Logger.info("Authentication state has changed to: " + eventParam);
	                break;
	            case "eFailed":
	                eventHandler = m_EventHandlers["onAuthenticationFailed"];
	                eventParam = cwic.AuthenticationErrorMap[content.status];
	                cwic.Logger.warning("Authentication failed! Reason: " + eventParam);
	                break;
	        }
	
	        if(eventHandler)
	        {
	            eventHandler(eventParam);
	        }
	    }
	
	    function onLoggedIn()
	    {
	        var eventHandler = m_EventHandlers['onLoggedIn'];
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onSSONavigateRequired(content)
	    {
	        cwic.Logger.info("SSO Navigation required.");
	        var eventHandler = m_EventHandlers['onSSONavigationRequired'];
	        if(eventHandler)
	        {
	            // Not a valid URL for sdk client that is received from JCF.
	            // We need to replace client_id parameter in SSOUrl with a valid client ID.
	            var SSOUrl = content;
	
	            // Regex for finding client id.
	            var regex = new RegExp("client_id=[A-Za-z0-9]*");
	
	            // Valid client id for SDK client.
	            var SSOClientID = 'C69908c4f345729af0a23cdfff1d255272de942193e7d39171ddd307bc488d7a1';
	
	            var url = SSOUrl.replace(regex, "client_id=" + SSOClientID);
	
	            if(m_SSORedirectURL !== "")
	            {
	                url += "&redirect_uri=" + encodeURIComponent(m_SSORedirectURL);
	            }
	
	            eventHandler(url);
	        }
	    }
	
	    /**
	     * @memberof LoginController
	     * @method addEventHandler
	     * @description Add handler function for Login Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     * @param eventHandler {Function} - Function that will be called when event is fired.
	     *
	     * @since 11.7.0
	     */
	    this.addEventHandler = function(eventName, eventHandler)
	    {
	        m_EventHandlers[eventName] = eventHandler;
	    };
	
	    /**
	     * @memberof LoginController
	     * @method removeEventHandler
	     * @description Remove handler function for Login Controller's event.
	     *
	     * @param eventName {String} - Name of the event for which handler will be removed.
	     *
	     * @since 11.7.0
	     */
	    this.removeEventHandler = function(eventName)
	    {
	        delete m_EventHandlers[eventName];
	    };
	
	    /**
	     * @memberof LoginController
	     * @method setSSORedirectURL
	     * @description
	     * Set URL that will be used as a redirection once a successful authentication has been performed with
	     * identity provider.
	     *
	     * @param redirectURL {String} - URL that will be set.
	     * @since 11.7.0
	     */
	    this.setSSORedirectURL = function(redirectURL)
	    {
	        m_SSORedirectURL = redirectURL;
	    };
	
	    /**
	     * @memberof LoginController
	     * @method setCTIServers
	     * @description
	     * Set up to a maximum of 3 CTI servers.
	     *
	     * @param CTIServers {Array} - List of CTI servers to be set
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     *
	     * @throw Invalid Object - Thrown if CTIServers is not an array.
	     *
	     * @since 11.7.0
	     */
	    this.setCTIServers = function(CTIServers, errorHandler)
	    {
	        if(!(CTIServers instanceof Array))
	        {
	            throw Error("Invaild Object");
	        }
	        if(CTIServers.length > 3)
	        {
	            throw "Server List Size Exceeds Maximum Value."
	        }
	
	        m_CTIServers = CTIServers;
	
	        var messageType = "setProperty";
	        var messageData = {CtiAddressList : CTIServers};
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof LoginController
	     * @method setTFTPServers
	     * @description
	     * Set up to a maximum of 3 TFTP servers.
	     *
	     * @param TFTPServers {Array} - List of TFTP servers to be set
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     *
	     * @throw Invalid Object - Thrown if TFTPServers is not an array.
	     *
	     * @since 11.7.0
	     */
	    this.setTFTPServers = function(TFTPServers, errorHandler)
	    {
	        if(!(TFTPServers instanceof Array))
	        {
	            throw Error("Invaild Object");
	        }
	        if(TFTPServers.length > 3)
	        {
	            throw "Server List Size Exceeds Maximum Value."
	        }
	
	        m_TFTPServers = TFTPServers;
	        var messageType = "setProperty";
	        var messageData = {TftpAddressList : TFTPServers};
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof LoginController
	     * @method setCUCMPServers
	     * @description
	     * Set up to a maximum of 3 CUCM servers.
	     *
	     * @param CUCMServers {Array} - List of CUCM servers to be set
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     *
	     * @throw Invalid Object - Thrown if CUCMServers is not an array.
	     *
	     * @since 11.7.0
	     */
	    this.setCUCMServers = function (CUCMServers, errorHandler)
	    {
	        if(!(CUCMServers instanceof Array))
	        {
	            throw Error("Invaild Object");
	        }
	        if(CUCMServers.length > 3)
	        {
	            throw "Server List Size Exceeds Maximum Value."
	        }
	
	        m_CCMCIPServers = CUCMServers;
	        var messageType = "setProperty";
	        var messageData = {CcmcipAddressList : CUCMServers};
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	}
	
	/**
	 * @memberof LoginController
	 * @method signIn
	 * @description
	 * Performs manual sign in. In order for sign in to be successful credentials and servers needs to be setup properly.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	LoginController.prototype.signIn = function(errorHandler)
	{
	    this.signInType = "Manual";
	
	    var messageType = "startSignIn";
	    var messageData = {
	        manualSettings : true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method signOut
	 * @description
	 * Perform sign out.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	LoginController.prototype.signOut = function(errorHandler)
	{
	    var messageType = "logout";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method startDiscovery
	 * @description
	 * Start service discovery lifecycle.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	LoginController.prototype.startDiscovery = function(errorHandler)
	{
	    this.signInType = "Discovery";
	    var messageType = "startSignIn";
	    var messageData = {
	        manualSettings : false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method setEmail
	 * @description
	 * Set email address that will be used for service discovery. Should be called when "onEmailRequired" event is fired.
	 *
	 * @param email {String} - E-mail address to be set.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	LoginController.prototype.setEmail = function(email, errorHandler)
	{
	    var messageType = "setUserProfileEmailAddress";
	    var messageData = {
	        email : email
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method setCredentials
	 * @description
	 * Set credentials that will be used in login process. Should be called when "onCredentialsRequired" event is fired.
	 *
	 * @param username {String} - Username to be set.
	 * @param password {String} - Password to be set.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	LoginController.prototype.setCredentials = function(username, password, errorHandler)
	{
	    var messageType = "setUserCredentials";
	    var messageData = {
	        username: username,
	        password: password
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method resetUserData
	 * @description
	 * Erases all user specific data that was cached in add-on.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	LoginController.prototype.resetUserData = function(errorHandler)
	{
	    var messageType = "resetData";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method setSSOTokenUri
	 * @description
	 * Set SSO token uri that was retrieved from identity provided.
	 *
	 * @param uri {String} - Token uri that will be set.
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	LoginController.prototype.setSSOTokenURI = function(uri, errorHandler)
	{
	    var messageType = "ssoNavigationCompleted";
	    var messageData = {
	        result: 200,
	        url: uri,
	        document: ''
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof LoginController
	 * @method cancelSSO
	 * @description
	 * Cancel ongoing SSO procedure.
	 *
	 * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	 * @since 11.7.0
	 */
	LoginController.prototype.cancelSSO = function(errorHandler)
	{
	    var messageType = "cancelSingleSignOn";
	    var messageData = {};
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	module.exports.LoginController = new LoginController();


/***/ }),
/* 26 */
/***/ (function(module, exports) {

	/**
	 * @enum AuthenticationState {Enum}
	 * @description
	 * Different authentication states that can occur when trying to connect to CUCM.
	 *
	 * @since 11.7.0
	 */
	var AuthenticationState = {
	    /**
	     * Initial state before authentication attempt has occurred.
	     * @type {String}
	     */
	    NotAuthenticated : "NotAuthenticated",
	
	    /**
	     * Authentication with CUCM is in progress.
	     * @type {String}
	     */
	    InProgress       : "InProgress",
	
	    /**
	     * Successfully authenticated with CUCM.
	     * @type {String}
	     */
	    Authenticated    : "Authenticated"
	};
	
	/**
	 * @enum AuthenticationError {Enum}
	 * @description
	 * Different authentication errors that can occur during authentication process with CUCM.
	 *
	 * @since 11.7.0
	 */
	var AuthenticationError = {
	    /**
	     *  The last attempt at authentication with CUCM failed because of invalid configuration. The CCMIP server
	     *  was incorrect.
	     *  @type {String}
	     */
	    InvalidConfig             : "InvalidConfiguration",
	
	    /**
	     * The last attempt at authentication with CUCM failed because the users credentials are incorrect.
	     * @type {String}
	     */
	    InvalidCredentials        : "InvalidCredentials",
	
	    /**
	     * The last attempt at authentication with CUCM failed because the authentication token was invalid.
	     * @type {String}
	     */
	    InvalidToken              : "InvalidToken",
	
	    /**
	     * The last attempt at authentication with CUCM failed because the user rejected an invalid server certificate.
	     * @type {String}
	     */
	    ServerCertificateRejected : "ServerCertificateRejected",
	
	    /**
	     * The last attempt at authentication with CUCM failed because of an error with the client's certificate.
	     * @type {String}
	     */
	    ClientCertificateError    : "ClientCertificateError",
	
	    /**
	     * The last attempt at authentication with CUCM failed because no credentials are configured.
	     * @type {String}
	     */
	    NoCredentialsConfigured   : "NoCredentialsConfigured",
	
	    /**
	     * Unable to connect to CUCM.
	     * @type {String}
	     */
	    CouldNotConnect           : "CouldNotConnect",
	
	    /**
	     * The last attempt at authentication failed.
	     * @type {String}
	     */
	    Failed                    : "Failed",
	
	    /**
	     * TLS/SSL Connection Error.
	     * @type {String}
	     */
	    SSLConnectError           : "SSLConnectionError",
	
	    /**
	     * Unknown authentication failure.
	     * @type {String}
	     */
	    Unknown                   : "Unknown"
	};
	
	var AuthenticationStateMap  = {
	    eAuthenticated   : "Authenticated",
	    eInProgress      : "InProgress",
	    eNotAuthenticated: "NotAuthenticated"
	};
	
	var AuthenticationErrorMap = {
	    eNoServersConfigured       : "InvalidConfiguration",
	    eCredentialsRejected       : "InvalidCredentials",
	    eInvalidToken              : "InvalidToken",
	    eServerCertificateRejected : "ServerCertificateRejected",
	    eClientCertificateError    : "ClientCertificateError",
	    eNoCredentialsConfigured   : "NoCredentialsConfigured",
	    eCouldNotConnect           : "CouldNotConnect",
	    eFailed                    : "Failed",
	    eSSLConnectError           : "SSLConnectionError",
	    ""                         : "Unknown"
	};
	
	module.exports.AuthenticationState = AuthenticationState;
	module.exports.AuthenticationError = AuthenticationError;
	module.exports.AuthenticationStateMap = AuthenticationStateMap;
	module.exports.AuthenticationErrorMap = AuthenticationErrorMap;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var MessageReceiverModule  = __webpack_require__(2);
	var MessageSenderModule    = __webpack_require__(7);
	var ChromeExtensionModule  = __webpack_require__(28);
	var FirefoxExtensionModule = __webpack_require__(30);
	var NPAPIPluginModule      = __webpack_require__(31);
	var ActiveXControlModule   = __webpack_require__(32);
	var VersionModule          = __webpack_require__(33);
	var LoggerModule           = __webpack_require__(4);
	var UtilitesModule         = __webpack_require__(5);
	var SystemControllerCapabilitiesModule = __webpack_require__(34);
	
	var cwic = {
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender   : MessageSenderModule.MessageSender,
	
	    ChromeExtension  : ChromeExtensionModule.ChromeExtension,
	    FirefoxExtension : FirefoxExtensionModule.FirefoxExtension,
	    NPAPIPlugin      : NPAPIPluginModule.NPAPIPlugin,
	    ActiveXControl   : ActiveXControlModule.ActiveXControl,
	
	    Logger  : LoggerModule.Logger,
	    Utilities : UtilitesModule.Utilities,
	    Version : VersionModule.Version,
	    version : VersionModule.cwicVersion,
	
	    SystemControllerCapabilities : SystemControllerCapabilitiesModule.SystemControllerCapabilities
	};
	
	/**
	 * @class SystemController
	 * @classdesc
	 * Controller responsible for initializing CWIC, and notifying of various system events. CWIC global capabilities can
	 * also be retrieved once the CWIC has been initialized.
	 *
	 * @since 11.7.0
	 */
	function SystemController()
	{
	    var m_EventHandlers = {};
	    var m_Capabilities  = {};
	    var m_ClientID      = cwic.Utilities.generateUniqueId();
	    var m_Version       = {};
	    var m_Plugin        = null;
	    this.cwicVersion = "11.8.3.282316";
	    this.addonVersion = "Unknown";
	    this.systemRelease = "Unknown";
	    this.platformOS = "Unknown";
	
	    cwic.MessageReceiver.addMessageHandler('init', onCwicInitialized.bind(this));
	    cwic.MessageReceiver.addMessageHandler('userauthorized', onUserAuthorized.bind(this));
	    cwic.MessageReceiver.addMessageHandler('addonConnectionLost', onAddonConnectionLost.bind(this));
	
	    function onCwicInitialized(content)
	    {
	        m_Capabilities = new cwic.SystemControllerCapabilities(content.capabilities);
	        this.addonVersion = content.version.plugin;
	        this.systemRelease = content.version.system_release;
	        this.platformOS = content.system.platform;
	
	        if(this.addonVersion !== this.cwicVersion)
	        {
	            cwic.Logger.warning("Cwic version and add-on version miss-match");
	        }
	
	        cwic.Logger.info("System Initialized.");
	
	        if(m_EventHandlers['onInitialized'])
	        {
	            var onInitializedCallback = m_EventHandlers['onInitialized'];
	            onInitializedCallback();
	        }
	    }
	
	    function onUserAuthorized(content)
	    {
	        var eventName;
	        if(content === true)
	        {
	            eventName = 'onUserAuthorized';
	        }
	        else
	        {
	            eventName = 'onUserAuthorizationRejected';
	        }
	
	        var eventHandler = m_EventHandlers[eventName];
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function onAddonConnectionLost()
	    {
	        var eventHandler = m_EventHandlers['onAddonConnectionLost'];
	        m_Plugin.uninitialize();
	        m_Plugin = null;
	
	        if(eventHandler)
	        {
	            eventHandler();
	        }
	    }
	
	    function initialize(errorHandler)
	    {
	        cwic.Logger.info("System Initializing.");
	
	        var browserType = cwic.Utilities.getBrowserType();
	
	        switch(browserType)
	        {
	            case "Chrome":
	                m_Plugin = new cwic.ChromeExtension();
	                break;
	            case "Firefox":
	                if(cwic.Utilities.getBrowserVersion() >= 50)
	                {
	                    m_Plugin = new cwic.FirefoxExtension(m_ClientID);
	                }
	                else
	                {
	                    m_Plugin = new cwic.NPAPIPlugin(m_ClientID);
	                }
	                break;
	            case "Safari":
	                m_Plugin = new cwic.NPAPIPlugin(m_ClientID);
	                break;
	            case "InternetExplorer":
	                m_Plugin = new cwic.ActiveXControl(m_ClientID);
	                break;
	            default:
	                throw Error("Unsupported Browser");
	        }
	        cwic.Logger.info("Detected " + browserType + " browser.");
	
	        m_Plugin.onInitializeError = errorHandler;
	        m_Plugin.initialize();
	    }
	
	    /**
	     * @memberof SystemController
	     * @method getInstanceID
	     * @description
	     * Retrieve unique instance ID of CWIC library.
	     * @returns {String} Unique instance id.
	     * @since 11.7.0
	     */
	    this.getInstanceID = function ()
	    {
	        return m_ClientID;
	    };
	
	    /**
	     * @memberof SystemController
	     * @method getCapabilities
	     * @description
	     * Retrieve CWIC capability list.
	     * @returns {SystemControllerCapabilities}.
	     * @since 11.7.0
	     */
	    this.getCapabilities = function()
	    {
	        return m_Capabilities;
	    };
	
	    /**
	     * @memberof SystemController
	     * @method getVersion
	     * @description
	     * Retrieve CWIC library version.
	     *
	     * @returns {String}.
	     * @since 11.7.0
	     */
	    this.getVersion = function()
	    {
	        return m_Version;
	    };
	
	    /**
	     * @memberof SystemController
	     * @method setLoggingLevel
	     * @description
	     * Set new logging level. Possible Values:
	     * <br>
	     * <ul>
	     *     <li> 0 - Debug, this logging level is used for debugging purposes of JSDK team.
	     *     <li> 1 - Info, default value for log level. Logs main CWIC events.
	     *     <li> 2 - Warning, logs errors that are not critical (the ones that could be expected of improper use of API)
	     *     <li> 3 - Error, logs critical errors
	     * </ul>
	     *
	     * @param level {Number} - Logging level that will be set.
	     * @since 11.7.0
	     */
	    this.setLoggingLevel = function(level)
	    {
	        cwic.Logger.logLevel = level;
	    };
	
	    /**
	     * @memberof SystemController
	     * @method addEventHandler
	     * @description Add handler function for System Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     * @param handler {Function} - Function that will be called when event is fired.
	     *
	     * @since 11.7.0
	     */
	    this.addEventHandler = function(eventName, handlerFunction)
	    {
	        m_EventHandlers[eventName] = handlerFunction;
	    };
	
	    /**
	     * @memberof SystemController
	     * @method removeEventHandler
	     *
	     * @description Remove handler function for System Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     *
	     * @since 11.7.0
	     */
	    this.removeEventHandler = function(eventName)
	    {
	        delete m_EventHandlers[eventName];
	    };
	
	    /**
	     * @memberof SystemController
	     * @method initialize
	     *
	     * @description
	     * Initializes CWIC library. Initializes NPAPI Plugin (Internet Explorer, Safara, Mozzila Firefox) or Chrome Plugin
	     * (Google Chrome). In order to use any other API call from library CWIC needs to be initialized first.
	     *
	     * @throw Unsupported Browser - Thrown if initialize is called in unsupported browser.
	     *
	     * @since 11.7.0
	     */
	    this.initialize = function ()
	    {
	        if(document.hidden)
	        {
	            function onDocumentShown()
	            {
	                if(!document.hidden)
	                {
	                    initialize();
	                    document.removeEventListener('visibilitychange', onDocumentShown);
	                }
	            }
	
	            document.addEventListener('visibilitychange', onDocumentShown);
	        }
	        else
	        {
	            initialize(m_EventHandlers['onInitializationError']);
	        }
	    };
	}
	
	module.exports.SystemController = new SystemController();
	


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var ExtensionModule = __webpack_require__(29);
	var MessageSenderModule = __webpack_require__(7);
	var MessageReceiverModule = __webpack_require__(2);
	var LoggerModule = __webpack_require__(4);
	
	var cwic = {
	    Plugin : ExtensionModule.Plugin,
	    MessageSender : MessageSenderModule.MessageSender,
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    Logger : LoggerModule.Logger
	};
	
	function ChromeExtension()
	{
	    this.type = "ChromeExtension";
	}
	
	ChromeExtension.prototype = Object.create(cwic.Plugin.prototype);
	ChromeExtension.prototype.constructor = ChromeExtension;
	
	ChromeExtension.prototype.initialize = function()
	{
	    cwic.Logger.info('Initializing Chrome extension.');
	    var extension;
	    var extensionScript = document.createElement('script');
	  //  var extensionID     = "ppbllmlcmhfnfflbkbinnhacecaankdh";
		var extensionID     = "mbhnoblcplfcookpoennihpndjobapeo";
	  
	    extensionScript.id      = extensionID;
	    extensionScript.src     = 'chrome-extension://' + extensionID + '/cwic_plugin.js';
	    extensionScript.onload  = onExtensionLoaded.bind(this);
	    extensionScript.onerror = onExtensionError.bind(this);
	
	    document.head.appendChild(extensionScript);
	
	    function onExtensionLoaded()
	    {
	        cwic.Logger.info('Chrome extension has been initialized.');
	        var extension = cwic_plugin;
	
	        this.version = extension.version;
	        this.sendMessage = extension.sendRequest;
	
	        var settings = {
	            //cwicExtId: 'ppbllmlcmhfnfflbkbinnhacecaankdh',
				cwicExtId: 'mbhnoblcplfcookpoennihpndjobapeo',
	            verbose: true
	        };
	
	        cwic.MessageSender.plugin = this;
	        extension.init(this.onMessageReceived.bind(this), settings);
	    }
	
	    function onExtensionError()
	    {
	        cwic.Logger.error('Failed to load Chrome extension! Extension is not installed!');
	
	        if(this.onInitializeError)
	        {
	            //var url = 'https://chrome.google.com/webstore/detail/cisco-web-communicator/ppbllmlcmhfnfflbkbinnhacecaankdh';
				var url = 'https://chrome.google.com/webstore/detail/cisco-web-communicator/mbhnoblcplfcookpoennihpndjobapeo';
	
	            var errorInfo = {
	                errorType : "ChromeExtension",
	                errorData : {
	                    reason : "ExtensionNotInstalled",
	                    extensionURL : url
	                }
	            };
	
	            this.onInitializeError(errorInfo);
	        }
	    }
	};
	
	ChromeExtension.prototype.uninitialize = function()
	{
	    //var extensionID     = "ppbllmlcmhfnfflbkbinnhacecaankdh";
		var extensionID     = "mbhnoblcplfcookpoennihpndjobapeo";
	    var extensionScript = document.getElementById(extensionID);
	
	    extensionScript.parentNode.removeChild(extensionScript);
	    cwic.MessageSender.plugin = null;
	    cwic_plugin = null;
	};
	
	ChromeExtension.prototype.sendMessage = function(message)
	{
	    var extension = cwic_plugin;
	
	    cwic.Logger("Sending message: ", message);
	
	    extension.sendRequest(message);
	};
	
	ChromeExtension.prototype.onMessageReceived = function(message)
	{
	    cwic.MessageReceiver.onMessageReceived(message);
	};
	
	module.exports.ChromeExtension = ChromeExtension;


/***/ }),
/* 29 */
/***/ (function(module, exports) {

	function Plugin()
	{
	}
	
	Plugin.prototype.version = null;
	Plugin.prototype.sendMessage = null;
	Plugin.prototype.initialize = null;
	Plugin.prototype.type = "Unknown";
	Plugin.prototype.onInitializeError = null;
	
	
	module.exports.Plugin = Plugin;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var ExtensionModule = __webpack_require__(29);
	var MessageSenderModule = __webpack_require__(7);
	var MessageReceiverModule = __webpack_require__(2);
	var LoggerModule = __webpack_require__(4);
	
	var cwic = {
	    Plugin : ExtensionModule.Plugin,
	    MessageSender : MessageSenderModule.MessageSender,
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    Logger : LoggerModule.Logger
	};
	
	function FirefoxExtension(cwicID)
	{
	    this.type = "FirefoxExtension";
	    this.cwicID = cwicID;
	}
	
	FirefoxExtension.prototype = Object.create(cwic.Plugin.prototype);
	FirefoxExtension.prototype.constructor = FirefoxExtension;
	
	FirefoxExtension.prototype.isExtensionInstalled = function()
	{
	    var cwicEvent = null;
	    var extensionIsInstalled = false;
	
	    function extensionExistsCallback()
	    {
	        extensionIsInstalled = true;
	    }
	
	    window.addEventListener("cwic-extension-installed-response", extensionExistsCallback);
	
	    cwicEvent = new CustomEvent('cwic-extension-installed', {detail : ""});
	    window.dispatchEvent(cwicEvent);
	
	    window.removeEventListener("cwic-extension-installed-response", extensionExistsCallback);
	
	    return extensionIsInstalled;
	};
	
	FirefoxExtension.prototype.initialize = function()
	{
	    if(this.isExtensionInstalled())
	    {
	        window.addEventListener('cwic-addon-message', this.onMessageReceived.bind(this));
	        window.dispatchEvent(new CustomEvent('cwic-initialize', {detail : this.cwicID}));
	
	        cwic.Logger.info('Firefox extension has been initialized.');
	
	        cwic.MessageSender.plugin = this;
	        cwic.MessageSender.sendMessage('init', {});
	    }
	    else
	    {
	        cwic.Logger.error('Failed to load Firefox extension! Extension is not installed!');
	
	        if(this.onInitializeError)
	        {
	            var url = '';
	
	            var errorInfo = {
	                errorType : "FirefoxExtension",
	                errorData : {
	                    reason : "ExtensionNotInstalled",
	                    extensionURL : url
	                }
	            };
	
	            this.onInitializeError(errorInfo);
	        }
	    }
	};
	
	FirefoxExtension.prototype.sendMessage = function(message)
	{
	    message.client = {
	        'id': this.cwicID,
	        'url': window.location.href,
	        'hostname': window.location.hostname ? window.location.hostname : "file://",
	        'name': window.document.title
	    };
	
	    var cwicMessage = {
	        ciscoChannelMessage: message
	    };
	
	    var cwicMessageEvent = new CustomEvent('cwic-message', {detail : cwicMessage});
	    window.dispatchEvent(cwicMessageEvent);
	};
	
	FirefoxExtension.prototype.uninitialize = function()
	{
	};
	
	FirefoxExtension.prototype.onMessageReceived = function(message)
	{
	    //cwic.MessageReceiver.onMessageReceived(message.detail.ciscoChannelMessage);
	    cwic.MessageReceiver.onMessageReceived(message.detail.ciscoChannelMessage);
	};
	
	module.exports.FirefoxExtension = FirefoxExtension;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var ExtensionModule = __webpack_require__(29);
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule = __webpack_require__(7);
	var LoggerModule = __webpack_require__(4);
	
	var cwic = {
	    Plugin : ExtensionModule.Plugin,
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender : MessageSenderModule.MessageSender,
	    Logger : LoggerModule.Logger
	};
	
	function NPAPIPlugin(cwicID)
	{
	    this.type = "NPAPIPlugin";
	    this.cwicID = cwicID;
	}
	
	NPAPIPlugin.prototype = Object.create(cwic.Plugin.prototype);
	NPAPIPlugin.prototype.constructor = NPAPIPlugin;
	
	NPAPIPlugin.prototype.initialize = function()
	{
	    cwic.Logger.info('Initializing NPAPI plugin.');
	    var pluginName = 'application/x-ciscowebcommunicator';
	    var pluginMimeType = navigator.mimeTypes[pluginName];
	
	    if(!pluginMimeType)
	    {
	        cwic.Logger.error("Failed to load NPAPI Plugin.");
	
	        if(this.onInitializeError)
	        {
	            var errorInfo = {
	                errorType : "NPAPIPlugin",
	                errorData : {
	                    reason : "AddonNotInstalled"
	                }
	            };
	
	            this.onInitializeError(errorInfo);
	        }
	    }
	    else
	    {
	        cwic.Logger.info('NPAPI plugin has been initialized.');
	        var plugin = document.createElement('object');
	
	
	        plugin.id   = "cwic-plugin";
	        plugin.type = "application/x-ciscowebcommunicator";
	
	        document.body.appendChild(plugin);
	
	        plugin.addEventListener('addonmessage', this.onMessageReceived.bind(this), false);
	
	        plugin.setClientId(this.cwicID);
	        plugin.setUrl(window.location.href);
	        plugin.setHostName(window.location.hostname ? window.location.hostname : "file://");
	        plugin.setAppName(window.document.title);
	
	        cwic.MessageSender.plugin = this;
	        cwic.MessageSender.sendMessage('init', {});
	    }
	};
	
	NPAPIPlugin.prototype.uninitialize = function()
	{
	    var pluginID = "cwic-plugin";
	    var plugin   = document.getElementById(pluginID);
	
	    document.body.removeChild(plugin)
	    //plugin.parentNode.removeChild(plugin);
	    cwic.MessageSender.plugin = null;
	};
	
	NPAPIPlugin.prototype.sendMessage = function(message)
	{
	    var npapiPlugin = document.getElementById('cwic-plugin');
	
	    message.client = {
	        'id': this.cwicID,
	        'url': window.location.href,
	        'hostname': window.location.hostname ? window.location.hostname : "file://",
	        'name': window.document.title
	    };
	
	    var npapiPluginMessage = {
	        ciscoChannelMessage: message
	    };
	
	    npapiPlugin.postMessage(JSON.stringify(npapiPluginMessage));
	};
	
	NPAPIPlugin.prototype.onMessageReceived = function(message)
	{
	    try
	    {
	        var clientMessage = JSON.parse(message);
	    }
	    catch (exception)
	    {
	        cwic.Logger.error("Failed to parse message received from Add-on!");
	        return;
	    }
	    cwic.MessageReceiver.onMessageReceived(clientMessage.ciscoChannelMessage);
	};
	
	module.exports.NPAPIPlugin = NPAPIPlugin;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var ExtensionModule = __webpack_require__(29);
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule = __webpack_require__(7);
	var LoggerModule = __webpack_require__(4);
	
	var cwic = {
	    Plugin : ExtensionModule.Plugin,
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender : MessageSenderModule.MessageSender,
	    Logger : LoggerModule.Logger
	};
	
	function ActiveXControl(cwicID)
	{
	    this.type = "ActiveXControl";
	    this.cwicID = cwicID;
	}
	
	ActiveXControl.prototype = Object.create(cwic.Plugin.prototype);
	ActiveXControl.prototype.constructor = ActiveXControl;
	
	ActiveXControl.prototype.initialize = function()
	{
	    if ('ActiveXObject' in window)
	    {
	        cwic.Logger.info('Initializing ActiveX control.');
	        try
	        {
	            // Try to load the ActiveX Control, throws exception if it fails.
	            var dummyActiveXControl = new ActiveXObject('CiscoSystems.CWCVideoCall');
	
	            cwic.Logger.info('ActiveX control initialized.');
	
	            var plugin = document.createElement('object');
	
	            plugin.id   = "cwic-plugin";
	            plugin.type = "application/x-ciscowebcommunicator";
	
	            document.body.appendChild(plugin);
	
	            plugin.attachEvent('onaddonmessage', this.onMessageReceived.bind(this));
	
	            plugin.setClientId(this.cwicID);
	            plugin.setUrl(window.location.href);
	            plugin.setHostName(window.location.hostname ? window.location.hostname : "file://");
	            plugin.setAppName(window.document.title);
	
	            cwic.MessageSender.plugin = this;
	            cwic.MessageSender.pluginType = "ActiveXControl";
	            cwic.MessageSender.sendMessage('init', {});
	        }
	        catch (exception)
	        {
	            cwic.Logger.error("Failed to load ActiveX control");
	
	            if(this.onInitializeError)
	            {
	                var errorInfo = {
	                    errorType : "ActiveXControl",
	                    errorData : {
	                        reason : "AddonNotInstalled"
	                    }
	                };
	
	                this.onInitializeError(errorInfo);
	            }
	        }
	    }
	};
	
	ActiveXControl.prototype.uninitialize = function()
	{
	    var pluginID = "cwic-plugin";
	    var plugin   = document.getElementById(pluginID);
	
	    plugin.parentNode.removeChild(plugin);
	    cwic.MessageSender.plugin = null;
	};
	
	ActiveXControl.prototype.sendMessage = function(message)
	{
	    var activeXControl = document.getElementById('cwic-plugin');
	
	    message.client = {
	        'id': this.cwicID,
	        'url': window.location.href,
	        'hostname': window.location.hostname ? window.location.hostname : "file://",
	        'name': window.document.title
	    };
	
	    var activeXControlMessage = {
	        ciscoChannelMessage: message
	    };
	
	    activeXControl.postMessage(JSON.stringify(activeXControlMessage));
	};
	
	ActiveXControl.prototype.onMessageReceived = function(message)
	{
	    try
	    {
	        var clientMessage = JSON.parse(message);
	        cwic.MessageReceiver.onMessageReceived(clientMessage.ciscoChannelMessage);
	    }
	    catch (exception)
	    {
	        //Add error handlig logic here or log message.
	    }
	};
	
	module.exports.ActiveXControl = ActiveXControl;


/***/ }),
/* 33 */
/***/ (function(module, exports) {

	var version = "11.8.3.282316";
	
	function Version(versionString)
	{
	    var versionNumbers = versionString.split('.');
	
	    this.release = versionNumbers[0];
	    this.major = versionNumbers[1];
	    this.minor = versionNumbers[2];
	    this.build = versionNumbers[3];
	}
	
	Version.prototype.release = "";
	Version.prototype.major = "";
	Version.prototype.minor = "";
	Version.prototype.build = "";
	
	module.exports.cwicVersion = new Version(version);
	module.exports.Version = Version;
	


/***/ }),
/* 34 */
/***/ (function(module, exports) {

	/**
	 * @class SystemController
	 * @constructor
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function SystemControllerCapabilities(capabilites)
	{
	    this.inBrowserVideoSupport            = capabilites.videoPluginObject;
	    this.ringtoneOnAllRingersSupport      = capabilites.ringOnAllDevices;
	    this.ringtoneSupport                  = capabilites.ringtoneSelection;
	    this.nativeWindowDockingSupport       = capabilites.externalWindowDocking;
	    this.nativeWindowDockingTargetSupport = capabilites.showingDockingTarget;
	}
	
	/**
	 * @memberof SystemControllerCapabilities
	 * @member inBrowserVideoSupport
	 * @description
	 * Indicates whether in-browser video window support exists or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	SystemControllerCapabilities.prototype.inBrowserVideoSupport = false;
	
	/**
	 * @memberof SystemControllerCapabilities
	 * @member ringtoneOnAllRingersSupport
	 * @description
	 * Indicates whether ringtone can played on all ringtones or not.
	 *
	 * @since 11.7.0
	 */
	SystemControllerCapabilities.prototype.ringtoneOnAllRingersSupport = false;
	
	/**
	 * @memberof SystemControllerCapabilities
	 * @member ringtoneSupport
	 * @description
	 * Indicates whether ringtone support exists or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	SystemControllerCapabilities.prototype.ringtoneSupport = false;
	
	/**
	 * @memberof SystemControllerCapabilities
	 * @member nativeWindowDockingSupport
	 * @description
	 * Indicates whether native window can be docked or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	SystemControllerCapabilities.prototype.nativeWindowDockingSupport = false;
	
	/**
	 * @memberof SystemControllerCapabilities
	 * @member nativeWindowDockingTargetSupport
	 * @description
	 * Indicates whether docking target for native window exists or not.
	 *
	 * @type {boolean}
	 * @since 11.7.0
	 */
	SystemControllerCapabilities.prototype.nativeWindowDockingTargetSupport = false;
	
	module.exports.SystemControllerCapabilities = SystemControllerCapabilities;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var SystemControllerModule = __webpack_require__(27);
	var MessageSenderModule    = __webpack_require__(7);
	var MessageReceiverModule  = __webpack_require__(2);
	
	// Window Modules
	var NativePreviewWindowModule = __webpack_require__(36);
	var NativeScreenShareWindowModule = __webpack_require__(39);
	var NativeConversationWindowModule = __webpack_require__(40);
	var ScreenShareWindowModule = __webpack_require__(41);
	var ConversationWindowModule = __webpack_require__(43);
	var PreviewWindowModule = __webpack_require__(44);
	
	var cwic = {
	    MessageSender    : MessageSenderModule.MessageSender,
	    MessageReceiver  : MessageReceiverModule.MessageReceiver,
	    SystemController : SystemControllerModule.SystemController,
	
	    NativeScreenShareWindow  : NativeScreenShareWindowModule.NativeScreenShareWindow,
	    NativePreviewWindow : NativePreviewWindowModule.NativePreviewWindow,
	    NativeConversationWindow : NativeConversationWindowModule.NativeConversationWindow,
	
	    ScreenShareWindow  : ScreenShareWindowModule.ScreenShareWindow,
	    ConversationWindow : ConversationWindowModule.ConversationWindow,
	    PreviewWindow      : PreviewWindowModule.PreviewWindow
	
	};
	
	/**
	 * @class WindowController
	 * @classdesc
	 * WindowController is responsible for managing native and in-browser video windows.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function WindowController()
	{
	    var m_NativePreviewWindow = cwic.NativePreviewWindow;
	    var m_NativeScreenShareWindow  = cwic.NativeScreenShareWindow;
	    var m_NativeConversationWindow = cwic.NativeConversationWindow;
	
	    cwic.MessageReceiver.addMessageHandler('dockexternalwindowneeded', dockNeeded);
	
	    function dockNeeded(content)
	    {
	        var dockElement = null;
	        var dockElementDOMWindow = null;
	        var nativeWindow = null;
	        switch(content.windowType)
	        {
	            case "remote":
	                dockElement = m_NativeConversationWindow.dockElement;
	                dockElementDOMWindow = m_NativeConversationWindow.dockElementDOMWindow;
	                nativeWindow = m_NativeConversationWindow;
	                break;
	            case "preview":
	                dockElement = m_NativePreviewWindow.dockElement;
	                dockElementDOMWindow = m_NativePreviewWindow.dockElementDOMWindow;
	                nativeWindow = m_NativePreviewWindow;
	                break;
	            case "share":
	                dockElement = m_NativeScreenShareWindow.dockElement;
	                dockElementDOMWindow = m_NativeScreenShareWindow.dockElementDOMWindow;
	                nativeWindow = m_NativeScreenShareWindow;
	                break;
	        }
	
	        if(dockElement && dockElementDOMWindow)
	        {
	            nativeWindow.dock(dockElement, dockElementDOMWindow);
	        }
	    }
	
	    /**
	     * @memberof WindowController
	     * @method getNativePreviewWindow
	     * @description
	     * Retrieve native window that renders local camera feed.
	     *
	     * @returns {NativePreviewWindow}
	     * @since 11.7.0
	     */
	    this.getNativePreviewWindow = function()
	    {
	        return m_NativePreviewWindow;
	    };
	
	    /**
	     * @memberof WindowController
	     * @method getNativeScreenShareWindow
	     * @description
	     * Retrieve native window that renders screen share video.
	     *
	     * @returns {NativeScreenShareWindow}
	     * @since 11.7.0
	     */
	    this.getNativeScreenShareWindow = function()
	    {
	        return m_NativeScreenShareWindow;
	    };
	
	    /**
	     * @memberof WindowController
	     * @method getNativeConversationWindow
	     * @description
	     * Retrieve native window that renders conversation video.
	     *
	     * @returns {NativeConversationWindow}
	     * @since 11.7.0
	     */
	    this.getNativeConversationWindow = function()
	    {
	        return m_NativeConversationWindow;
	    };
	
	    /**
	     * @memberof WindowController
	     * @method createVideoWindow
	     * @description
	     * Create video window object. In order to create a video window object, HTML element that will
	     * serve as container must be specified. This HTML element can be a part of the same DOMWindow in which CWIC is
	     * initialized or it can be a separate child window or IFrame.
	     *
	     * @param windowType {WindowType} - Type of video window it will be created.
	     * @param htmlElement {HTMLElement} - HTML element that will represent window container.
	     * @param [DOMWindow] {Window} - DOM window that owns HTML element
	     * @returns {ScreenShareWindow | PreviewWindow | ConversationWindow}
	     *
	     * @since 11.7.0
	     *
	     * @throw Invalud Window Type - Thrown if windowType parameter is invalid.
	     */
	    this.createVideoWindow = function(windowType, htmlElement, DOMWindow)
	    {
	        var videoWindow;
	
	        switch(windowType)
	        {
	            case 'ScreenShare':
	                videoWindow = new cwic.ScreenShareWindow(htmlElement, DOMWindow);
	                break;
	            case 'Preview':
	                videoWindow = new cwic.PreviewWindow(htmlElement, DOMWindow);
	                break;
	            case 'Conversation':
	                videoWindow = new cwic.ConversationWindow(htmlElement, DOMWindow);
	                break;
	            default:
	                throw "Invalid Window Type";
	        }
	
	        return videoWindow;
	    }
	}
	
	module.exports.WindowController = new WindowController();

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var NativeVideoWindowModule = __webpack_require__(37);
	
	var cwic = {
	    NativeVideoWindow : NativeVideoWindowModule.NativeVideoWindow
	};
	
	/**
	 * @class NativePreviewWindow
	 * @extends  NativeVideoWindow
	 * @classdesc
	 * Represents native video window in which camera's feed video is rendered.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function NativePreviewWindow()
	{
	    cwic.NativeVideoWindow.call(this, 'preview');
	}
	
	NativePreviewWindow.prototype = Object.create(cwic.NativeVideoWindow.prototype);
	NativePreviewWindow.prototype.constructor = NativePreviewWindow();
	
	
	module.exports.NativePreviewWindow = new NativePreviewWindow();


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule    = __webpack_require__(7);
	var SystemControllerModule = __webpack_require__(27);
	
	// Window Modules
	var DockingWindowModule = __webpack_require__(38);
	
	var cwic = {
	    MessageSender    : MessageSenderModule.MessageSender,
	    SystemController : SystemControllerModule.SystemController,
	
	    PreviewDockingWindow     : DockingWindowModule.PreviewDockingWindow,
	    RemoteDockingWindow      : DockingWindowModule.RemoteDockingWindow,
	    ScreenShareDockingWindow : DockingWindowModule.ScreenShareDockingWindow
	};
	
	/**
	 * @class NativeVideoWindow
	 * @classdesc
	 * Native video window represents, native window in which video is rendered. Depending on the browser and operating
	 * system (OS) this window will have different capabilities.
	 * On Google Chrome NPAPI support has been dropped so communication between Cisco Web Communicator and CWIC API is being
	 * handled through Chromes's extensions. Chrome extension doesn't provide a way to render video from native application
	 * directly into browser's web application like NPAPI does. In order to overcome this issue Native Video Window can be
	 * docked/undocked to/from a specified HTML element that will act as a docking target in web browser application. This
	 * way we simulate behaviour as if native video window is part of a HTML document. There are specific limitations with
	 * this approach. Since native window acts as an overlay over specified HTML element, no child HTML elements will be
	 * visible.
	 *
	 * <br>
	 * @description
	 * On Mozzila Firefox, Internet Explorer and Safari u can use regular VideoWindow as NPAPI support for these brwosers
	 * still exits.
	 *
	 * @since 11.7.0
	 */
	function NativeVideoWindow(windowType)
	{
	    var m_Type = windowType;
	
	    this.dockElement = null;
	    this.dockElementDOMWindow = null;
	
	
	    function getDockingWindow()
	    {
	        var dockingWindow = null;
	        switch(m_Type)
	        {
	            case "preview":
	                dockingWindow = cwic.PreviewDockingWindow;
	                break;
	            case "remote":
	                dockingWindow = cwic.RemoteDockingWindow;
	                break;
	            case "share":
	                dockingWindow = cwic.ScreenShareDockingWindow;
	                break;
	        }
	
	        return dockingWindow;
	    }
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method hide
	     * @description
	     * Hide native video window.
	     *
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.hide = function(errorHandler)
	    {
	        var messageType = 'hideExternalWindow';
	        var messageData = {
	            windowType : m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method show
	     * @description
	     * Show native video window.
	     *
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.show = function(errorHandler)
	    {
	        var messageType;
	
	        if(m_Type === 'preview' || m_Type === 'share')
	        {
	            messageType = 'showPreviewInExternalWindow';
	        }
	        else
	        {
	            messageType = "showExternalWindow";
	        }
	
	        var messageData = {
	            windowType : m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method showAlwaysOnTop
	     * @description
	     * Set native video window to be shown always on top of Z-order.
	     *
	     * @param isAlwaysOnTop {Boolean}
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.showAlwaysOnTop = function(isAlwaysOnTop, errorHandler)
	    {
	        var messageType = 'setExternalWindowAlwaysOnTop';
	        var messageData = {
	            alwaysOnTop: isAlwaysOnTop,
	            windowType: m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method setTitle
	     * @description
	     * Set native video window's title.
	     *
	     * @param title {String} - Title that will be set
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     * @since 11.7.0
	     */
	    this.setTitle = function(title, errorHandler)
	    {
	        var messageType = 'setExternalWindowTitle';
	        var messageData = {
	            title : title,
	            windowType : m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method setDockTargetColor
	     * @description
	     * Set the color of docking target. MAC OS only.
	     *
	     * @param red {Number} - Value of the red color 0-255
	     * @param green {Number} - Value of the green color 0-255
	     * @param blue {Number} - Value of the blue color 0-255
	     *
	     * @since 11.7.0
	     * @note Depricated as of 11.8.0 - Calling this function will have no effect.
	     *
	     * @throw No Capability - Thrown if there is no support for docking targer color.
	     */
	    this.setDockTargetColor = function(red, green, blue)
	    {
	        if (!cwic.SystemController.getCapabilities().nativeWindowDockingSupport ||
	            !cwic.SystemController.getCapabilities().nativeWindowDockingTargetSupport)
	        {
	            throw Error("No capability");
	        }
	
	        var dockingWindow = getDockingWindow();
	        dockingWindow.setDockColor(red, green, blue);
	
	        var messageType = "setDockTargetColor";
	        var messageData = {
	            redValue: red,
	            greenValue: green,
	            blueValue: blue,
	            windowType: m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method dock
	     * @description
	     * Dock native video window to an HTML element of the specified DOM window.
	     *
	     * @param htmlElement {HTMLElement} - HTML element to which native video window will be docked
	     * @param DOMWindow {Window} - DOM window to which HTML Element belongs. If this parameter isn't specified
	     * current DOM window is used.
	     *
	     * @throws No Capability - Thrown if docking isn't supported.
	     * @throws Invalid HTML Element - Thrown if htmlElement parameter is not instance of HTMLElement.
	     *
	     * @since 11.7.0
	     */
	    this.dock = function(htmlElement, DOMWindow)
	    {
	        if (!cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
	        {
	            throw Error("No capability");
	        }
	
	        var frame = DOMWindow ? DOMWindow : window;
	
	        if(!(htmlElement instanceof frame.HTMLElement))
	        {
	            throw Error("Invalid HTML Element");
	        }
	
	        var dockingWindow = getDockingWindow();
	
	
	        dockingWindow.isDocked = true;
	
	        dockingWindow.externalWindowDocking = cwic.SystemController.getCapabilities().nativeWindowDockingSupport;
	        dockingWindow.showingDockingTarget = cwic.SystemController.getCapabilities().nativeWindowDockingTargetSupport;
	
	        dockingWindow.frame = frame;
	        dockingWindow.element = htmlElement;
	
	        this.dockElement = htmlElement;
	        this.dockElementDOMWindow = frame;
	
	        var position = dockingWindow.calculateNewPosition();
	        dockingWindow.sendMessageToAddOn("dockExternalWindow", position, windowType);
	        dockingWindow.updatePosition();
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method undock
	     * @description
	     * Undock native video window from HTML element.
	     *
	     * @throws No Capability - Thrown if docking isn't supported.
	     * @since 11.7.0
	     *
	     * @throw No Capability - Thrown if docking isn't supported.
	     */
	    this.undock = function()
	    {
	        if (!cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
	        {
	            throw Error("No Capability");
	        }
	
	        var dockingWindow = getDockingWindow();
	
	        //dockingWindow.hideDockingTarget();
	        dockingWindow.isDocked = false;
	
	        this.dockElement = null;
	        this.dockElementDOMWindow = null;
	
	        var messageType = 'undockExternalWindow';
	        var messageData = {
	            windowType: windowType
	        };
	
	        cwic.MessageSender.sendMessage(messageType, messageData);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method showControls
	     * @description
	     * Shows native video window controls.
	     *
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     */
	    this.showControls = function(errorHandler)
	    {
	        var messageType = 'setExternalWindowShowControls';
	        var messageData = {
	            showControls : true,
	            windowType : m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType,messageData, errorHandler);
	    };
	
	    /**
	     * @memberof NativeVideoWindow
	     * @method hideControls
	     * @description
	     * Hides native video window controls.
	     *
	     * @param [errorHandler]{Function} - Called if error has occurred in add-on.
	     */
	    this.hideControls = function(errorHandler)
	    {
	        var messageType = 'setExternalWindowShowControls';
	        var messageData = {
	            showControls : false,
	            windowType : m_Type
	        };
	
	        cwic.MessageSender.sendMessage(messageType,messageData, errorHandler);
	    };
	}
	
	module.exports.NativeVideoWindow = NativeVideoWindow;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageSenderModule = __webpack_require__(7);
	var SystemControllerModule = __webpack_require__(27);
	var UtilitiesModule = __webpack_require__(5);
	
	var cwic = {
	    MessageSender : MessageSenderModule.MessageSender,
	    SystemController : SystemControllerModule.SystemController
	};
	
	
	function WindowPosition()
	{
	    this.top         = 0;
	    this.left        = 0;
	    this.height      = 0;
	    this.width       = 0;
	    this.cropTop     = 0;
	    this.cropLeft    = 0;
	    this.cropBottom  = 0;
	    this.cropRight   = 0;
	    this.cropHeight  = 0;
	    this.cropWidth   = 0;
	    this.scaleFactor = 1;
	}
	
	function DockingWindow(windowType)
	{
	    this.type     = windowType;
	    this.isDocked = true;
	    this.isVideoBeingReceived = false;
	    this.frame    = window;
	    this.element  = null;
	    this.position = new WindowPosition();
	
	    this.externalWindowDocking = false;
	    this.showingDockingTarget   = false;
	    this.scaleFactor = 1;
	
	    this.setDockColor = function(red, green, blue)
	    {
	        if(arguments.length !== 3)
	        {
	            throw "Invalid number of arguments for color object";
	        }
	    };
	
	
	    this.isPositionChanged = function(newPosition)
	    {
	        var positionChanged = !(
	            this.position.top        === newPosition.top &&
	            this.position.left       === newPosition.left &&
	            this.position.height     === newPosition.height &&
	            this.position.width      === newPosition.width &&
	            this.position.cropTop    === newPosition.cropTop &&
	            this.position.cropLeft   === newPosition.cropLeft &&
	            this.position.cropHeight === newPosition.cropHeight &&
	            this.position.cropWidth  === newPosition.cropWidth &&
	            this.position.scaleFactor === newPosition.scaleFactor
	        );
	
	        return positionChanged;
	    };
	
	    this.updatePosition = function ()
	    {
	        if (this.isDocked)
	        {
	            var newPosition = this.calculateNewPosition();
	
	            if(this.isPositionChanged(newPosition))
	            {
	                this.sendMessageToAddOn("dockUpdate", newPosition, this.type);
	                this.position = newPosition;
	            }
	
	            window.setTimeout(this.updatePosition.bind(this), 10);
	        }
	    };
	
	    this.calculateNewPosition = function()
	    {
	        var elementRectangle = this.element.getBoundingClientRect();
	        var currentFrame = this.frame,
	            currentFrameHeight = currentFrame.innerHeight,
	            currentFrameWidth = currentFrame.innerWidth,
	            currentFrameRect,
	            parentFrameWidth,
	            parentFrameHeight,
	            frameBorderOffset = 0,
	            borderTopOffset = 0,
	            borderLeftOffset = 0,
	            paddingTopOffset = 0,
	            paddingLeftOffset = 0;
	
	        var position = new WindowPosition();
	        position.left = elementRectangle.left;
	        position.top = elementRectangle.top;
	        position.width = elementRectangle.width;
	        position.height = elementRectangle.height;
	        position.bottom = elementRectangle.bottom;
	        position.right = elementRectangle.right;
	
	        // we need to take into account the devicePixelRatio and the CSS zoom property
	        // it won't work if css zoom is set on some of parent elements
	        var scaleFactor = currentFrame.devicePixelRatio;
	
	        var scrollX = 0;
	        var scrollY = 0;
	
	        if (('ontouchstart' in window) && (navigator.maxTouchPoints > 1))
	        {
	
	            //running on touch-capable device
	            var inner = currentFrame.innerWidth;
	            var hasScrollbar = inner - currentFrame.document.documentElement.clientWidth;
	            this.lastZoomFactor = this.lastZoomFactor || 1;
	
	            // scrollbar width changes when zooming, we need to calculate it for each scale level
	            // on pinch zoom, hasScrollbar very quickly goes below zero, and we should skip that case (no scrollbars on pinch-zoom)
	            // ...basically just an aproximation which works currentlly
	            if (hasScrollbar > 0 || UtilitiesModule.Utilities.getOSType() == "Windows 10" ) {
	                inner -= hasScrollbar;
	            } else {
	                var scrollBarWidth = 21;
	                inner -= (scrollBarWidth / this.lastZoomFactor);
	            }
	
	            var pinchZoomCoefficient = currentFrame.document.documentElement.clientWidth / inner;
	
	            scaleFactor *= pinchZoomCoefficient;
	            this.lastZoomFactor = scaleFactor;
	
	            var scrollSizeX = currentFrame.document.body.clientWidth - currentFrame.innerWidth;
	            var scrollSizeY = currentFrame.document.body.clientHeight - currentFrame.innerHeight;
	
	            if (pinchZoomCoefficient > 1.01) {
	                scrollX = currentFrame.scrollX;
	                scrollY = currentFrame.scrollY;
	
	                // this is complex logic dealing with case when the page (pinchZoom=0) has scrollbars
	                // In that case, when the page is pinche-zoomed, scrollX and scrollY are no longer accurate in providing position of docking container
	                var diffY = scrollSizeY - scrollY;
	
	                // while diff is >0, position.top represent accurate top position
	                // when it goes below 0 (meaning that "original" scrollbar hit the end), position.top gets stuck and then diff value represent how much container is moved
	                if (diffY >= 0) {
	                    scrollY = 0;
	                } else {
	                    scrollY = Math.abs(diffY);
	                }
	
	                var diffX = scrollSizeX - scrollX;
	
	                if (diffX >= 0) {
	                    scrollX = 0;
	                } else {
	                    scrollX = Math.abs(diffX);
	                }
	
	                if (diffY >= 0) {
	                    this.initPosY = position.top + currentFrame.scrollY;
	                }
	
	                if (
	                    position.top > this.initPosY - scrollSizeY &&
	                    diffY < 0
	                ) {
	                    position.top = this.initPosY - scrollSizeY;
	                }
	
	                if (diffX >= 0) {
	                    this.initPosX = position.left + currentFrame.scrollX;
	                }
	
	                if (
	                    position.left > this.initPosX - scrollSizeX &&
	                    diffX < 0
	                ) {
	                    position.left = this.initPosX - scrollSizeX;
	                }
	            }
	
	        }
	
	        position.left -= scrollX;
	        position.top -= scrollY;
	
	        // calculating crop values for innermost iframe
	        position.cropTop  = (position.top < 0) ? Math.abs(position.top) : 0;
	        position.cropLeft = (position.left < 0) ? Math.abs(position.left) : 0;
	        position.cropBottom = Math.max(position.bottom - currentFrameHeight, 0);
	        position.cropRight  = Math.max(position.right - currentFrameWidth, 0);
	
	        while (currentFrame != currentFrame.top)
	        {
	            currentFrameRect = currentFrame.frameElement.getBoundingClientRect();
	            parentFrameWidth = currentFrame.parent.innerWidth;
	            parentFrameHeight = currentFrame.parent.innerHeight;
	
	            // !! converts to boolean: 0 and NaN map to false, the rest of the numbers map to true
	            if (currentFrame.frameElement.frameBorder === "" || !!parseInt(currentFrame.frameElement.frameBorder, 10))
	            {
	                // after testing on Chrome, whenever a frameBorder is present, it's size is 2px
	                frameBorderOffset = 2;
	            }
	            else
	            {
	                frameBorderOffset = 0;
	            }
	
	            if (currentFrame.frameElement.style.borderTopWidth === "")
	            {
	                borderTopOffset = frameBorderOffset;
	            }
	            else
	            {
	                borderTopOffset = parseInt(currentFrame.frameElement.style.borderTopWidth || 0, 10);
	            }
	
	            // take into account parent frame's offset first
	            var outerFrame = window.frameElement;
	            var framePaddingLeftOffset = 0;
	            var framePaddingTopOffset = 0;
	            if (outerFrame != null)
	            {
	                var outerFrameStyle = window.getComputedStyle(outerFrame,null);
	                if (outerFrameStyle != null)
	                {
	                    framePaddingLeftOffset += parseInt(outerFrameStyle.getPropertyValue("padding-left") || 0, 10);
	                    framePaddingTopOffset += parseInt(outerFrameStyle.getPropertyValue("padding-top") || 0, 10);
	                } 
	            }    
	
	            paddingTopOffset = framePaddingTopOffset;
	
	            if (currentFrameRect.top < 0)
	            {
	                if (position.top + position.cropTop < 0)
	                {
	                    position.cropTop += Math.abs(currentFrameRect.top);
	                }
	                else if (Math.abs(currentFrameRect.top) - (position.top + position.cropTop + borderTopOffset + paddingTopOffset) > 0)
	                {
	                    position.cropTop += Math.abs(Math.abs(currentFrameRect.top) - (position.top + position.cropTop + borderTopOffset + paddingTopOffset));
	                }
	            }
	
	            if (currentFrameRect.top + borderTopOffset + paddingTopOffset + position.top + position.height - position.cropBottom > parentFrameHeight)
	            {
	                position.cropBottom = currentFrameRect.top + borderTopOffset + paddingTopOffset + position.top + position.height - parentFrameHeight;
	            }
	
	            position.top += currentFrameRect.top + borderTopOffset + paddingTopOffset;
	
	            if (currentFrame.frameElement.style.borderLeftWidth === "")
	            {
	                borderLeftOffset = frameBorderOffset;
	            }
	            else
	            {
	                borderLeftOffset = parseInt(currentFrame.frameElement.style.borderLeftWidth || 0, 10);
	            }
	
	            paddingLeftOffset = framePaddingLeftOffset;
	
	            if (currentFrameRect.left < 0)
	            {
	                if (position.left + position.cropLeft < 0)
	                {
	                    position.cropLeft += Math.abs(currentFrameRect.left);
	                }
	                else if (Math.abs(currentFrameRect.left) - (position.left + position.cropLeft + borderLeftOffset + paddingLeftOffset) > 0)
	                {
	                    position.cropLeft += Math.abs(Math.abs(currentFrameRect.left) - (position.left + position.cropLeft + borderLeftOffset + paddingLeftOffset));
	                }
	            }
	
	            if (currentFrameRect.left + borderLeftOffset + paddingLeftOffset + position.left + position.width - position.cropRight > parentFrameWidth)
	            {
	                position.cropRight = currentFrameRect.left + borderLeftOffset + paddingLeftOffset + position.left + position.width - parentFrameWidth;
	            }
	
	            position.left += currentFrameRect.left + borderLeftOffset + paddingLeftOffset;
	            currentFrame = currentFrame.parent;
	        }
	
	
	        position.cropLeft = (position.width > position.cropLeft) ? position.cropLeft : position.width;
	        position.cropTop  = (position.height > position.cropTop) ? position.cropTop : position.height;
	        position.cropWidth  = Math.max(position.width - (position.cropLeft + position.cropRight), 0);
	        position.cropHeight = Math.max(position.height - (position.cropTop + position.cropBottom), 0);
	
	        position.left        = Math.round(position.left);
	        position.top         = Math.round(position.top);// + offsetTop;
	        position.width       = Math.round(position.width);
	        position.height      = Math.round(position.height);
	        position.cropleft    = Math.round(position.cropLeft);
	        position.cropTop     = Math.round(position.cropTop);
	        position.cropWidth   = Math.round(position.cropWidth);
	        position.cropHeight  = Math.round(position.cropHeight);
	
	        position.scaleFactor = scaleFactor;
	
	        if(UtilitiesModule.Utilities.getBrowserType() == "Firefox" && cwic.SystemController.platformOS == "windows")
	        {
	            position.top += Math.ceil(window.top.mozInnerScreenY);
	            position.left += Math.ceil(window.top.mozInnerScreenX);
	        }
	
	        position.browserHeight = window.outerHeight;
	        position.browserWidth  = window.outerWidth;
	        position.viewPortHeight = window.top.innerHeight;
	        position.viewPortWidth  = window.top.innerWidth;
	
	
	        return position;
	    };
	
	    this.sendMessageToAddOn = function (msgName, position, windowType)
	    {
	        var addOnMessageContent =
	        {
	            offsetX: position.left,
	            offsetY: position.top,
	            width: position.width,
	            height: position.height,
	            cropOffsetX: position.cropLeft,
	            cropOffsetY: position.cropTop,
	            cropWidth: position.cropWidth,
	            cropHeight: position.cropHeight,
	            scaleFactor: position.scaleFactor,
	            windowType: windowType,
	            browserHeight: position.browserHeight,
	            browserWidth: position.browserWidth,
	            viewPortHeight : position.viewPortHeight,
	            viewPortWidth : position.viewPortWidth
	        };
	
	        if (msgName === "dockExternalWindow")
	        {
	            addOnMessageContent.title = this.frame.top.document.title ||
	                (this.frame.top.location.host + this.frame.top.location.pathname + this.frame.top.location.search);
	        }
	
	
	        cwic.MessageSender.sendMessage(msgName, addOnMessageContent);
	    };
	
	    this.hasDockingCapabilities = function ()
	    {
	        var caps;
	        try
	        {
	            caps = cwic.SystemController.getCapabilities().nativeWindowDockingSupport;
	        }
	        catch (e)
	        {
	            caps = null;
	        }
	
	        return caps;
	    };
	}
	
	module.exports.PreviewDockingWindow      = new DockingWindow("preview");
	module.exports.RemoteDockingWindow       = new DockingWindow("remote");
	module.exports.ScreenShareDockingWindow  = new DockingWindow("share");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var NativeVideoWindowModule = __webpack_require__(37);
	
	var cwic = {
	    NativeVideoWindow : NativeVideoWindowModule.NativeVideoWindow
	};
	
	/**
	 * @class NativeScreenShareWindow
	 * @extends  NativeVideoWindow
	 * @classdesc
	 * Represents native video window in which screen share video is rendered.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function NativeScreenShareWindow()
	{
	    cwic.NativeVideoWindow.call(this, 'share');
	}
	
	NativeScreenShareWindow.prototype = Object.create(cwic.NativeVideoWindow.prototype);
	NativeScreenShareWindow.prototype.constructor = NativeScreenShareWindow();
	
	
	module.exports.NativeScreenShareWindow = new NativeScreenShareWindow();


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	// Required Modules
	var NativeVideoWindowModule = __webpack_require__(37);
	var MessageSenderModule     = __webpack_require__(7);
	
	var cwic = {
	    NativeVideoWindow : NativeVideoWindowModule.NativeVideoWindow,
	    MessageSender     : MessageSenderModule.MessageSender
	};
	
	/**
	 * @class NativeConversationWindow
	 * @extends  NativeVideoWindow
	 * @classdesc
	 * Represents native video window in which telephony conversation video is rendered.
	 *
	 * @description
	 * This class cannot be instantiated.
	 *
	 * @since 11.7.0
	 */
	function NativeConversationWindow()
	{
	    cwic.NativeVideoWindow.call(this, 'remote');
	}
	
	NativeConversationWindow.prototype = Object.create(cwic.NativeVideoWindow.prototype);
	NativeConversationWindow.prototype.constructor = new NativeConversationWindow();
	
	
	/**
	 * @memberof NativeConversationWindow
	 * @method showVideoForConversation
	 * @description
	 * Show video for given telephony conversation.
	 *
	 * @param conversation {TelephonyConversation} - Telephony conversation for which video will be rendered.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.showVideoForConversation = function(conversation, errorHandler)
	{
	    var messageType = 'showCallInExternalWindow';
	    var messageData = {
	        callId: conversation.ID
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof NativeConversationWindow
	 * @method showSelfView
	 * @description
	 * Show self-view video.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.showSelfView = function(errorHandler)
	{
	    var messageType = 'setExternalWindowShowSelfViewPip';
	    var messageData = {
	        showSelfViewPip: 'true'
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof NativeConversationWindow
	 * @method hideSelfView
	 * @description
	 * Hide self-view video.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.hideSelfView = function(errorHandler)
	{
	    var messageType = 'setExternalWindowShowSelfViewPip';
	    var messageData = {
	        showSelfViewPip: false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof NativeConversationWindow
	 * @method showSelfViewBorder
	 * @description
	 * Show border for self-view video.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.showSelfViewBorder = function(errorHandler)
	{
	    var messageType = 'setExternalWindowShowSelfViewPipBorder';
	    var messageData = {
	        showSelfViewPipBorder: true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof NativeConversationWindow
	 * @method hideSelfViewBorder
	 * @description
	 * Hide border for self-view video.
	 *
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.hideSelfViewBorder = function(errorHandler)
	{
	    var messageType = 'setExternalWindowShowSelfViewPipBorder';
	    var messageData = {
	        showSelfViewPipBorder: false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof NativeConversationWindow
	 * @method setSelfViewPosition
	 * @description
	 * Set position of self-view video relative to conversation window.
	 *
	 * @param left {Number} - Distance from left edge of window in percentages.
	 * @param top {Number} - Distance from top edge of window in percentages.
	 * @param right {Number} - Distance from right edge of window in percentages.
	 * @param bottom {Number} - Distance from bottom edge of window in percentages.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @since 11.7.0
	 */
	NativeConversationWindow.prototype.setSelfViewPosition = function(left, top, right, bottom, errorHandler)
	{
	    var messageType = 'setExternalWindowSelfViewPipPosition';
	    var messageData = {
	        pipLeft  : left,
	        pipTop   : top,
	        pipRight : right,
	        pipBottom: bottom
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	module.exports.NativeConversationWindow = new NativeConversationWindow();


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	// Window Modules
	var VideoWindowModule = __webpack_require__(42);
	
	// Telephony Modules
	var TelephonyConversationModule = __webpack_require__(18);
	
	
	var cwic = {
	    VideoWindow : VideoWindowModule.VideoWindow,
	    TelephonyConversation : TelephonyConversationModule.TelephonyConversation
	};
	
	/**
	 * @class ScreenShareWindow
	 * @classdesc
	 * In-browser video window in which incoming screen share for specified {@link TelephonyConversation} is rendered.
	 *
	 * @description
	 * It is instantiated through [WindowController.createVideoWindow()]{@link WindowController.createVideoWindow}.
	 * @since 11.7.0
	 */
	function ScreenShareWindow(htmlElement, DOMWindow)
	{
	    var m_VideoWindow = new cwic.VideoWindow(htmlElement, DOMWindow);
	
	    /**
	     * @memberof ScreenShareWindow
	     * @method showForConversation
	     * @description
	     * Start rendering screen share video for specified conversation.
	     *
	     * @param conversation {TelephonyConversation} - Telephony conversation for which video rendering will start.
	     * @since 11.7.0
	     */
	    this.showForConversation = function(conversation)
	    {
	        var methodName = 'addShareWindow';
	
	        m_VideoWindow.element.style.width  = "100%";
	        m_VideoWindow.element.style.height = "100%";
	        m_VideoWindow.executeMethod(methodName, conversation.ID);
	    };
	
	    /**
	     * @memberof ScreenShareWindow
	     * @method hidForConversation
	     * @description
	     * Stop rendering screen share video for specified conversation.
	     *
	     * @param conversation {TelephonyConversation} - Telephony conversation for which video rendering will stop.
	     * @since 11.7.0
	     */
	    this.hideForConversation = function(conversation)
	    {
	        var methodName = 'removeShareWindow';
	
	        m_VideoWindow.element.style.width  = "0%";
	        m_VideoWindow.element.style.height = "0%";
	        m_VideoWindow.executeMethod(methodName, conversation.ID);
	    };
	}
	
	module.exports.ScreenShareWindow = ScreenShareWindow;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var SystemControllerModule = __webpack_require__(27);
	var UtilitiesModule = __webpack_require__(5);
	//// Utilities Modules
	//var generateUniqueID = require('../utils/generateUniqueId');
	
	var cwic = {
	    SystemController : SystemControllerModule.SystemController,
	    Utilities : UtilitiesModule.Utilities
	};
	
	/**
	 * @class VideoWindow
	 * @classdesc
	 * Video window represents window in which video will be rendered. This class can only be used in following Browsers:
	 * <br>
	 * <ul>
	 *     <li> Mozzile Firefox
	 *     <li> Internet Explorer
	 *     <li> Safari
	 * </ul>
	 * <br>
	 *
	 * @param htmlElement {HTMLElement} - Element in which video will be rendered.
	 * @param [DOMWindow] {Window} - DOM window that is a parent of HTML element.
	 *
	 * @throw Invalid HTML Type - Thrown if HTML element is invalid.
	 * @throw Element Requires ID - Thrown if HTML element doesn't have ID.
	 */
	function VideoWindow(htmlElement, DOMWindow)
	{
	    var domWindow = DOMWindow ? DOMWindow : window;
	
	    if(!(htmlElement instanceof domWindow.HTMLElement))
	    {
	        throw Error("Invalid HTML Type");
	    }
	
	    if(!htmlElement.id)
	    {
	        throw Error("Element Requires ID");
	    }
	
	    var videoWindow = domWindow.document.createElement("object");
	    videoWindow.type = 'application/x-cisco-cwc-videocall';
	    videoWindow.id   = 'videoWindow-' + htmlElement.id + cwic.Utilities.generateUniqueId();
	    videoWindow.style.width  = "0%";
	    videoWindow.style.height = "0%";
	
	    htmlElement.appendChild(videoWindow);
	    
	    this.element = videoWindow;
	
	    this.executeMethod = function(methodName, callID)
	    {
	        var clientID  = cwic.SystemController.getInstanceID();
	        var messageID = cwic.Utilities.generateUniqueId();
	        var url       = window.location.href;
	        var hostname  = window.location.hostname;
	        var name      = window.document.title;
	
	        var messageParameters = [messageID, clientID, url, hostname, name];
	
	        if(callID)
	        {
	            messageParameters.unshift(callID);
	        }
	
	        videoWindow[methodName].apply(this, messageParameters);
	    };
	
	    this.executeMethod('configure');
	}
	
	module.exports.VideoWindow = VideoWindow;
	
	


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	// Window Modules
	var VideoWindowModule = __webpack_require__(42);
	
	// Telephony Modules
	var TelephonyConversationModule = __webpack_require__(18);
	
	
	var cwic = {
	    VideoWindow : VideoWindowModule.VideoWindow,
	    TelephonyConversation : TelephonyConversationModule.TelephonyConversation
	};
	
	/**
	 * @class ConversationWindow
	 * @classdesc
	 * In-browser video window in which [Telephony Conversation's]{@link TelephonyConversation} conversation video
	 * (incoming video from remote participant) is rendered.
	 *
	 * @description
	 * It is instantiated through [WindowController.createVideoWindow()]{@link WindowController.createVideoWindow}.
	 * @since 11.7.0
	 */
	function ConversationWindow(htmlElement, DOMWindow)
	{
	    var m_VideoWindow = new cwic.VideoWindow(htmlElement, DOMWindow);
	
	    /**
	     * @memberof ConversationWindow
	     * @method showForConversation
	     * @description
	     * Start rendering video for specified conversation.
	     *
	     * @param conversation {TelephonyConversation} - Telephony conversation for which video rendering will start.
	     * @since 11.7.0
	     */
	    this.showForConversation = function(conversation)
	    {
	        var methodName = 'addWindowToCall';
	
	        m_VideoWindow.element.style.width  = "100%";
	        m_VideoWindow.element.style.height = "100%";
	        m_VideoWindow.executeMethod(methodName, conversation.ID);
	
	        var methodName = 'startRemoteVideo';
	        
	        m_VideoWindow.executeMethod(methodName, conversation.ID);
	    };
	
	    /**
	     * @memberof ConversationWindow
	     * @method hideForConversation
	     * @description
	     * Stop rendering video for specified conversation.
	     *
	     * @param conversation {TelephonyConversation} - Telephony conversation for which video rendering will stop.
	     * @since 11.7.0
	     */
	    this.hideForConversation = function(conversation)
	    {
	        var methodName = 'removeWindowFromCall';
	
	        m_VideoWindow.element.style.width  = "0%";
	        m_VideoWindow.element.style.height = "0%";
	        m_VideoWindow.executeMethod(methodName, conversation.ID);
	    };
	}
	
	module.exports.ConversationWindow = ConversationWindow;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	// Window Modules
	var VideoWindowModule = __webpack_require__(42);
	
	var cwic = {
	    VideoWindow: VideoWindowModule.VideoWindow
	};
	
	/**
	 * @class PreviewWindow
	 * @classdesc
	 * In-browser video window in which local camera feed is rendered.
	 *
	 * @description
	 * It is instantiated through [WindowController.createVideoWindow()]{@link WindowController.createVideoWindow}.
	 * @since 11.7.0
	 */
	function PreviewWindow(htmlElement, DOMWindow)
	{
	    var m_VideoWindow = new cwic.VideoWindow(htmlElement, DOMWindow);
	
	    /**
	     * @memberof PreviewWindow
	     * @method show
	     * @description
	     * Show preview video window. Once shown, local camera feed will start being rendered.
	     *
	     * @since 11.7.0
	     */
	    this.show = function()
	    {
	        var methodName = 'addPreviewWindow';
	
	        m_VideoWindow.element.style.width  = "100%";
	        m_VideoWindow.element.style.height = "100%";
	        m_VideoWindow.executeMethod(methodName);
	    };
	
	    /**
	     * @memberof PreviewWindow
	     * @method hide
	     * @description
	     * Hide preview video window. Once hidden, local camera feed will stop being rendered.
	     *
	     * @since 11.7.0
	     */
	    this.hide = function()
	    {
	        var methodName = 'removePreviewWindow';
	
	        m_VideoWindow.element.style.width  = "0%";
	        m_VideoWindow.element.style.height = "0%";
	        m_VideoWindow.executeMethod(methodName);
	    };
	}
	
	module.exports.PreviewWindow = PreviewWindow;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// System Modules
	var MessageReceiverModule = __webpack_require__(2);
	var MessageSenderModule   = __webpack_require__(7);
	
	// Certificate Modules
	var InvalidCertificateModule = __webpack_require__(46);
	
	var cwic = {
	    MessageReceiver : MessageReceiverModule.MessageReceiver,
	    MessageSender   : MessageSenderModule.MessageSender,
	    InvalidCertificate : InvalidCertificateModule.InvalidCertificate
	};
	
	/**
	 * @class CertificateController
	 * @classdesc
	 * Certificate controller is responsible for handling invalid certificates.
	 *
	 * @description This class cannot be instantiated.
	 * @since 11.7.0
	 */
	function CertificateController()
	{
	    var m_EventHandlers = {};
	
	    cwic.MessageReceiver.addMessageHandler('invalidcertificate', onInvalidCertificate)
	
	    function onInvalidCertificate(content)
	    {
	        var eventHandler = m_EventHandlers['onInvalidCertificate'];
	        if(eventHandler)
	        {
	            var invalidCertificate = new cwic.InvalidCertificate(content);
	
	            var reasons = [];
	            for(var index = 0; index<content.invalidReasons.length; index++)
	            {
	                reasons.push(content.invalidReasons[index].invalidReason);
	            }
	
	            eventHandler(invalidCertificate, reasons, content.allowUserToAccept);
	        }
	    }
	
	    /**
	     * @memberof CertificateController
	     * @method addEventHandler
	     * @description Add handler function for Certificate Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     * @param handler {Function} - Function that will be called when event is fired.
	     *
	     * @since 11.7.0
	     */
	    this.addEventHandler = function(eventName, eventHandler)
	    {
	        m_EventHandlers[eventName] = eventHandler;
	    };
	
	    /**
	     * @memberof CertificateController
	     * @method removeEventHandler
	     * @description Remove handler function for Certificate Controller's event.
	     *
	     * @param eventName {String} - Name of the event.
	     *
	     * @since 11.7.0
	     */
	    this.removeEventHandler = function(eventName)
	    {
	        delete m_EventHandlers[eventName];
	    };
	}
	
	/**
	 * @memberof CertificateController
	 * @method acceptInvalidCertificate
	 * @description
	 * Accepts invalid certificate. Invalid certificate can be obtained through "onInvalidCertificate" event.
	 *
	 * @param certificate {InvalidCertificate} - Invalid certificate to be accepted.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if certificate is not instance of {@link InvalidCertificate}.
	 *
	 * @since 11.7.0
	 */
	CertificateController.prototype.acceptInvalidCertificate = function (certificate, errorHandler)
	{
	    if(!(certificate instanceof cwic.InvalidCertificate))
	    {
	        throw Error("Invalid Object");
	    }
	
	    var messageType = 'handleInvalidCertificate';
	    var messageData = {
	        certFingerprint: certificate.fingerprint,
	        accept : true
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	/**
	 * @memberof CertificateController
	 * @method rejectInvalidCertificate
	 * @description
	 * Rejects invalid certificate. Invalid certificate can be obtained through "onInvalidCertificate" event.
	 *
	 * @param certificate {InvalidCertificate} - Invalid certificate to be accepted.
	 * @param [errorHandler] {Function} - Called if error has occurred in add-on.
	 *
	 * @throw Invalid Object - Thrown if certificate is not instance of {@link InvalidCertificate}.
	 *
	 * @since 11.7.0
	 */
	CertificateController.prototype.rejectInvalidCertificate = function (certificate, errorHandler)
	{
	    if(!(certificate instanceof cwic.InvalidCertificate))
	    {
	        throw Error("Invalid Type");
	    }
	
	    var messageType = 'handleInvalidCertificate';
	    var messageData = {
	        certFingerprint: certificate.fingerprint,
	        accept : false
	    };
	
	    cwic.MessageSender.sendMessage(messageType, messageData, errorHandler);
	};
	
	module.exports.CertificateController = new CertificateController();
	
	


/***/ }),
/* 46 */
/***/ (function(module, exports) {

	/**
	 * @class InvalidCertificate
	 *
	 * Invalid Certificate
	 */
	function InvalidCertificate(data)
	{
	    this.subjectCN   = data.certSubjectCN;
	    this.fingerprint = data.certFingerprint;
	    this.identifier  = data.identifierToDisplay;
	    this.referenceID = data.referenceId;
	}
	
	/**
	 * @memberof InvalidCertificate
	 * @member subjectCN
	 * @description
	 * Certificate Name
	 *
	 * @type {string}
	 * @since 11.7.0
	 */
	InvalidCertificate.prototype.subjectCN = "";
	
	/**
	 * @memberof InvalidCertificate
	 * @member fingerprint
	 * @description
	 * Certificate fingerprint
	 *
	 * @type {string}
	 * @since 11.7.0
	 */
	InvalidCertificate.prototype.fingerprint = "";
	
	/**
	 * @memberof InvalidCertificate
	 * @member identifier
	 * @description
	 * Identity that provides the certificate.
	 *
	 * @type {string}
	 * @since 11.7.0
	 */
	InvalidCertificate.prototype.identifier = "";
	
	/**
	 * @memberof InvalidCertificate
	 * @member referenceID
	 * @description
	 * Identity of the certificate provider matching the certificate owner.
	 *
	 * @type {string}
	 * @since 11.7.0
	 */
	InvalidCertificate.prototype.referenceID = "";
	
	module.exports.InvalidCertificate = InvalidCertificate;


/***/ })
/******/ ]);
//# sourceMappingURL=cwic-debug.js.map