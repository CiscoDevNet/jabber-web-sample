// Entry Point of Sample Application. Gets called when Sample.HTML has been loaded.
$(document).ready(function ()
{
	cwic.SystemController.setLoggingLevel(0);
	cwic.SystemController.addEventHandler('onInitialized', onCwicLoaded);
	cwic.SystemController.addEventHandler('onInitializationError', onCwicError);
	cwic.SystemController.addEventHandler('onUserAuthorized', onUserAuthorized);
	cwic.SystemController.addEventHandler('onUserAuthorizationRejected', onAuthorizationRejected);
	cwic.SystemController.addEventHandler('onAddonConnectionLost', onAddonConnectionLost);
	cwic.SystemController.initialize();

});

document.addEventListener("unload", (function()
{
	window.open("www.google.com", '', 'height=500,width=500,scrollbars=1');
}));

function onAddonConnectionLost()
{
	var $ErrorMessageWindowCloseButton = $('#closeErrorMessageWindowButton');
	var $ErrorMessageWindow = $('#errorMessageContainer');


	$ErrorMessageWindowCloseButton.click(function()
	{
		$ErrorMessageWindow.hide();
	});

	var messageContainer = document.getElementById("errorMessage");
	messageContainer.innerHTML = "Lost connection with add-on";

	$ErrorMessageWindow.show();
}

function onCwicError(errorInfo)
{
	var $ErrorMessageWindowCloseButton = $('#closeErrorMessageWindowButton');
	var $ErrorMessageWindow = $('#errorMessageContainer');


	$ErrorMessageWindowCloseButton.click(function()
	{
		$ErrorMessageWindow.hide();
	});

	var extensionURL = errorInfo.errorData.extensionURL;
	var errorReason  = errorInfo.errorData.reason;

	errorMessage = "Could not initialize CWIC library: " + errorReason;

	switch(errorInfo.errorType)
	{
		case "ChromeExtension":
			errorMessage += "<br>" + "<a href='" + extensionURL + "'> You can download extension here</a>";
	}

	var messageContainer = document.getElementById("errorMessage");
	messageContainer.innerHTML = errorMessage;
	$ErrorMessageWindow.show();
}

function onCwicLoaded()
{
	$("#cwicVersion").text(cwic.SystemController.cwicVersion);
	$("#addonVersion").text(cwic.SystemController.addonVersion);
	$("#systemRelease").text(cwic.SystemController.systemRelease);
}

function onUserAuthorized()
{
	initializeLoginExampleUI();
	initializeMediaDeviceExampleUI();
	initializeRingtoneExampleUI();
	initializeMonitorExampleUI();
	initializeTelephonyDeviceExampleUI();
	initializeTelephonyConversationExampleUI();
	initializeCallPickupExampleUI();
	initializeInvalidCertificateExampleUI();
}

function onAuthorizationRejected()
{
	console.log("rejected");
}

function initializeLoginExampleUI()
{
	initilizeLoginEventHandlers();

	var $StartDiscoveryButton = $('#startdiscovery');
	var $SetEmailButton       = $('#sdSetEmail');
	var $SetCredentialsButton = $('#sdCredentialsSubmit');
	var $ManualSignInButton   = $('#manualSignInButton');
	var $SignInButton         = $('#signinbtn');
	var $SignOutButton        = $('#signoutbtn');
	var $CancelSSOButton      = $('#cancelSSOButton');

	$StartDiscoveryButton.click(startDiscoveryButtonPressed);
	$ManualSignInButton.click(manualSignInButtonPressed);
	$SignInButton.click(signInButtonPressed);
	$SetEmailButton.click(setEmailButtonPressed);
	$SetCredentialsButton.click(setCredentialsButtonPressed);
	$SignOutButton.click(signOutButtonPressed);
	$CancelSSOButton.click(cancelSSOButtonPressed);

	var $ManualSignInBackButton     = $('#manualSignInBackButton');
	var $DiscoverySignInBackButton  = $('#discoverySignInBackButton');
	var $CredentialsRequiredBackButton  = $('#credentialsRequiredBackButton');


	$ManualSignInBackButton.click(function()
	{
		$('#mansignindetails').hide();
		$('#signInWindow').show();
	});

	$DiscoverySignInBackButton.click(function()
	{
		$('#emailRequiredWindow').hide();
		$('#signInWindow').show();
	});

	$CredentialsRequiredBackButton.click(function()
	{
		$('#credentialsRequiredWindow').hide();
		$('#signInWindow').show();
	})


}

