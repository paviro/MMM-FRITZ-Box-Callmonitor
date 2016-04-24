# MMM-FRITZ-Box-Callmonitor
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides a callmonitor for FRITZ!Box users alerting them about incoming calls.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/paviro/MMM-FRITZ-Box-Callmonitor.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the dependencies.
3. Activate the callmonitor of your FRITZ!Box by calling `#96*5*` on a connected phone.

## Usage
The entry in the `module array` in your `config.js` can look like the following. (NOTE: You only have to add the variables to config if want to change its standard value.)

```
{
	module: 'MMM-FRITZ-Box-Callmonitor',
	config: {
		//Font size of the phonenumber displayed in the alert
		NumberFontSize: "30px",
		//Path to a .vcf file for number to name conversion
		vCard: false,
		//IP Adress of your FRITZ!Box
		fritzIP: '192.168.178.1',
		//Port of your FRITZ!Box (you should not have to change that)
		fritzPort: 1012
	}
}
```

## Dependencies
- [node-fritzbox-callmonitor](https://www.npmjs.com/package/node-fritzbox-callmonitor) (installed by `npm install`)