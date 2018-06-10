var selectedConversationID = null;
var telephonyConversations = {};
var videoWindow = null;

function initializeTelephonyConversationHandlers()
{
    cwic.TelephonyController.addEventHandler('onConversationOutgoing', onConversationStarted);
    cwic.TelephonyController.addEventHandler('onConversationIncoming', onConversationStarted);
    cwic.TelephonyController.addEventHandler('onConversationEnded',    onConversationEnded);
    cwic.TelephonyController.addEventHandler('onConversationUpdated',  onConversationUpdate);
    cwic.TelephonyController.addEventHandler('onConversationStarted',  onConversationStarted);
}

function onConversationOutgoing(telephonyConversation)
{
    var ID = telephonyConversation.ID;

    if(!telephonyConversations[ID])
    {
        addConversationToList(telephonyConversation);
    }
    else
    {
        updateConversationInfoInList(telephonyConversation);
    }

    telephonyConversations[ID] = telephonyConversation;
}

function onConversationIncoming(telephonyConversation)
{
    var ID = telephonyConversation.ID;

    if(!telephonyConversations[ID])
    {
        addConversationToList(telephonyConversation);
    }
    else
    {
        updateConversationInfoInList(telephonyConversation);
    }

    telephonyConversations[ID] = telephonyConversation;
    updateConversationInfo();
}

function onConversationEnded(telephonyConversation)
{
    var ID = telephonyConversation.ID;

    if(telephonyConversations[ID])
    {
        delete telephonyConversations[ID];
        removeConversationFromList(telephonyConversation);
    }

    updateConversationList();
}

function onConversationStarted(telephonyConversation)
{
    var ID = telephonyConversation.ID;

    if(!telephonyConversations[ID])
    {
        addConversationToList(telephonyConversation);
    }
    else
    {
        updateConversationInfoInList(telephonyConversation);
    }

    telephonyConversations[ID] = telephonyConversation;
    updateConversationInfo();
}

function onConversationUpdate(telephonyConversation)
{
    var ID = telephonyConversation.ID;

    if(telephonyConversations[ID])
    {
        telephonyConversations[ID] = telephonyConversation;
        updateConversationInfoInList(telephonyConversation);
        updateConversationInfo();
    }
}

