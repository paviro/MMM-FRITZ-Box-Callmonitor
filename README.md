# MMM-FRITZ-Box-Callmonitor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides a callmonitor for FRITZ!Box users alerting them about incoming calls.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-FRITZ-Box-Callmonitor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the dependencies.
3. Activate the callmonitor of your FRITZ!Box by calling `#96*5*` on a connected phone.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-FRITZ-Box-Callmonitor',
		position: 'top_right',	// This can be any of the regions. Best results in left or right regions.
		header: "Recent calls", //This is optional
		config: {
			// See 'Configuration options' for more information.
		}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>NumberFontSize</code></td>
			<td>Font size of the phone number displayed in the alert.<br>
				<br><b>Possible values:</b> any <code>int</code> or <code>float</code>
				<br><b>Default value:</b> <code>30</code>
			</td>
		</tr>
		<tr>
			<td><code>vCard</code></td>
			<td>Absolute path to a .vcf file for number to name conversion.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
		<tr>
			<td><code>minimumCallLength</code></td>
			<td>There is no real way to tell whether a call was missed or not because voice mails count as connected calls. You can however change the time a call has to be for it to be considered not missed. You should probably use a value as long as your voice mail. <br>Default <code>0</code> means any call gets added to the history.<br>
				<br><b>Possible values:</b> <code>time</code> in <code>seconds</code>
				<br><b>Default value:</b> <code>0</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumCallDistance</code></td>
			<td>Time after which calls get removed from the list.<br>
				<br><b>Possible values:</b> <code>time</code> in <code>min</code>
				<br><b>Default value:</b> <code>60</code>
			</td>
		</tr>
		<tr>
			<td><code>maximumCalls</code></td>
			<td>Maximum number of calls to be shown in the list.<br>
				<br><b>Possible values:</b> any <code>int</code>
				<br><b>Default value:</b> <code>5</code>
			</td>
		</tr>
		<tr>
			<td><code>fritzIP</code></td>
			<td>IP Adress of your FRITZ!Box.<br>
				<br><b>Possible values:</b> IP Address
				<br><b>Default value:</b> <code>192.168.178.1</code>
			</td>
		</tr>
		<tr>
			<td><code>fritzPort</code></td>
			<td>Port of your FRITZ!Box callmonitor (you should not have to change that)<br>
				<br><b>Possible values:</b> any <code>int</code>
				<br><b>Default value:</b> <code>1012</code>
			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>Fade the future events to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>fadePoint</code></td>
			<td>Where to start fade?<br>
				<br><b>Possible values:</b> <code>0</code> (top of the list) - <code>1</code> (bottom of list)
				<br><b>Default value:</b> <code>0.25</code>
			</td>
		</tr>
	</tbody>
</table>

## Dependencies
- [node-fritzbox-callmonitor](https://www.npmjs.com/package/node-fritzbox-callmonitor) (installed by `npm install`)
- [vcard-json](https://www.npmjs.com/package/vcard-json) (installed by `npm install`)
- [phone-formatter](https://www.npmjs.com/package/phone-formatter) (installed by `npm install`)