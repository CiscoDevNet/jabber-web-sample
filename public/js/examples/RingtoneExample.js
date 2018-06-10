var ringtoneList = [];

function initializeRingtoneEventHandlers()
{
    cwic.MultimediaController.addEventHandler("onRingtoneListChanged", onRingtoneListChanged);
}

function onRingtoneListChanged()
{
    var ringtones = cwic.MultimediaController.ringtoneList;
    var $RingtoneList = $('#ringtonesSelect');
    $RingtoneList.empty();
    ringtoneList.length = 0;

    for(var index=0; index<ringtones.length; index++)
    {
        var ringtone = ringtones[index];
        ringtoneList.push(ringtone);

        var $RingtoneListItem = $("<option></option>");
        $RingtoneListItem.val(index);
        $RingtoneListItem.text(ringtone.name);
        $RingtoneList.append($RingtoneListItem);
    }
}

function selectRingtone()
{
    var $RingtoneList = $('#ringtonesSelect');
    var $SelectedRingtoneItem = $('#ringtonesSelect option:selected');
    var selectedRingtoneIndex = $SelectedRingtoneItem.val();

    var ringtone = ringtoneList[selectedRingtoneIndex];
    $RingtoneList.val(selectedRingtoneIndex);
    cwic.MultimediaController.selectRingtone(ringtone);
}