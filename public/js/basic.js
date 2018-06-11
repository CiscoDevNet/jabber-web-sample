
/*
Copyright (c) 2018 Cisco and/or its affiliates.
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

// Global system/user specific info - customize 
var username = "CHANGEME"; // CUCM user
var password = "CHANGEME";
var cucm = ["CHANGEME"]; // CUCM ip/hostname

var loginFailed = false;
var ignoreFalseAuthenticated = true;

var currentConversation;
var nativeConversationWindow;

$("document").ready(function () {
    cwic.SystemController.addEventHandler('onInitialized', onCwicInitialized);
    cwic.SystemController.addEventHandler('onInitializationError', onInitializationError);
    cwic.SystemController.addEventHandler('onAddonConnectionLost', () => {
        alert('Add-On Connection Lost')
    });
    cwic.SystemController.initialize(); // Calling API to initialize cwic library
})

function onInitializationError(error) {
    alert('Error: ' + error.errorData.reason)
}

function onCwicInitialized() {
    $('#initialized-checkbox').prop("checked", true);
    cwic.SystemController.addEventHandler('onUserAuthorized', onUserAuthorized);
    cwic.SystemController.addEventHandler('onUserAuthorizationRejected', function(){
        alert('Error: Audio/Video user authorization failed');
    });
}

function onUserAuthorized() {
    cwic.CertificateController.addEventHandler("onInvalidCertificate", onInvalidCertificate);
    $('#authorized-checkbox').prop("checked", true);
    cwic.LoginController.addEventHandler("onCredentialsRequired", onCredentialsRequired);
    cwic.LoginController.addEventHandler('onAuthenticationStateChanged', onAuthenticationStateChanged);
    cwic.LoginController.addEventHandler("onAuthenticationFailed", onAuthenticationFailed);
    cwic.TelephonyController.addEventHandler('onTelephonyDeviceListChanged', onTelephonyDeviceListChanged);
    cwic.LoginController.signIn();
}

function onInvalidCertificate(invalidCertificate) {
    alert("Error: CUCM certificate invalid (please accept)");
    cwic.CertificateController.acceptInvalidCertificate(invalidCertificate); // testing only
}

function onCredentialsRequired() {
    if (loginFailed){
        cwic.LoginController.signOut();
        return;
    }
    cwic.LoginController.setCUCMServers(cucm);
    cwic.LoginController.setCTIServers(cucm);
    cwic.LoginController.setTFTPServers(cucm);
    cwic.LoginController.setCredentials(username, password)
}

function onAuthenticationStateChanged(state) {
    switch (state) {
        case "InProgress":
            $("#inprogress-checkbox").prop("checked", true);
            break;
        case "Authenticated":
            {
                if (ignoreFalseAuthenticated) {
                    ignoreFalseAuthenticated = false;
                    break;
                } else {
                    $("#authenticated-checkbox").prop("checked", true);
                    initUiHandlers();
                }
            }
            break;
        case "NotAuthenticated":
            break;
    }
}

function onAuthenticationFailed(error) {
    loginFailed = true;
    alert("Authentication Error: " + error);
}

function initUiHandlers() {
    $("#make-call").click(makeCallClick);
    $("#end-call").click(function(conversation){
        if(currentConversation.capabilities.canEnd){
            currentConversation.end();
        }
    });
    $("#destination").keypress(destinationKeypress);
}

function onTelephonyDeviceListChanged() {
    let devices = cwic.TelephonyController.telephonyDevices;
    if (devices.length > 0) {
        device = devices[0]
        $("#selected-device").val(device.name);
        let lines = device.lineDirectoryNumbers;
        if (lines.length > 0) {
            $("#directory-number").val(device.lineDirectoryNumbers[0]);
        }
        cwic.TelephonyController.addEventHandler("onConnectionStateChanged", onConnectionStateChanged);
        cwic.TelephonyController.addEventHandler("onConversationOutgoing", function(conversation){
            currentConversation = conversation;
        });
        device.connect(true); // force registration
    }
}

function onConnectionStateChanged(state) {
    switch (state) {
        case "Disconnected":
            {
                $("#connection-status").html("Disconnected");
                $("#connection-status").css({
                    "color": "red"
                });
                $("#make-call").prop("disabled", true);
                $("#end-call").prop("disabled", false);
    break;
            }
        case "Connecting":
            {
                $("#connection-status").html("Connecting...");
                $("#connection-status").css({
                    "color": "goldenrod"
                });
                $("#make-call").prop("disabled", true);
                break;
            }
        case "Connected":
            {
                $("#connection-status").html("Connected");
                $("#connection-status").css({
                    "color": "green"
                });
                $("#make-call").prop("disabled", false);
                // $("#end-call").prop("disabled", false);
                nativeConversationWindow = cwic.WindowController.getNativeConversationWindow();
                break;
            }
    }
}

function makeCallClick() {
    $("#make-call").prop("disabled", true);
    $("#end-call").prop("disabled", false);
    cwic.TelephonyController.addEventHandler("onConversationStarted", onConversationStarted);
    cwic.TelephonyController.addEventHandler("onConversationEnded", onConversationEnded);
    cwic.TelephonyController.startVideoConversation($("#destination").val());
}

function destinationKeypress(key){
    if (key.which == 13){
        $("#make-call").click();
        return false;
    }
}

function onConversationStarted(conversation){
    currentConversation = conversation;

    $("#make-call").prop("disabled", true);

    nativeConversationWindow.dock( document.getElementById("remote-video-container") );
    nativeConversationWindow.showVideoForConversation(conversation);
}

function onConversationEnded(conversation){
    $("#end-call").prop("disabled", true);
    $("#make-call").prop("disabled", false);
    nativeConversationWindow.hide();
}
