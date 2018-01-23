# twyc
<h1>Prerequisites</h1>
<ul>
<li>Mongodb</li>
<li>Node.js</li>
<li>npm</li>
</ul>
<h1>Step 1</h1>
<ul>
<li>
	<code>git clone ...</code>
</li>
<li>
	<code>cd twyc</code>
</li>
<li>
	<code>npm install</code>
</li>
</ul>
<h1>Step 2</h1>
<ul>
<li>
	Create the config file (<strong>server/_config/index.js</strong>)<br /><br />
	<code>
		const mongo = { host: '<i>Path to mongodb (ex. localhost)</i>',
    	db: 'twyc'
		};
		module.exports = { 
    	mongo
		};
	</code>
</li>
</ul>
<h1>Step 3</h1>
<ul>
	<li>Create an environment variable called 'TWYC_SECRET'<br /><br />
		This can be faked in development only by creating the following file: (<strong>server/_helpers/env.js</strong>) with the following info:<br /><br />
		<code>process.env['TWYC_SECRET'] = '<i>Your own secret code goes here</i>';</code>
	</li>
</ul>
<h1>Step 4</h1>
<code>npm start</code>
