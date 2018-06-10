// Object that will store different media device types retrieved from MultimediaController.
var media =
{
    Speakers : [],
    Microphones : [],
    Ringers : [],
    Cameras : []
};

function initializeMediaDeviceEventHandlers()
{
    cwic.MultimediaController.addEventHandler("onMediaDeviceListChanged", onMediaDeviceListChanged);
}

function onMediaDeviceListChanged()
{
    try
    {
        var cameraList     = cwic.MultimediaController.cameraList;
        var speakerList    = cwic.MultimediaController.speakerList;
        var microphoneList = cwic.MultimediaController.microphoneList;
        var ringerList     = cwic.MultimediaController.ringerList;

        media.Speakers    = speakerList;
        media.Microphones = microphoneList;
        media.Ringers     = ringerList;
        media.Cameras     = cameraList;

        var $MicrophoneList = $('#microphoneList');
        var $CameraList     = $('#cameraList');
        var $SpeakerList    = $('#speakerList');
        var $RingerList     = $('#ringerList');

        var $RingerVolume     = $('#ringervolumecontrol');
        var $SpeakerVolume    = $('#speakervolumecontrol');
        var $MicrophoneVolume = $('#microphonevolumecontrol');

        $MicrophoneList.empty();
        $CameraList.empty();
        $SpeakerList.empty();
        $RingerList.empty();

        var index;

        for (index = 0; index < speakerList.length; ++index)
        {
            var speaker = speakerList[index];

            var $SpeakerListItem = $("<option></option>");
            $SpeakerListItem.val(index);
            $SpeakerListItem.text(speaker.name);
            $SpeakerList.append($SpeakerListItem);

            if (speaker.isSelected)
            {
                $SpeakerList.val(index);
                $SpeakerVolume.val(speaker.volume);
            }
        }

        for (index = 0; index < cameraList.length; ++index)
        {
            var camera = cameraList[index];

            var $CameraListItem = $("<option></option>");
            $CameraListItem.val(index);
            $CameraListItem.text(camera.name);
            $CameraList.append($CameraListItem);

            if (camera.isSelected)
            {
                $CameraList.val(index);
            }
        }

        for (index = 0; index < microphoneList.length; ++index)
        {
            var microphone = microphoneList[index];

            var $MicrophoneListItem = $("<option></option>");
            $MicrophoneListItem.val(index);
            $MicrophoneListItem.text(microphone.name);
            $MicrophoneList.append($MicrophoneListItem);

            if (microphone.isSelected)
            {
                $MicrophoneList.val(index);
                $MicrophoneVolume.val(microphone.volume)
            }
        }

        for (index = 0; index < ringerList.length; ++index)
        {
            var ringer = ringerList[index];

            var $RingerListItem = $("<option></option>");
            $RingerListItem.val(index);
            $RingerListItem.text(ringer.name);
            $RingerList.append($RingerListItem);

            if (ringer.isSelected)
            {
                $RingerList.val(index);
                $RingerVolume.val(ringer.volume);
            }
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

function refreshMediaDeviceList()
{
    cwic.MultimediaController.refreshMediaDeviceList();
}

function selectCamera()
{
    var $SelectedCameraItem = $('#cameraList option:selected');
    var selectedCameraIndex = $SelectedCameraItem.val();

    var camera = media.Cameras[selectedCameraIndex];
    cwic.MultimediaController.selectCamera(camera);
}

function selectMicrophone()
{
    var $SelectedMicrophoneItem = $('#microphoneList option:selected');
    var selectedMicrophoneIndex = $SelectedMicrophoneItem.val();

    var microphone = media.Microphones[selectedMicrophoneIndex];
    cwic.MultimediaController.selectMicrophone(microphone);

    var $MicrophoneVolume = $('#microphonevolumecontrol');
    var volume = microphone.volume;
    $MicrophoneVolume.val(volume);
}

function selectSpeaker()
{
    var $SelectedSpeakerItem = $('#speakerList option:selected');
    var selectedSpeakerIndex = $SelectedSpeakerItem.val();

    var speaker = media.Speakers[selectedSpeakerIndex];
    cwic.MultimediaController.selectSpeaker(speaker);
    var $SpeakerVolume = $('#speakervolumecontrol');
    var volume = speaker.volume;
    $SpeakerVolume.val(volume);

}

function selectRinger()
{
    var $SelectedRingerItem = $('#ringerList option:selected');
    var selectedRingerIndex = $SelectedRingerItem.val();

    var ringer = media.Ringers[selectedRingerIndex];
    cwic.MultimediaController.selectRinger(ringer);

    var $RingerVolume = $('#ringervolumecontrol');
    var volume = ringer.volume;
    $RingerVolume.val(volume);
}

function speakerVolumeButtonPressed()
{
    var volume = $('#speakervolumecontrol').val();

    var $SpeakerList = $('#speakerList');
    var selectedSpeakerIndex = $SpeakerList.val();

    var speaker = media.Speakers[selectedSpeakerIndex];

    speaker.setVolume(volume);
}

function ringerVolumeButtonPressed()
{
    var volume = $('#ringervolumecontrol').val();

    var $RingerList = $('#ringerList');
    var selectedRingerIndex = $RingerList.val();

    var ringer = media.Ringers[selectedRingerIndex];
    ringer.setVolume(volume);
}

function microphoneVolumeButtonPressed()
{
    var volume = $('#microphonevolumecontrol').val();

    var $MicrophoneList = $('#microphoneList');
    var selectedMicrophoneIndex = $MicrophoneList.val();

    var microphone = media.Microphones[selectedMicrophoneIndex];
    microphone.setVolume(volume);
}