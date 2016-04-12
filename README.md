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
- This module is for the Magic Mirror Software Version 2 (currently in development)
- [node-fritzbox-callmonitor](https://www.npmjs.com/package/node-fritzbox-callmonitor) (installed by `npm install` in step 2)