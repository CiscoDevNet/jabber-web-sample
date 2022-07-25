# jabber-web-sample

Basic sample page demonstrating the use of the [Cisco Jabber Web SDK](https://developer.cisco.com/site/jabber-websdk/overview/overview/) for voice and video.

This is a [Visual Studio Code](https://code.visualstudio.com/) based project (though it can be run using any web server, all files are static.)

**Prerequisites**

* Windows/Mac PC 
* Chrome/Firefox
* Node.js
* From the [Jabber SDK downloads](https://developer.cisco.com/site/jabber-websdk/develop-and-test/voice-and-video/downloads-and-docs/) page:
    * Jabber SDK Browser Add-On
    * Google Chrome or Mozilla Firefox Extension

This project was developed using:

* Google Chrome v103
* Windows 10
* CUCM 14
* Jabber SDK 11.8.3

## Getting Started

1. From the project root directory, install Node.js dependencies:
    ```
    npm install
    ```

2. Edit `basic.html` with your Jabber user credentials and CUCM hostname

3. Launch the HTTP server (start debugging:) press **F5**
    > or from the command-line: 
    ```
    cd public
    node ../node_modules/http-server/bin/http-server -o -c-1 -p 3000
    ```

4. Browse to: `http://localhost:3000/basic.html`

It's important to note that in order for sample application to work in chrome and firefox with their respective extensions
sample application needs to be hosted. Communication between CiscoWebCommunicatorAddon and sample application is not
supported when running sample application from file system. Application can be hosted on localhost.

Page that should be hosted is 'sample.html'. In folders 'css' and 'img' contain stylesheets and pictures used in application.
Folder 'js' holds scripts that demonstrate how to use cwic and its features.

Main entry point is 'sample.js'. This Script is loaded when the page is loaded in to browser tab. 'Sample.js' does a setup
of event handlers and controllers. 'Ciscobase.js' contains JQuery that is used in web application. All scripts contained
in 'examples' folder demonstrate specific or multiple features of the cwic library.

'Ssopopup.html' is used in SSO feature demonstration.

For more information about the CWIC, go to the Cisco Developer Network at:
https://developer.cisco.com/site/jabber-websdk/develop-and-test/voice-and-video/start-here/


