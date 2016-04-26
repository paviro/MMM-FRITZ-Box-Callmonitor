# MMM-vCard-Addressbook
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It provides a callmonitor for FRITZ!Box users alerting them about incoming calls.
![call](https://cloud.githubusercontent.com/assets/992826/14791014/3febe6b4-0b14-11e6-89d8-160a7c459835.png)


## Installation
1. Navigate into your MagicMirror's `modules` folder.
2. Execute `git clone https://github.com/paviro/MMM-vCard-Addressbook.git`.
3. Navigate into `MMM-vCard-Addressbook`.
4. Execute `npm install` to install the dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-vCard-Addressbook',
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
			<td><code>vCard</code></td>
			<td>Absolute path to a .vcf file for number to name conversion.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>false</code>
			</td>
		</tr>
	</tbody>
</table>

## Dependencies
- [vcard-json](https://www.npmjs.com/package/vcard-json) (installed by `npm install`)
- [phone-formatter](https://www.npmjs.com/package/phone-formatter) (installed by `npm install`)

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
