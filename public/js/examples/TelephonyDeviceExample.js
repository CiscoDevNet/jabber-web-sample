var telephonyDevices = [];

var TelephonyDeviceObserver = {
    onTelephonyDeviceListChanged : onTelephonyDeviceListChanged,
    onConnectionStateChanged : onConnectionStateChanged
};

function initializeTelephonyDeviceHandlers()
{
    cwic.TelephonyController.addEventHandler('onTelephonyDeviceListChanged', onTelephonyDeviceListChanged);
    cwic.TelephonyController.addEventHandler('onConnectionStateChanged', onConnectionStateChanged);
    cwic.TelephonyController.addEventHandler('onConnectionFailure', onConnectionFailure);
}

function onTelephonyDeviceListChanged()
{
    telephonyDevices = cwic.TelephonyController.telephonyDevices;

    var $DeviceList = $('#devices');
    $DeviceList.empty();

    var index;

    for(index = 0; index < telephonyDevices.length; ++index)
    {
        var device = telephonyDevices[index];
        var $Device = $('<option>');

        $Device.val(index);
        $Device.text(device.name);
        $Device.attr('title', device.description);

        $DeviceList.append($Device);

        if(device.isSelected)
        {
            $DeviceList.val(index);

            var $ControlModeInfo = $('#controlMode');
            var $DeviceNameInfo = $('#deviceName');
            var $ActiveLineInfo = $('#activeLine');
            var $HuntGroupStateInfo = $('#huntGroupState');

            $ControlModeInfo.text(device.controlMode);
            $DeviceNameInfo.text(device.name);
            $ActiveLineInfo.text(device.activeLine);
            $HuntGroupStateInfo.text(device.huntGroupState);
        }
    }

    if(telephonyDevices.length > 0)
    {
        onTelephonyDeviceSelected();
        $('#connectbtn').attr('disabled', false);

    }
}

function onConnectionStateChanged(state)
{
    var $ConnectionStateInfo = $('#connectionState');
    $ConnectionStateInfo.text(state);
    if(state === "Connected")
    {
        $('#startAudioConversationButton').attr('disabled', false);
        $('#startVideoConversationButton').attr('disabled', false);
        $('#selectedDeviceInfo').show();
        cwic.TelephonyController.refreshTelephonyDeviceList();
    }
}

function connectToTelephonyDevice()
{
    var $SelectedTelephonyDevice = $('#devices option:selected');
    var selectedDeviceIndex = $SelectedTelephonyDevice.val();

    var telephonyDevice = telephonyDevices[selectedDeviceIndex];
    var isForceRegistration = $('#sdforcereg').attr('checked');


    if(telephonyDevice.controlMode === "ExtendConnect")
    {
        var number = $("#remotePhoneNumberTextField").val();
        telephonyDevice.connect(number, isForceRegistration);
    }
    else
    {
        telephonyDevice.connect(isForceRegistration);
    }
}

function onTelephonyDeviceSelected()
{
    $('.DeviceSelection').hide();

    var $SelectedTelephonyDevice = $('#devices option:selected');
    var selectedDeviceIndex = $SelectedTelephonyDevice.val();
    var telephonyDevice = telephonyDevices[selectedDeviceIndex];

    switch(telephonyDevice.controlMode)
    {
        case "Softphone":
            showSoftPhoneControls();
            break;
        case "Deskphone":
            showDeskPhoneControls();
            break;
        case "ExtendConnect":
            showRemotePhoneControls();
            break;
    }

    $('#deviceControlMode').text(telephonyDevice.controlMode);
    $('#connectbtn').attr('disabled', telephonyDevice.isSelected);
}

function showSoftPhoneControls()
{

}

function showRemotePhoneControls()
{
    var $RemotePhoneNumberInput = $('#remotePhoneNumberTextField');
    var $DeleteRemotePhoneNumber = $('#deleteRemotePhoneNumberButton');

    $RemotePhoneNumberInput.show();
    $DeleteRemotePhoneNumber.show();

    var $SelectedTelephonyDevice = $('#devices option:selected');
    var selectedDeviceIndex = $SelectedTelephonyDevice.val();
    var telephonyDevice = telephonyDevices[selectedDeviceIndex];

    $DeleteRemotePhoneNumber.attr('disabled', !telephonyDevice.isSelected)
}

function showDeskPhoneControls()
{
    var $SelectedTelephonyDevice = $('#devices option:selected');
    var selectedDeviceIndex = $SelectedTelephonyDevice.val();
    var telephonyDevice = telephonyDevices[selectedDeviceIndex];

    var $TelephonyLines = $('#deskphoneLines');
    var $SelectLineButton = $('#selectLineButton');

    $TelephonyLines.empty();
    var numberOfLines = telephonyDevice.lineDirectoryNumbers.length;
    for(var index=0; index < numberOfLines; index++)
    {
        var $TelephonyLine = $('<option>');

        $TelephonyLine.val(telephonyDevice.lineDirectoryNumbers[index]);
        $TelephonyLine.text(telephonyDevice.lineDirectoryNumbers[index]);
        $TelephonyLines.append($TelephonyLine);
    }

    $TelephonyLines.attr('disabled', !telephonyDevice.isSelected);
    $SelectLineButton.attr('disabled', !telephonyDevice.isSelected);

    $TelephonyLines.show();
    $SelectLineButton.show();
}

function changeLine()
{
    var $SelectedTelephonyLine = $('#deskphoneLines option:selected');
    var selectedLine = $SelectedTelephonyLine.val();

    var device = cwic.TelephonyController.getConnectedTelephonyDevice();
    if(device.controlMode === "Deskphone")
    {
        device.selectLine(selectedLine);
    }
}

function deleteRemoteDeviceNumber()
{
    var device = cwic.TelephonyController.getConnectedTelephonyDevice();

    if(device.controlMode === "ExtendConnect")
    {
        device.deleteNumber();
    }
}

function huntGroupLogin()
{
    var device = cwic.TelephonyController.getConnectedTelephonyDevice();

    if(device.huntGroupState === "LoggedOut")
    {
        device.huntGroupLogin();
    }
}

function huntGroupLogout()
{
    var device = cwic.TelephonyController.getConnectedTelephonyDevice();

    if(device.huntGroupState === "LoggedIn")
    {
        device.huntGroupLogout();
    }
}

function onConnectionFailure()
{

}


