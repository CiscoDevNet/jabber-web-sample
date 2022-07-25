/*
Copyright (c) 2022 Cisco and/or its affiliates.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// CUCM Jabber user
var username = "dstaudt";
var password = "password";
// CUCM hosts
var cucmServers = [
    'foo.foo.com',
    'sjds-cucm14.cisco.com'
];

var currentServer = 0;
var lastAuthError = 'None';

var currentDevice;
var currentConversation;
var nativeConversationWindow;

window.onload = function () {
    // Handlers for plugin init success/failure/error
    cwic.SystemController.addEventHandler('onInitialized', onCwicInitialized);
    cwic.SystemController.addEventHandler('onInitializationError', function(error){
        alert('Initialization error: ' + error.errorData.reason);
    });
    cwic.SystemController.addEventHandler('onAddonConnectionLost', () => {
        alert('Add-On connection lost!')
    });
    // Handlers for user accepting/rejecting mic/camera permission
    cwic.SystemController.addEventHandler('onUserAuthorized', onUserAuthorized);
    cwic.SystemController.addEventHandler('onUserAuthorizationRejected', function(){
        alert('Audio/Video user authorization rejected!');
    });
    // Init the plugin/library
    cwic.SystemController.initialize();
}

function onCwicInitialized() {
    document.getElementById('initialized-checkbox').checked = true;
}

// If plugin initialized and user has authorized mic/camera, set up login/telephony/call
// handlers and start the login/signin process
function onUserAuthorized() {
    document.getElementById('authorized-checkbox').checked = true;
    cwic.CertificateController.addEventHandler("onInvalidCertificate", onInvalidCertificate);
    cwic.LoginController.addEventHandler("onCredentialsRequired", onCredentialsRequired);
    cwic.LoginController.addEventHandler("onSignedOut", onSignedOut);
    cwic.LoginController.addEventHandler("onSigningIn", onSigningIn);
    cwic.LoginController.addEventHandler('onAuthenticationStateChanged', onAuthenticationStateChanged);
    cwic.LoginController.addEventHandler("onAuthenticationFailed", onAuthenticationFailed);
    cwic.TelephonyController.addEventHandler('onTelephonyDeviceListChanged', onTelephonyDeviceListChanged);
    cwic.TelephonyController.addEventHandler('onConnectionStateChanged', onConnectionStateChanged);
    cwic.TelephonyController.addEventHandler("onConversationOutgoing", onConversationOutgoing);
    cwic.TelephonyController.addEventHandler("onConversationStarted", onConversationStarted);
    cwic.TelephonyController.addEventHandler("onConversationEnded", onConversationEnded);
    cwic.LoginController.setCUCMServers([cucmServers[currentServer]]);
    cwic.LoginController.setTFTPServers([cucmServers[currentServer]]);
    cwic.LoginController.signIn();
}

// If the add-on can not verify the CUCM UDS SSL certificiate, prompt the user to accept it
function onInvalidCertificate(invalidCertificate) {
    if (confirm('Authentication error: CUCM SSL certificate invalid (please accept)')) {
        cwic.CertificateController.acceptInvalidCertificate(invalidCertificate);
    }
}

function onSigningIn() {
    document.getElementById('signingin-checkbox').checked = true;
    document.getElementById('signingin-server').innerText = `(${cucmServers[currentServer]})...`;
}

function onSignedOut() {
    document.getElementById('signingin-checkbox').checked = false;
    document.getElementById('signingin-server').innerText = '';
    document.getElementById("inprogress-checkbox").checked = false;
    document.getElementById("authenticated-checkbox").checked = false;
}

// Plugin is requesting user credentials and/or CUCM server address
function onCredentialsRequired(content) {
    switch( lastAuthError ) {
        case 'None':
            document.getElementById('signingin-checkbox').checked = true;
            document.getElementById('signingin-server').innerText = `(${cucmServers[currentServer]})...`;
            cwic.LoginController.setCUCMServers([cucmServers[currentServer]]);
            cwic.LoginController.setTFTPServers([cucmServers[currentServer]]);
            cwic.LoginController.setCredentials(username, password);
            break;
        // If previous sign-in attempt resulted in a connection error, reset the sign-in process
        // Note: don't setCredentials or the previous invalid/failed credentials/server will be retried
        // resetUserData will result in a new onCredentialsRequired event
        case  'Connection':
            cwic.LoginController.resetUserData();
            lastAuthError = 'None';
            break;
        case 'Credentials':
            // Do nothing - i.e. halt the login process
            break;
    }
}

// Sign-in authentication failed for some reason
// Note, this is always followed by an onCredentialsRequired call to prompt a retry
function onAuthenticationFailed(error) {
    switch (error) {
        case 'CouldNotConnect':
        case 'ClientCertificateError':
        case 'SSLConnectError':
            alert(`Authentication error!  Could not connect to: ${cucmServers[currentServer]}`);
            // Round robin to the next CUCM server to try
            currentServer = (currentServer == cucmServers.length-1) ? 0 : ++currentServer;
            // Set lastAuthError so that onCredentialsRequired knows to reset the user/server data
            lastAuthError = 'Connection';
            break;
        case 'InvalidCredentials':
        case 'InvalidToken':
            alert('Authentication error!  Invalid credentials');
            lastAuthError = 'Credentials';
        break;
        case 'NoCredentialsConfigured':
            lastAuthError = 'None';
            break;
        default:
            alert(`Authentication error! Message: ${error}`);
            break;
        }
        }
    
function onAuthenticationStateChanged(state) {
    switch (state) {
        case "InProgress":
            document.getElementById("inprogress-checkbox").checked = true;
            document.getElementById("authenticated-checkbox").checked = false;
            break;
        case "Authenticated":
            document.getElementById("inprogress-checkbox").checked = true;
            document.getElementById("authenticated-checkbox").checked = true;
            document.getElementById("make-call").onclick = makeCallClick;
            document.getElementById("end-call").onclick = endCallClick;
            break;
        case 'NotAuthenticated':
            document.getElementById("inprogress-checkbox").checked = false;
            document.getElementById("authenticated-checkbox").checked = false;
    }
}

// Received for any/all minor changes to the device/line list
function onTelephonyDeviceListChanged() {
    // If we've already chosen a device, choose its first line appearance
    if (currentDevice) {
        for (device of cwic.TelephonyController.telephonyDevices) {
            if (device.name == currentDevice) {
                document.getElementById('directory-number').textContent = device.activeLine;
            };
        }
    return;
    }
    // If not, look for CSF devices and chose the first one
    for (device of cwic.TelephonyController.telephonyDevices) {
        if (device.type == 'Cisco Unified Client Services Framework') {
            currentDevice = device.name;
            document.getElementById('selected-device').textContent = device.name;
            // Start the device connect/registration process
            device.connect(true);
            break;
        }
    }
}

function onConnectionStateChanged(state) {
    document.getElementById("connection-status").innerText = state;
    switch (state) {
        case "Disconnected":
            {
                document.getElementById("connection-status").style.color = 'red';
                document.getElementById("make-call").disabled = true;
                document.getElementById("end-call").disabled = false;
                document.getElementById('call-status').textContent = '';
                break;
            }
        case "Connecting":
            {
                document.getElementById("connection-status").style.color = 'goldenrod';
                document.getElementById("make-call").disabled = true;
                break;
            }
        case "Connected":
            {
                document.getElementById("connection-status").style.color = 'green';
                document.getElementById("make-call").disabled = false;
                // With the telephony connection established/device registered, we can
                // instantiate the native video window
                nativeConversationWindow = cwic.WindowController.getNativeConversationWindow();
                document.getElementById('call-status').textContent = 'Onhook';
                break;
            }
    }
}

function makeCallClick() {
    document.getElementById("make-call").disabled = true;
    cwic.TelephonyController.startVideoConversation(document.getElementById("destination").value);
}

// If there is a call in progress, and it's in a state compatible with being ended...
function endCallClick() {
    if(currentConversation && currentConversation.capabilities.canEnd){
        currentConversation.end();
    }
};

function onConversationOutgoing(conversation) {
    // Keep track of the current conversation, so we can specify it when
    // the user wants to end it
    currentConversation = conversation;
    document.getElementById("end-call").disabled = false;
    document.getElementById("make-call").disabled = true;
    document.getElementById('call-status').textContent = 'Ringing';
    document.getElementById('call-status').style.color = 'goldenrod';
}

function onConversationStarted(conversation){
    // Dock the video window so it appears stationary in the page
    nativeConversationWindow.dock( document.getElementById("remote-video-container") );
    nativeConversationWindow.showVideoForConversation(conversation);
    
    document.getElementById("end-call").disabled = false;
    document.getElementById('call-status').textContent = 'Talking';
    document.getElementById('call-status').style.color = 'green';
}

function onConversationEnded(conversation){
    nativeConversationWindow.hide();
    
    document.getElementById("end-call").disabled = true;
    document.getElementById("make-call").disabled = false;
    document.getElementById('call-status').textContent = 'Onhook';
    document.getElementById('call-status').style.color = 'black';
}
