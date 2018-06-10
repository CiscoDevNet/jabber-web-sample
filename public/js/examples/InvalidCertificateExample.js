function initializeInvalidCertificateEventHandlers()
{
    cwic.CertificateController.addEventHandler('onInvalidCertificate', onInvalidCertificate);
}

function onInvalidCertificate(certificate, reasons, canUserAccept)
{
    $('#invalidcertcontainer').show();

    $('#certdetailstable .identifier').text(certificate.identifier);
    $('#certdetailstable .subjectCN').text(certificate.subjectCN);
    $('#certdetailstable .reference').text(certificate.referenceID);
    $('#certdetailstable .reason').text(reasons.join(', '));

    if (canUserAccept)
    {
        $('#responsebuttons .accept').unbind().one('click', function ()
        {
            cwic.CertificateController.acceptInvalidCertificate(certificate);
            $('#invalidcertcontainer').hide();
        });

        $('#responsebuttons .reject').unbind().one('click', function () {
            cwic.CertificateController.rejectInvalidCertificate(certificate);
            $('#invalidcertcontainer').hide();
        });

        $('#responsebuttons').show();
    }
    else
    {
        $('#responsebuttons').hide();
    }
}