var ScreenShareWindow = null;
var PreviewVideoWindow = null;

function initializeLocalPreviewVideoWindowControls()
{
    var videoContainer = document.getElementById('video');
    var videoWindow    = cwic.WindowController.createVideoWindow('Preview', videoContainer);
    PreviewVideoWindow = videoWindow;


    var $OpenButton  = $('#openPreviewWindowButton');
    var $CloseButton = $('#closePreviewWindowButton');

    $OpenButton.click(function(){
        videoWindow.show();
    });

    $CloseButton.click(function(){
        videoWindow.hide();
    });
}

function initializeScreenShareVideoWindowControls()
{
    var videoContainer = document.getElementById('desktopShareContainer');
    var videoWindow    = cwic.WindowController.createVideoWindow('ScreenShare', videoContainer);
    ScreenShareWindow = videoWindow;

    var $OpenButton   = $('#openDesktopShareWindowButton');
    var $CloseButton  = $('#closeDesktopShareWindowButton');

    $OpenButton.click(function(){
        var conversation = telephonyConversations[selectedConversationID];
        videoWindow.showForConversation(conversation);
    });

    $CloseButton.click(function(){
        var conversation = telephonyConversations[selectedConversationID];
        videoWindow.hideForConversation(conversation);
    });
}

function initializeConversationWindowControls()
{
    
}

var childWindow = null;
var windowContainer = null;

function openPopupWindow()
{
    childWindow = window.open("Popup.html", "PopUpPreviewWindow.html", 200, 200);
}

function showPreviewInPopupWindow()
{
    windowContainer = childWindow.document.getElementById("TestWindow");

    var previewWindow = cwic.WindowController.createVideoWindow('Preview', windowContainer, childWindow);
    previewWindow.show();
}

