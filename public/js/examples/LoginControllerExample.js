var SSOPopUpWindow = null;

function initilizeLoginEventHandlers()
{
    cwic.LoginController.addEventHandler('onEmailRequired', onEmailRequired);
    cwic.LoginController.addEventHandler('onCredentialsRequired', onCredentialsRequired);
    cwic.LoginController.addEventHandler('onLoggedIn', onLoggedIn);
    cwic.LoginController.addEventHandler('onLifeCycleStateChanged', onLifeCycleStateChanged);
    cwic.LoginController.addEventHandler('onSigningOut', onSigningOut);
    cwic.LoginController.addEventHandler('onSignedIn', onSignedIn);
    cwic.LoginController.addEventHandler('onSingingIn', onSigningIn);
    cwic.LoginController.addEventHandler('onServiceDiscovering', onServiceDiscovering);
    cwic.LoginController.addEventHandler('onDataResetting', onDataResetting);

    cwic.LoginController.addEventHandler('onAuthenticationStateChanged', onAuthenticationStateChanged);
    cwic.LoginController.addEventHandler('onAuthenticationFailed', onAuthenticationError);

    cwic.LoginController.addEventHandler('onSSONavigationRequired', onSSONavigationRequired);

    cwic.LoginController.setSSORedirectURL(location.origin + "/newSample/ssopopup.html");
}

function onEmailRequired()
{
    $('.SignInWindow').hide();
    $('#emailRequiredWindow').show();
}

function onCredentialsRequired()
{
    $('.SignInWindow').hide();
    $('#credentialsRequiredWindow').show();
}

function onLifeCycleStateChanged()
{

}

function onLoggedIn()
{

}


function startDiscoveryButtonPressed()
{
    cwic.LoginController.startDiscovery();
}

function manualSignInButtonPressed()
{
    $('.SignInWindow').hide();
    $('#mansignindetails').show();
}

function signInButtonPressed()
{
    var $UsernameField = $('#username');
    var $PasswordField = $('#password');
    var $CUCMField     = $('#cucm');

    var username   = $UsernameField.val();
    var password   = $PasswordField.val();
    var cucm       = $CUCMField.val();
    var serverList = [];

    serverList.push(cucm);

    cwic.LoginController.setCTIServers(serverList);
    cwic.LoginController.setTFTPServers(serverList);
    cwic.LoginController.setCUCMServers(serverList);

    //cwic.LoginController.setCredentials(username, password);
    cwic.LoginController.signIn();

    $('#mansignindetails').hide();
}

function signOutButtonPressed()
{
    cwic.LoginController.signOut();
    $('#signInWindow').show();
}

function setEmailButtonPressed()
{
    var $EmailField = $('#sdEmail');
    var email       = $EmailField.val();

    cwic.LoginController.setEmail(email);
    $('#emailRequiredWindow').hide();


}

function setCredentialsButtonPressed()
{
    var $UsernameField = $('#sdUsername');
    var $PasswordField = $('#sdPassphrase');

    var username = $UsernameField.val();
    var password = $PasswordField.val();

    cwic.LoginController.setCredentials(username, password);
}

function onSignedOut()
{
    $('#signInWindow').show();
    cwic.LoginController.removeEventHandler('onSignedOut');
}

function onSigningOut()
{
    $('.SignInWindow').hide();
    $('.SignOutWindow').hide();
    $("#callcontainer").hide();
    $('#desktopShareWindow').hide();

    cwic.LoginController.addEventHandler('onSignedOut', onSignedOut);
}

function onSignedIn()
{
    $('.SignInWindow').hide();
    $('#devicedetails').show();
    $('#signOut').show();
    $('#signoutbtn').attr('disabled', false);
    $('.externalbtns').attr('disabled', false);

    initializeExternalWindowExampleUI();
}

function onSigningIn()
{
}

function onServiceDiscovering()
{
}

function onDataResetting()
{
}

function onAuthenticationStateChanged(state)
{
}

function onAuthenticationError(error)
{
}

function onSSONavigationRequired(url)
{
    var $SSOWindow = $("#sdssoinprogress");
    $SSOWindow.show();

    window.onSSONavigationComplete = onSSONavigationComplete;

    //Open a child window for user interaction
    SSOPopUpWindow = window.open(url, '', 'height=500,width=500,scrollbars=1');
}

function onSSONavigationComplete(content)
{
    var $SSOWindow = $("#sdssoinprogress");
    $SSOWindow.hide();
    cwic.LoginController.setSSOTokenURI(content.url);
    console.log("SSO Navigation complete");
}

function cancelSSOButtonPressed()
{
    var $SSOWindow = $("#sdssoinprogress");
    $SSOWindow.hide();

    if(SSOPopUpWindow)
    {
        SSOPopUpWindow.close();
    }


    cwic.LoginController.cancelSSO();
}