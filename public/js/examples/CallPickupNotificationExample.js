function initializeCallPickupEventHandlers()
{
    cwic.TelephonyController.addEventHandler('onVisualCallPickupNotification', onVisualCallPickupNotification);
    cwic.TelephonyController.addEventHandler('onAudioCallPickupNotification', onAudioCallPickupNotification)
}

function onVisualCallPickupNotification(notificationInfo)
{
    var $CallPickupNotificationWindow = $('#callPickupNotification');
    var $NotificationInfoBody = $('#callPickupNotificationInfo');

    $NotificationInfoBody.text(notificationInfo);
    $CallPickupNotificationWindow.show();
}

function onAudioCallPickupNotification(isAudioEnabled)
{

}

function onIgnoreButtonPressed()
{
    var $CallPickupNotificationWindow = $('#callPickupNotification');
    $CallPickupNotificationWindow.hide();
}

function onPickupButtonPressed()
{
    var errorHandler = function()
    {
        console.log("error");
    };

    cwic.TelephonyController.callPickup(errorHandler);
    var $CallPickupNotificationWindow = $('#callPickupNotification');
    $CallPickupNotificationWindow.hide();
}

function onCallPickupButtonPressed()
{
    cwic.TelephonyController.callPickup();
}

function onGroupCallPickuButtonPressed()
{
    var $GroupCallPickupNumberFiled = $('#groupCallPickupNumber');
    var number = $GroupCallPickupNumberFiled.val();
    cwic.TelephonyController.groupCallPickup(number);
}

function onOtherGroupPickupButtonPressed()
{
    cwic.TelephonyController.otherGroupPickup();
}