function onConversationSelected(e)
{
    if((e.target.id !== "calllist"))
    {
        var el = $(e.target);
        while(el.length && el[0].id.indexOf("conversation"))
        {
            el = el.parent();
        }
        if(el.length)
        {
            var $CurrentConversation = $('#conversation' + selectedConversationID);
            $CurrentConversation.removeClass('selected');
            if(!cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
            {
                hideConversationVideoWindow();
            }
            
            selectedConversationID = el.find(".ConversationID")[0].id;

            var $SelectedConversation = $(el);
            $SelectedConversation.addClass('selected');

            updateConversationInfo();
        }
    }
}

function addConversationToList(conversation)
{
    var $CallWindow = $("#callcontainer");

    if(Object.keys(telephonyConversations).length === 0)
    {
        $CallWindow.show();

        if(!cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
        {
            var videoContainer = document.getElementById('remotevideocontainer');
            videoWindow    = cwic.WindowController.createVideoWindow('Conversation', videoContainer);

            var $OpenButton = $('#showConversationExternalWindow');
            var $CloseButton = $('#hideConversationExternalWindow');

            $OpenButton.click(function(){
                var conversation = telephonyConversations[selectedConversationID];
                videoWindow.showForConversation(conversation);
            });

            $CloseButton.click(function(){
                var conversation = telephonyConversations[selectedConversationID];
                videoWindow.hideForConversation(conversation);
            });
        }

    }

    var ID = conversation.ID;
    var conversationElementID = 'conversation' + ID;

    var stateInformationID = 'state' + ID;

    var $CallList = $("#calllist");
    var $Call = $(
        '<li' + ' id="' + conversationElementID + '">' +
        '<span class="state" id=' + stateInformationID + '">' +
        conversation.callState + ': ' +
        '</span>' +
        '<span class="ConversationID" id="' + ID +'"></span>' +
        '<span class="recipient-num">' +
        '<b>' + conversation.participants[0].name + ':</b> '
        + conversation.participants[0].number + '' +
        '</span>' +
        '<span class="name">' +
        '' +
        '</span>' +

        '</li>');

    var $CurrentConversation = $('#conversation' + selectedConversationID);
    $CurrentConversation.removeClass('selected');

    $Call.addClass('selected');
    $CallList.append($Call);

    selectedConversationID = ID;
}

function removeConversationFromList(conversation)
{
    var conversationElementID = 'conversation' + conversation.ID;
    $('#calllist #' + conversationElementID).remove();

    if(Object.keys(telephonyConversations).length === 0)
    {
        var $CallWindow = $("#callcontainer");

        if (!cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
        {
            var videoContainer = document.getElementById('remotevideocontainer');
            while(videoContainer.firstChild)
            {
                videoContainer.removeChild(videoContainer.firstChild);
            }
        }
        else
        {
            var externalConversationWindow = cwic.WindowController.getNativeConversationWindow();

            externalConversationWindow.hide();
            //externalConversationWindow.undock();
        }

        $CallWindow.hide();
    }
    else
    {
        for(var property in telephonyConversations)
        {
            if(telephonyConversations.hasOwnProperty(property))
            {
                var telephonyConversation = telephonyConversations[property];

                var $CurrentConversation = $('#conversation' + selectedConversationID);
                $CurrentConversation.removeClass('selected');

                var $SelectedConversation = $('#conversation' + telephonyConversation.ID);
                $SelectedConversation.addClass('selected');

                selectedConversationID = telephonyConversation.ID;

                updateConversationInfo();
            }
        }
    }
}

function updateConversationInfoInList(conversation)
{
    var conversationElementID = 'conversation' + conversation.ID;
    var $ConversationStateInformation = $('#' + conversationElementID + ' .state');

    $ConversationStateInformation.html(conversation.callState);
}

function startAudioConversation()
{
    var $TelephonyNumberField = $('#telephonyNumberForConversationText');
    var number = $TelephonyNumberField.val();

    cwic.TelephonyController.startAudioConversation(number)

    $TelephonyNumberField.empty();
}

function startVideoConversation()
{
    var $TelephonyNumberField = $('#telephonyNumberForConversationText');
    var number = $TelephonyNumberField.val();

    cwic.TelephonyController.startVideoConversation(number)

    $TelephonyNumberField.empty();
}

function iDivert()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.reject();
};

function answerAudio()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.answerAudio();
};

function answerVideo()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.answerVideo();
};

function endCall()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.end();
}

function shareScreen()
{
    var button = $('#screenShareButton');
    var conversation = telephonyConversations[selectedConversationID];

    if(button.text() === 'Start Share')
    {
        conversation.startScreenShare();
    }
    else
    {
        conversation.stopScreenShare();
    }
}

function hold()
{
    var conversation = telephonyConversations[selectedConversationID];

    if($("#holdResumeButton").text() === "Hold")
    {
        conversation.hold();
    }
    else
    {
        conversation.resume();
    }
}

function muteAudio()
{
    var conversation = telephonyConversations[selectedConversationID];

    if($('#muteAudioButton').hasClass('muted'))
    {
        conversation.unmuteAudio();
    }
    else
    {
        conversation.muteAudio();
    }
};

function muteVideo()
{
    var conversation = telephonyConversations[selectedConversationID];

    if($('#muteVideoButton').hasClass('muted'))
    {
        conversation.unmuteVideo();
    }
    else
    {
        conversation.muteVideo();
    }
};

function startVideo()
{
    var conversation = telephonyConversations[selectedConversationID];

    if(conversation.capabilities.canStartVideo)
    {
        conversation.startVideo();
    }
    if(conversation.capabilities.canStopVideo)
    {
        conversation.stopVideo();
    }
}

function remoteCameraTurnLeftStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("PanLeft");
}

function remoteCameraTurnLeftStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("PanLeft");
}

function remoteCameraTurnRightStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("PanRight");
}

function remoteCameraTurnRightStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("PanRight");
}

function remoteCameraTiltUpStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("TiltUp");
}

function remoteCameraTiltUpStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("TiltUp");
}

function remoteCameraTiltDownStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("TiltDown");
}

function remoteCameraTiltDownStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("TiltDown");
}

function remoteCameraZoomInStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("ZoomIn");
}

function remoteCameraZoomInStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("ZoomIn");
}

function remoteCameraZoomOutStart()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.startRemoteCameraAction("ZoomOut");
}

function remoteCameraZoomOutStop()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.stopRemoteCameraAction("ZoomOut");
}

function transferConversation()
{
    var number = $('#transferNum').val();
    var conversation = telephonyConversations[selectedConversationID];
    conversation.transferConversation(number);
}

function completeTransfer()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.completeTransfer();
}

function cancelTransfer()
{
    var conversation = telephonyConversations[selectedConversationID];
    conversation.cancelTransfer();
}

function mergeConversations()
{
    try
    {
        var conversationID = $("#conferencelist").val();
        var conversationToMerge = telephonyConversations[conversationID];
        var conversation = telephonyConversations[selectedConversationID];
        conversation.merge(conversationToMerge);
    }
    catch (exception)
    {
        console.log(exception.message);
    }
}

function onDTMFDigitEntered(event)
{
    var charCode = event.which;
    var dtmf = String.fromCharCode(charCode);

    var conversation = telephonyConversations[selectedConversationID];
    conversation.sendDTMF(dtmf);
}

function updateConversationList()
{
    var $ConversationList = $('#conferencelist');
    $ConversationList.empty();

    if(Object.keys(telephonyConversations).length === 0)
    {
        return;
    }

    for(var property in telephonyConversations)
    {
        if(telephonyConversations.hasOwnProperty(property))
        {
            var conversation = telephonyConversations[property];

            if(selectedConversationID != conversation.ID)
            {
                var listItem = "<option value='" + conversation.ID + "'>" + conversation.participants[0].number + "</option>";
                $ConversationList.append(listItem);
            }
        }
    }
}