function initializeMediaDeviceExampleUI()
{
	initializeMediaDeviceEventHandlers();

	var $RefreshDeviceListButton = $('#refreshMediaDeviceListButton');
	$RefreshDeviceListButton.click(refreshMediaDeviceList);

	var $CameraList     = $('#cameraList');
	var $MicrophoneList = $('#microphoneList');
	var $SpeakerList    = $('#speakerList');
	var $RingerList     = $('#ringerList');

	$CameraList.change(selectCamera);
	$MicrophoneList.change(selectMicrophone);
	$SpeakerList.change(selectSpeaker);
	$RingerList.change(selectRinger);

	var $SpeakerVolumeButton    = $('#speakervolumebtn');
	var $RingerVolumeButton     = $('#ringervolumebtn');
	var $MicrophoneVolumeButton = $('#micvolumebtn');

	$SpeakerVolumeButton.click(speakerVolumeButtonPressed);
	$RingerVolumeButton.click(ringerVolumeButtonPressed);
	$MicrophoneVolumeButton.click(microphoneVolumeButtonPressed);
}

function initializeRingtoneExampleUI()
{
	initializeRingtoneEventHandlers();

	var $RingtoneList = $('#ringtonesSelect');

	$RingtoneList.change(selectRingtone);
}

function initializeMonitorExampleUI()
{
	initializeMonitorEventHandlers();

	var $RefreshMonitorListButton = $('#refreshMonitorListButton');
	var $UnHighlightMonitor = $("#UnhighlightMonitorButton");

	$RefreshMonitorListButton.click(refreshMonitorList);
	$UnHighlightMonitor.click(unhighlightScreen);
}

function initializeTelephonyDeviceExampleUI()
{
	initializeTelephonyDeviceHandlers();

	var $ConnectButton = $('#connectbtn');
	var $RemoveNumberButton = $('#deleteRemotePhoneNumberButton');
	var $HuntGroupLoginButton = $('#huntGroupLoginButton');
	var $HuntGroupLogoutButton = $('#huntGroupLogoutButton');
	var $DeviceList = $('#devices');
	var $ChangeLineButton = $('#selectLineButton');

	$ConnectButton.click(connectToTelephonyDevice);
	$RemoveNumberButton.click(deleteRemoteDeviceNumber);
	$HuntGroupLoginButton.click(huntGroupLogin);
	$HuntGroupLogoutButton.click(huntGroupLogout);
	$DeviceList.change(onTelephonyDeviceSelected);
	$ChangeLineButton.click(changeLine);


}

