# MMM-FRITZ-Box-Callmonitor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides a callmonitor for FRITZ!Box users alerting them about incoming calls.
![call](https://cloud.githubusercontent.com/assets/992826/14791014/3febe6b4-0b14-11e6-89d8-160a7c459835.png)


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-FRITZ-Box-Callmonitor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the dependencies.
3. (Optional) Execute `sudo apt-get install python-dev libxml2-dev libxslt1-dev zlib1g-dev && sudo pip install fritzconnection` to allow access to your FRITZ!Box phone book and recent calls. This can take a few minutes.
4. Activate the callmonitor of your FRITZ!Box by calling `#96*5*` on a connected phone (Fritz Fon App won't work).

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-FRITZ-Box-Callmonitor',
		position: 'top_right',	// This can be any of the regions. Best results in left or right regions.
		header: "Recent calls", // This is optional
		config: {
			// See 'Configuration options' for more information.
		}
	}
]
````

### Loading your contacts

There are currently two different ways to get this module to displays the name of the caller, rather than the number.
They are both optional, and you can combine them.

1. Load a .vcf file, for example exported contacts from your phone (see [options](#configuration-options) marked with **VCF**)
2. Access your FRITZ!Box contacts via the TR-064 API (see [options](#configuration-options) marked with **API**)

The latter will also load recently missed calls, which happened before you started your mirror.

### MMM-Callmonitor-Current-Call
If you are interested in having a list with all active calls as well, check out [MMM-Callmonitor-Current-Call](https://github.com/paviro/MMM-Callmonitor-Current-Call). 

## Configuration options

The following properties can be configured:


| Option                                                                                                          | Method | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `numberFontSize`<br>**Possible values:** any `int` or `float` <br>**Default value:** `30`                       | any    | Font size of the phone number displayed in the alert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `vCard`<br>**Possible values:** `string` <br> **Default value:** `false`                                        | VCF    | Absolute path to a .vcf file for number to name conversion.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `minimumCallLength`<br>**Possible values:** `time` in `seconds` <br> **Default value:** `0`                     | any    | There is no real way to tell whether a call was missed or not because voice mails count as connected calls. You can however change the time a call has to be for it to be considered not missed. You should probably use a value as long as your voice mail. <br>Default `0` means any call gets added to the history. <br>If you enter a time larger than `0`, any call that is longer than that time, is not added to the list.                                                                                                                                                                                                 |
| `password`<br>**Possible values:** `string`  <br>**Default value:** `""`                                        | API    | Password to access the FritzBox API. (**optional**)  <br>If you enter this, it directly loads your phonebook(s) and recently missed calls from the FritzBox.   <br>If you have specified a username for your access to the FritzBox, see below.  <br>You can also create a different user from the one you use for accessing the FritzBox (see this guide: [en](https://service.avm.de/help/en/FRITZ-Box-Fon-WLAN-7490/015/hilfe_system_user_konzept) / [de](https://service.avm.de/help/de/FRITZ-Box-Fon-WLAN-7490/015/hilfe_system_user_konzept)). **You will need to check _View and edit FRITZ!Box settings_ for this user.** |
| `username`<br> **Possible values:** `string`  <br>**Default value:** `""`                                       | API    | Username to access the FritzBox API. (**optional**)  <br> Specify the username if you have one set up for the FritzBox access (see password option).   <br> Leave out if you have no username (default).                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `reloadContactsInterval`<br>**Possible values:** `time` in `minutes`  <br>**Default value:** `30`               | API    | How often contacts are reloaded from the FRITZ!Box. <br> Set to 0 to disable reloading contacts, they are only loaded once after the start of the mirror.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `deviceFilter`<br>**Possible values:** `array` of `strings`  <br>**Default value:** `[]`                        | API    | You can enter the names of your real phone devices here (**optional**). You should be redirected to the list after you login [here](http://fritz.box/?lp=dectDev). <br>Example: `deviceFilter: ["firstphone", "secondphone"]`.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `showContactsStatus`<br> **Possible values:** `true` or `false`  <br> **Default value:** `false`                | any    | If no recent calls are displayed, a small symbol shows how many contacts are loaded in your phonebook.  <br> A small warning sign appears if any error occurs when importing contacts from vCard or the FRITZ!Box.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `maximumCallDistance`<br>**Possible values:** `time` in `min`  <br>**Default value:** `60`                      | any    | Time after which calls get removed from the list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `maximumCalls`<br>**Possible values:** any `int`<br>**Default value:** `5`                                      | any    | Maximum number of calls to be shown in the list.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `fritzIP`<br>**Possible values:** IP Address  <br>**Default value:** `192.168.178.1`                            | any    | IP Adress of your FRITZ!Box.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `fritzPort`<br>**Possible values:** any `int`  <br>**Default value:** `1012`                                    | any    | Port of your FRITZ!Box callmonitor (you should not have to change that)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `fade`<br>**Possible values:** `true` or `false`  <br>**Default value:** `true`                                 | any    | Fade old calls to black. (Gradient)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `fadePoint`<br>**Possible values:** `0` (top of the list) - `1` (bottom of list)  <br>**Default value:** `0.25` | any    | Where to start fade?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `debug`<br>**Possible values:** `true` or `false`  <br>**Default value:** `false`                               | any    | Should debug information be displayed in case of errors?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |


## Dependencies

- [node-fritzbox-callmonitor](https://www.npmjs.com/package/node-fritzbox-callmonitor) (installed by `npm install`)
- [phone-formatter](https://www.npmjs.com/package/phone-formatter) (installed by `npm install`)
- [python-shell](https://www.npmjs.com/package/python-shell) (installed by `npm install`)
- [vcard-json](https://www.npmjs.com/package/vcard-json) (installed by `npm install`)
- [xml2js](https://www.npmjs.com/package/xml2js): (installed by `npm install`)
- [fritzconnection](https://pypi.python.org/pypi/fritzconnection): (installed by `sudo apt-get install python-dev libxml2-dev libxslt1-dev zlib1g-dev && sudo pip install fritzconnection`)

The MIT License (MIT)
=====================

Copyright © 2016 Paul-Vincent Roll

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
