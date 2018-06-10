function initializeMonitorEventHandlers()
{
    cwic.MultimediaController.addEventHandler("onMonitorListChanged", onMonitorListChanged);
}

function onMonitorListChanged(monitors)
{
    var $MonitorList = $("#screenInformationList");
    $MonitorList.empty();

    for(var i=0; i<monitors.length; ++i)
    {
        var monitor = monitors[i];

        var selectScreenButtonID    = 'selectScreenButton' + monitor.id;
        var highlightScreenButtonID = 'hightlightScreenButton' + monitor.id;

        $MonitorList.append($(
            '<li class="ScreenInfo">' +
            '<div class="ScreenName">' + monitor.name + '</div>' +
            '<div class="Controls">' +
            '<button type="button" id=' + selectScreenButtonID + '> Select </button>' +
            '<button type="button" id=' + highlightScreenButtonID + '> Highlight </button>' +
            '</div>' +
            '</li>'
        ));

        var $SelectScreenButton  = $('#' + selectScreenButtonID);
        var $HighlightScreenButton = $('#' + highlightScreenButtonID);

        $HighlightScreenButton.bind("click", {monitor: monitor}, highlightScreen);
        $SelectScreenButton.bind("click", {monitor: monitor}, selectScreenForSharing);
    }
}

function highlightScreen(event)
{
    var monitor = event.data.monitor;
    cwic.MultimediaController.highlightMonitor(monitor);
}

function unhighlightScreen()
{
    cwic.MultimediaController.unHighlightMonitor()
}


function selectScreenForSharing(event)
{
    var monitor = event.data.monitor;
    cwic.MultimediaController.selectMonitor(monitor);
}

function refreshMonitorList(content)
{
    cwic.MultimediaController.refreshMonitorList();
}