function updateConversationInfo()
{
    var conversation = telephonyConversations[selectedConversationID];

    var $EndButton              = $('#endCallButton');
    var $AnswerAudioButton      = $('#answerAudioButton');
    var $AnswerVideoButton      = $('#answerVideoButton');
    var $IDivertButton          = $('#iDevertButton');
    var holdResumeButton        = $('#holdResumeButton');
    var muteAudioButton         = $('#muteAudioButton');
    var muteVideoButton         = $('#muteVideoButton');
    var sendVideoButton         = $('#sendVideoButton');
    var $StartScreenShareButton = $('#screenShareButton');
    var $TransferButton         = $('#transferbtn');
    var $StartConferenceButton  = $('#conferencebtn');

    var $CameraTurnLeftButton   = $("#cameraTurnLeft");
    var $CameraTurnRightButton  = $("#cameraTurnRight");
    var $CameraTurnUpButton     = $("#cameraTurnUp");
    var $CameraTurnDownButton   = $("#cameraTurnDown");
    var $CameraZoomInButton     = $("#cameraZoomIn");
    var $CameraZoomOutButton    = $("#cameraZoomOut");

    $AnswerAudioButton.attr('disabled', !conversation.capabilities.canAnswer);
    $AnswerVideoButton.attr('disabled', !conversation.capabilities.canAnswer);
    $EndButton.attr('disabled', !conversation.capabilities.canEnd);
    $IDivertButton.attr('disabled', !conversation.capabilities.canReject);

    if(cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
    {
        var conversationExternalWindow = cwic.WindowController.getNativeConversationWindow();

        //conversationExternalWindow.dock(document.getElementById('remotevideocontainer'));
        conversationExternalWindow.showVideoForConversation(conversation);
    }
    else
    {
        showConversationVideoWindow();
    }

    // Update Hold Call Controls.
    if(conversation.callState === "Hold")
    {
        holdResumeButton.attr('disabled', !conversation.capabilities.canResume);
        holdResumeButton.text('Resume');
    }
    else if(conversation.callState === "Connected")
    {
        holdResumeButton.attr('disabled', !conversation.capabilities.canHold);
        holdResumeButton.text('Hold');
    }

    // Update Mute Audio Controls.
    if (conversation.states.isAudioMuted)
    {
        muteAudioButton.attr('disabled', !conversation.capabilities.canUnmuteAudio);
        muteAudioButton.text('Unmute Audio').addClass('muted');
    }
    else
    {
        muteAudioButton.attr('disabled', !conversation.capabilities.canMuteAudio);
        muteAudioButton.text('Mute Audio').removeClass('muted');
    }

    // Update Mute Video Controls.
    if (conversation.states.isVideoMuted)
    {
        muteVideoButton.attr('disabled', !conversation.capabilities.canUnmuteVideo);
        muteVideoButton.text('Unmute Video').addClass('muted');
    }
    else
    {
        muteVideoButton.attr('disabled', !conversation.capabilities.canMuteVideo);
        muteVideoButton.text('Mute Video').removeClass('muted');
    }

    // Update Video Sending Controls
    if (conversation.capabilities.canStartVideo)
    {
        sendVideoButton.text('Start Video');
        sendVideoButton.attr('disabled', !conversation.capabilities.canUpdateVideo);
    }

    if(conversation.capabilities.canStopVideo)
    {
        sendVideoButton.text('Stop Video');
        sendVideoButton.attr('disabled', !conversation.capabilities.canUpdateVideo);
    }

    if(conversation.states.isLocalSharing)
    {
        $StartScreenShareButton.text('Stop Share');
        $StartScreenShareButton.attr('disabled', !conversation.capabilities.canStopScreenShare);
    }
    else
    {
        $StartScreenShareButton.text('Start Share');
        $StartScreenShareButton.attr('disabled', !conversation.capabilities.canStartScreenShare);
    }


    if(conversation.capabilities.canControlRemoteCamera)
    {
        $CameraTurnLeftButton.attr('disabled', !conversation.capabilities.canCameraPanLeft);
        $CameraTurnRightButton.attr('disabled', !conversation.capabilities.canCameraPanRight);
        $CameraTurnUpButton.attr('disabled', !conversation.capabilities.canCameraTiltUp);
        $CameraTurnDownButton.attr('disabled', !conversation.capabilities.canCameraTiltDown);
        $CameraZoomInButton.attr('disabled', !conversation.capabilities.canCameraZoomIn);
        $CameraZoomOutButton.attr('disabled', !conversation.capabilities.canCameraZoomOut);
    }
    else
    {
        $CameraTurnLeftButton.attr('disabled', true);
        $CameraTurnRightButton.attr('disabled', true);
        $CameraTurnUpButton.attr('disabled', true);
        $CameraTurnDownButton.attr('disabled', true);
        $CameraZoomInButton.attr('disabled', true);
        $CameraZoomOutButton.attr('disabled', true);
    }


    $TransferButton.attr('disabled', !conversation.capabilities.canTransfer);
    $StartConferenceButton.attr('disabled', !conversation.capabilities.canMerge);

    updateConversationList();


    if(conversation.states.isRemoteSharing)
    {
        showScreenShareWindowWindow(conversation);
    }
    else
    {
        hideScreenShareWindow(conversation);
    }
}

function showConversationVideoWindow()
{
    var conversation = telephonyConversations[selectedConversationID];
    videoWindow.showForConversation(conversation);
}

function hideConversationVideoWindow()
{
    var conversation = telephonyConversations[selectedConversationID];
    videoWindow.hideForConversation(conversation);
}

function showScreenShareWindowWindow(conversation)
{
    $("#desktopShareWindow").show();
    if(cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
    {
        var nativeWindow = cwic.WindowController.getNativeScreenShareWindow();

        if(cwic.SystemController.getCapabilities().nativeWindowDockingTargetSupport)
        {
            nativeWindow.setDockTargetColor(0,255,0);
        }

        //nativeWindow.dock(document.getElementById('desktopShareContainer'));
        nativeWindow.show();
    }
    else
    {
        ScreenShareWindow.showForConversation(conversation);
    }
}

function hideScreenShareWindow(conversation)
{
    $("#desktopShareWindow").hide();
    if(cwic.SystemController.getCapabilities().nativeWindowDockingSupport)
    {
        var nativeWindow = cwic.WindowController.getNativeScreenShareWindow();
        //nativeWindow.undock();
        nativeWindow.hide()
    }
    else
    {
        ScreenShareWindow.hideForConversation(conversation);
    }
}