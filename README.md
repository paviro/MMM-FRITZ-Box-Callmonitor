# MMM-FRITZ-Box-Callmonitor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides a callmonitor for FRITZ!Box users alerting them about incoming calls.

## Usage
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-FRITZ-Box-Callmonitor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the dependencies.
3. Add `MMM-FRITZ-Box-Callmonitor` to your config.js, you do not have to set a position.
4. Change the IP adress in `node_helper.js` to the IP of your FRITZ!Box.
5. Add your adressbook in `addressbook.js`.
6. Activate the callmonitor of your FRITZ!Box by calling `#96*5*` on a connected phone.
7. Restart your mirror
8. Done

## Dependencies
- This module is for the v2 module API (currently in development) and needs [this](https://github.com/MichMich/MagicMirror/pull/106) pull request to work!
- [node-fritzbox-callmonitor](https://www.npmjs.com/package/node-fritzbox-callmonitor)
- [socket.io](http://socket.io/)

## Open Source Licenses
###[sweetalert](https://github.com/t4t5/sweetalert)
The MIT License (MIT)

Copyright (c) 2014 Tristan Edwards

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