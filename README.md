# jabber-web-sample

Basic and advanced sample pages demonstrating the use of the [Cisco Jabber Web SDK](https://developer.cisco.com/site/jabber-websdk/overview/overview/) for voice and video.

This is a [Visual Studio Code](https://code.visualstudio.com/) based project (though it can be run using any web server, all files are static.)

* basic.html - show the basics of initialization through making a two-way video call
* sample.html - the reference sample application from the official Cisco Jabber Web SDK (11.8.2)

**Prerequisites**

* Windows/Mac PC 
* Chrome/Firefox
* Node.js
* From the [Jabber SDK downloads](https://developer.cisco.com/site/jabber-websdk/develop-and-test/voice-and-video/downloads-and-docs/) page:
    * Jabber SDK Browser Add-On
    * Google Chrome or Mozilla Firefox Extension

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

4. Browse to `basic.html` or `sample.html`

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

## Disclaimer

Copyright (c) 2018 Cisco and/or its affiliates.
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

