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

<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th>Method</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>numberFontSize</code></td>
			<td>any</td>
			<td>Font size of the phone number displayed in the alert.<br>
				<br><b>Possible values:</b> any <code>int</code> or <code>float</code>
				<br><b>Default value:</b> <code>30</code>
			</td>
		</tr>
		<tr>
			<td><code>vCard</code></td>
			<td>VCF</td>
			<td>Absolute path to a .vcf file for number to name conversion.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>minimumCallLength</code></td>
			<td>any</td>
			<td>There is no real way to tell whether a call was missed or not because voice mails count as connected calls. You can however change the time a call has to be for it to be considered not missed. You should probably use a value as long as your voice mail. <br>Default <code>0</code> means any call gets added to the history.<br> If you enter a time larger than `0`, any call that is longer than that time, is not added to the list.<br>
				<br><b>Possible values:</b> <code>time</code> in <code>seconds</code>
				<br><b>Default value:</b> <code>0</code>
			</td>
		</tr>
		<tr>
			<td><code>password</code></td>
			<td>API</td>
			<td>Password to access the FritzBox API. (<b>optional</b>) <br> 
			If you enter this, it directly loads your phonebook(s) and recently missed calls from the FritzBox.<br>
			If you have specified a username for your access to the FritzBox, see below. <br> <br>
			You can also create a different user from the one you use for accessing the FritzBox (see this guide: <a href="https://service.avm.de/help/en/FRITZ-Box-Fon-WLAN-7490/015/hilfe_system_user_konzept">en</a> / <a href="https://service.avm.de/help/de/FRITZ-Box-Fon-WLAN-7490/015/hilfe_system_user_konzept">de</a>). <b>You will need to check <span title="FRITZ!Box Einstellungen sehen und bearbeiten"><i>View and edit FRITZ!Box settings</i></span> for this user.</b> <br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>""</code>
			</td>
		</tr>
		<tr>
			<td><code>username</code></td>
			<td>API</td>
			<td>Username to access the FritzBox API. (<b>optional</b>)<br>
			Specify the username if you have one set up for the FritzBox access (see password option). <br>
			Leave out if you have no username (default).<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>""</code>
			</td>
		</tr>
		<tr>
			<td><code>reloadContactsInterval</code></td>
			<td>API</td>
			<td>How often contacts are reloaded from the FRITZ!Box.<br>
			Set to 0 to disable reloading contacts, they are only loaded once after the start of the mirror.
			<br>
				<br><b>Possible values:</b> <code>time</code> in <code>minutes</code>
				<br><b>Default value:</b> <code>30</code>
			</td>
		</tr>
		<tr>
			<td><code>deviceFilter</code></td>
			<td>API</td>
			<td> You can enter the names of your real phone devices here (<b>optional</b>). You should be redirected to the list after you login <a href="http://fritz.box/?lp=dectDev">here</a>. <br>
			Example: <code>deviceFilter: ["firstphone", "secondphone"]</code>.
			<br>
				<br><b>Possible values:</b> <code>array</code> of <code>strings</code>
				<br><b>Default value:</b> <code>[]</code>
			</td>
		</tr>
		<tr>
			<td><code>showContactsStatus</code></td>
			<td>any</td>
			<td>If no recent calls are displayed, a small symbol shows how many contacts are loaded in your phonebook. <br>
			A small warning sign appears if any error occurs when importing contacts from vCard or the FRITZ!Box.
			<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumCallDistance</code></td>
			<td>any</td>
			<td>Time after which calls get removed from the list.<br>
				<br><b>Possible values:</b> <code>time</code> in <code>min</code>
				<br><b>Default value:</b> <code>60</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumCalls</code></td>
			<td>any</td>
			<td>Maximum number of calls to be shown in the list.<br>
				<br><b>Possible values:</b> any <code>int</code>
				<br><b>Default value:</b> <code>5</code>
			</td>
		</tr>
		<tr>
			<td><code>fritzIP</code></td>
			<td>any</td>
			<td>IP Adress of your FRITZ!Box.<br>
				<br><b>Possible values:</b> IP Address
				<br><b>Default value:</b> <code>192.168.178.1</code>
			</td>
		</tr>
		<tr>
			<td><code>fritzPort</code></td>
			<td>any</td>
			<td>Port of your FRITZ!Box callmonitor (you should not have to change that)<br>
				<br><b>Possible values:</b> any <code>int</code>
				<br><b>Default value:</b> <code>1012</code>
			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>any</td>
			<td>Fade old calls to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>fadePoint</code></td>
			<td>any</td>
			<td>Where to start fade?<br>
				<br><b>Possible values:</b> <code>0</code> (top of the list) - <code>1</code> (bottom of list)
				<br><b>Default value:</b> <code>0.25</code>
			</td>
		</tr>
		<tr>
			<td><code>debug</code></td>
			<td>any</td>
			<td>Should debug information be displayed in case of errors?<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
	</tbody>
</table>

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
