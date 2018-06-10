function initializeLocalPreviewExternalWindowControls()
{
    var externalWindow = cwic.WindowController.getNativePreviewWindow();

    var $OpenButton = $('#openPreviewWindowButton');
    var $CloseButton = $('#closePreviewWindowButton');
    var $DockButton = $('#dockPreviewWindow');
    var $UndockButton = $('#undockPreviewWindow');

    var dockingTarget = document.getElementById('video');
    
    $OpenButton.click(function(){
        externalWindow.show();
    });

    $CloseButton.click(function(){
        externalWindow.hide();
    });

    $DockButton.click(function(){
        if(cwic.SystemController.getCapabilities().nativeWindowDockingTargetSupport)
        {
            externalWindow.setDockTargetColor(0,255,255);
        }
        externalWindow.dock(dockingTarget);
    });

    $UndockButton.click(function(){
        externalWindow.undock();
    });
}

function initializeScreenShareExternalWindowControls()
{
    var externalWindow = cwic.WindowController.getNativeScreenShareWindow();

    var $OpenButton = $('#openDesktopShareWindowButton');
    var $CloseButton = $('#closeDesktopShareWindowButton');
    var $DockButton = $('#dockDesktopShareWindow');
    var $UndockButton = $('#undockDesktopShareWindow');
    var dockingTarget = document.getElementById('desktopShareContainer');

    externalWindow.dock(dockingTarget);

    $OpenButton.click(function(){
        externalWindow.show();
    });

    $CloseButton.click(function(){
        externalWindow.hide();
    });

    $DockButton.click(function(){
        if(cwic.SystemController.getCapabilities().nativeWindowDockingTargetSupport)
        {
            externalWindow.setDockTargetColor(0,255,0);
        }
        externalWindow.dock(dockingTarget);
    });

    $UndockButton.click(function(){
        externalWindow.undock();
    });
}

function initializeConversationExternalWindowControls()
{
    var externalWindow = cwic.WindowController.getNativeConversationWindow();

    var $OpenButton = $('#showConversationExternalWindow');
    var $CloseButton = $('#hideConversationExternalWindow');
    var $DockButton = $('#dockConversationWindowButton');
    var $UndockButton = $('#undockConversationWindowButton');
    var dockingTarget = document.getElementById('remotevideocontainer');

    externalWindow.dock(dockingTarget);

    $OpenButton.click(function(){
        var selectedConversation = telephonyConversations[selectedConversationID];
        externalWindow.showVideoForConversation(selectedConversation);
    });

    $CloseButton.click(function(){
        externalWindow.hide();
    });

    $DockButton.click(function(){
        externalWindow.dock(dockingTarget);
    });

    $UndockButton.click(function(){
        externalWindow.undock();
    });
}