function initializeTelephonyConversationExampleUI()
{
	initializeTelephonyConversationHandlers();


	var $StartAudioConversationButton = $('#startAudioConversationButton');
	var $StartVideoConversationButton = $('#startVideoConversationButton');

	var $EndButton              = $('#endCallButton');
	var $AnswerAudioButton      = $('#answerAudioButton');
	var $AnswerVideoButton      = $('#answerVideoButton');
	var $IDivertButton          = $('#iDevertButton');
	var $HoldResumeButton       = $('#holdResumeButton');
	var $MuteAudioButton        = $('#muteAudioButton');
	var $MuteVideoButton        = $('#muteVideoButton');
	var $StartVideoButton       = $('#sendVideoButton');
	var $StartScreenShareButton = $('#screenShareButton');
	var $TransferButton         = $('#transferbtn');
	var $CompleteTransferButton = $('#completebtn');
	var $StartConferenceButton  = $('#conferencebtn');
	var $DTMFField              = $('#dtmfNumberEntry');

	var $CameraTurnLeftButton  = $("#cameraTurnLeft");
	var $CameraTurnRightButton = $("#cameraTurnRight");
	var $CameraTurnUpButton    = $("#cameraTurnUp");
	var $CameraTurnDownButton  = $("#cameraTurnDown");
	var $CameraZoomInButton    = $("#cameraZoomIn");
	var $CameraZoomOutButton   = $("#cameraZoomOut");

	var $CallList = $('#calllist');



	$StartAudioConversationButton.click(startAudioConversation);
	$StartVideoConversationButton.click(startVideoConversation);

	$EndButton.click(endCall);
	$AnswerAudioButton.click(answerAudio);
	$AnswerVideoButton.click(answerVideo);
	$IDivertButton.click(iDivert);
	$HoldResumeButton.click(hold);
	$MuteAudioButton.click(muteAudio);
	$MuteVideoButton.click(muteVideo);
	$StartVideoButton.click(startVideo);
	$StartScreenShareButton.click(shareScreen);
	$TransferButton.click(transferConversation);
	$CompleteTransferButton.click(completeTransfer);
	$StartConferenceButton.click(mergeConversations);

	$CameraTurnLeftButton.mousedown(remoteCameraTurnLeftStart);
	$CameraTurnLeftButton.mouseup(remoteCameraTurnLeftStop);
	$CameraTurnRightButton.mousedown(remoteCameraTurnRightStart);
	$CameraTurnRightButton.mouseup(remoteCameraTurnRightStop);
	$CameraTurnDownButton.mousedown(remoteCameraTiltDownStart);
	$CameraTurnDownButton.mouseup(remoteCameraTiltDownStop);
	$CameraTurnUpButton.mousedown(remoteCameraTiltUpStart);
	$CameraTurnUpButton.mouseup(remoteCameraTiltUpStop);
	$CameraZoomInButton.mousedown(remoteCameraZoomInStart);
	$CameraZoomInButton.mouseup(remoteCameraZoomInStop);
	$CameraZoomOutButton.mousedown(remoteCameraZoomOutStart);
	$CameraZoomOutButton.mouseup(remoteCameraZoomOutStop);

	$CallList.click(onConversationSelected);
	$DTMFField.keypress(onDTMFDigitEntered);
}

function initializeExternalWindowExampleUI()
{
	if (cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
	{
		var dockPreviewButton   = '<input type="button" id="dockPreviewWindow" class="externalbtns"  value="Dock">\n';
		var undockPreviewButton = '<input type="button" id="undockPreviewWindow" class="externalbtns" value="Undock">';

		$('#previewWindowButtonsStrip').append(dockPreviewButton, undockPreviewButton);

		var dockDesktopShareButton   = '<input type="button" id="dockDesktopShareWindow" class="externalbtns"  value="Dock">\n';
		var undockDesktopShareButton = '<input type="button" id="undockDesktopShareWindow" class="externalbtns" value="Undock">';

		$('#desktopShareButtonsStrip').append(dockDesktopShareButton, undockDesktopShareButton);

		initializeLocalPreviewExternalWindowControls();
		initializeScreenShareExternalWindowControls();
		initializeConversationExternalWindowControls();
	}
	else
	{
		initializeLocalPreviewVideoWindowControls();
		initializeScreenShareVideoWindowControls();
	}
}

function initializeCallPickupExampleUI()
{
	initializeCallPickupEventHandlers();

	var $CallPickupButton = $('#callPickupButton');
	var $GroupCallPickupButton = $('#groupCallPickupButton');
	var $OtherGroupPickupButton = $('#otherGroupPickupButton');

	$CallPickupButton.click(onCallPickupButtonPressed);
	$GroupCallPickupButton.click(onGroupCallPickuButtonPressed);
	$OtherGroupPickupButton.click(onOtherGroupPickupButtonPressed);

	var $CallPickupNotificationPickupButton = $('#callPickupNotificationPickupButton');
	var $CallPickupNotificationIgnoreButton = $('#callPickupNotificationIgnoreButton');

	$CallPickupNotificationPickupButton.click(onPickupButtonPressed);
	$CallPickupNotificationIgnoreButton.click(onIgnoreButtonPressed);
}

function initializeInvalidCertificateExampleUI()
{
	initializeInvalidCertificateEventHandlers();
}
