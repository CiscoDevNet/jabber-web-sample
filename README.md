# jabber-web-sample

Basic sample web page demonstrating use of the [Cisco Jabber Web SDK](https://developer.cisco.com/site/jabber-websdk/overview/overview/) for voice and video.

This is a [Visual Studio Code](https://code.visualstudio.com/) based project (though it can be run using any web server - all files are static.)

**Prerequisites**

* Windows/Mac PC 
* Chrome/Firefox
* Node.js
* From the [Jabber SDK downloads](https://developer.cisco.com/docs/jabber-web/#!downloads-and-documents) page:
    * Jabber SDK Browser Add-On
    * Google Chrome or Mozilla Firefox Extension

This project was developed using:

* Google Chrome v103
* Windows 10
* CUCM 14
* Jabber SDK 11.8.3

## Getting Started

1. (Optional) Install and launch the [http-server](https://www.npmjs.com/package/http-server) web server:

   From a terminal, install Node.js dependencies:

   ```
   npm -g install
   ```

   > **Note:** this installs globally for the user

   Launch `http-server`:

   ```
   http-server -c-1 -p 5500
   ```

1. Configure `basic.js` with your Jabber user credentials and CUCM hostname.

1. Browse to: `http://localhost:5500/basic.html` or run/debug 'Launch Chrome' from the VS Code Debug tab.


In order for the sample application to work in Chrome and Firefox with their respective extensions, it must be served by a web server. Communication between the CiscoWebCommunicator add-on and sample application is not supported when running sample application from file system.



