'use strict';

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores} from 'fluxible-addons-react';
import updateShowDockunitSetup from '../actions/updateShowDockunitSetup';
import If from './If';
import DockunitGenerator from '../clients/DockunitGenerator';
import InputField from './InputField';
import SelectField from './SelectField';
import _ from 'lodash';

class Start extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.changeSection = this.changeSection.bind(this);
    }

	changeSection(event) {
		event.preventDefault();

		this.props.changeSection(event);
	}

	render() {
		return (
			<div>
				<h2>Setting Up Dockunit on a Project</h2>

				<p>Dockunit is an extremely versatile and is easy to setup once you get the hang of it. This tutorial will get you completely up-and-running with Dockunit locally and project testing.</p>

				<ul>
					<li><a data-handler="Introduction" onClick={this.changeSection} href="#Introduction">Introduction to Dockunit</a></li>
					<li><a data-handler="DockunitLocalSetup" onClick={this.changeSection} href="#DockunitLocalSetup">(Optional) Setting up the Dockunit command line utility locally</a></li>
					<li><a data-handler="DockunitjsonCreate" onClick={this.changeSection} href="#DockunitjsonCreate">Setting up Dockunit on a project by creating a Dockunit.json file.</a></li>

				</ul>
			</div>
		);
	}
}

class Introduction extends React.Component {
	render() {
		return (
			<div>
				<h2>Introduction to Dockunit</h2>

				<p>There are a few major points your should understand before using Dockunit.</p>

				<p><strong>What does Dockunit do?</strong></p>

				<p>Dockunit allows you to test your software across a variety of Docker containers. We provide standard Docker containers to use or you can create you own.</p>

				<p><strong>What is Docker?</strong></p>

				<p>Docker is a utlity for running containerized environments kind of like Virtual Box or 
				HyperV. Basically, Docker lets you run different operating systems and environments inside 
				your local machine. Docker lets you create your own environments or containers. You can easily 
				share your Docker containers as well as use predefined ones.</p>

				<p><strong>Getting Started</strong></p>

				<p>In order to use Dockunit, you will want to install Docker, and Dockunit locally (npm 
					package). You will then need to add a Dockunit.json file to your project. Dockunit.json 
				files tell Dockunit what Docker containers to use and how to test your software. Once you've 
				setup your project, you will want to add it to Dockunit.io. Dockunit.io is a continuous integration 
				service for testing your software continuouly when there are pushes or merges on Github.</p>
			</div>
		);
	}
}

class DockunitLocalSetup extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.changeEnvironment = this.changeEnvironment.bind(this);
    }

    state = {
		environment: 'osx'
	}

	changeEnvironment(event) {
		this.setState({ environment: event.target.getAttribute('data-environment') });
	}

	render() {

		return (
			<div>
				<h2>Installing Dockunit Locally</h2>

				<p>Running Dockunit locally allows you to run your test suite on your local computer.</p>

				<div className="btn-group" role="group" aria-label="...">
					<button data-environment="osx" onClick={this.changeEnvironment} type="button" className={'btn btn-default ' + (('osx' === this.state.environment) ? 'active' : '')}>Mac OS X</button>
					<button data-environment="windows" onClick={this.changeEnvironment} type="button" className={'btn btn-default ' + (('windows' === this.state.environment) ? 'active' : '')}>Windows</button>
					<button data-environment="ubuntu" onClick={this.changeEnvironment} type="button" className={'btn btn-default ' + (('ubuntu' === this.state.environment) ? 'active' : '')}>Ubuntu</button>
					<button data-environment="other" onClick={this.changeEnvironment} type="button" className={'btn btn-default ' + (('other' === this.state.environment) ? 'active' : '')}>Other</button>
				</div>

				<p>Running Dockunit locally requires Docker. Docker is a utility for running containerized environments.</p>

				<h3>Install Docker</h3>

				<p><em>Skip this section if you have Docker installed</em></p>

				<div className={'environment ' + (('osx' === this.state.environment) ? 'show' : '')}>

					<p>If you have VirtualBox running, you must shut it down before running the installer.</p>

					<ol>
						<li>
							<p>Go to the <a href="https://www.docker.com/toolbox">Docker Toolbox</a> page.</p>
						</li>

						<li>
							<p>Click the installer link to download.</p>
						</li>

						<li>
							<p>Install Docker Toolbox by double-clicking the package or by right-clicking and choosing "Open" from the pop-up menu.</p>

							<p>The installer launches the "Install Docker Toolbox" dialog.</p>
						</li>

						<li>
							<p>Press “Continue” to install the toolbox.</p>

							<p>The installer presents you with options to customize the standard installation.</p>
						</li>


						<li>
							<p>By default, the standard Docker Toolbox installation:</p>

							<ul>
								<li>installs binaries for the Docker tools in /usr/local/bin</li>
								<li>makes these binaries available to all users</li>
								<li>updates any existing VirtualBox installation</li>
							</ul>

							<p>Change these defaults by pressing “Customize” or "Change Install Location."</p>
						</li>

						<li>
							<p>Press “Install” to perform the standard installation.</p>

							<p>The system prompts you for your password.</p>
						</li>

						<li>
							<p>Provide your password to continue with the installation.</p>
						</li>
						<li>
							<p>Done!</p>
						</li>
					</ol>

					<p>These instructions are pulled from the official <a href="https://docs.docker.com/installation/mac/">Docker Mac OS X install</a> page.</p>
				
					<h3>Install Node.js and npm</h3>

					<p><em>Skip this section if you have Node.js and npm installed</em></p>

					<ol>
						<li>
							<p>Go to the <a href="https://nodejs.org">Node.js homepage</a>, and click the big install button. It should detect that you are running Mac OSX. This installer will install Node.js and npm.</p>
						</li>
						<li>
							<p>Test your installation by opening up the terminal and running:</p>
							<p>
								<pre>
								$ node<br />
								> console.log('hello node');<br />
								hello node
								</pre>
							</p>

							<p>If you see <em>hello node</em> outputted, it works! Press ctrl+c to exit the node terminal. Iff not, go to the <a href="https://nodejs.org/en/download">Node.js download page</a> and try reinstalling.</p>
						</li>

						<li>
							<p>Test that npm is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ npm -v<br />
								1.x.x
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, go to the <a href="https://docs.npmjs.com/getting-started/installing-node">npm/Node.js install page</a> and try reinstalling.</p>
						</li>
					</ol>

					<h3>Install Dockunit Package</h3>

					<ol>
						<li>
							<p>Open up a terminal and run:</p>
							<p>
								<pre>
								$ npm install -g dockunit
								</pre>
							</p>
						</li>

						<li>
							<p>Test that Dockunit is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ dockunit --version<br />
								Dockunit x.x.x by Taylor Lovett
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, you probably installed Node.js or npm incorrectly. You can also try putitng <em>sudo</em> before <em>npm install</em>.</p>
						</li>
					</ol>

					<p>That's it. You're done! Dockunit is now setup properly on your local machine.</p>
				</div>

				<div className={'environment ' + (('windows' === this.state.environment) ? 'show' : '')}>
					<p>Before starting, make sure your Windows system supports Hardware Virtualization Technology and that virtualization is enabled.</p>

					<ol>
						<li>
							<p>Go to the Docker Toolbox page.</p>
						</li>

						<li>
							<p>Click the installer link to download.</p>
						</li>

						<li>
							<p>Install Docker Toolbox by double-clicking the installer.</p>

							<p>The installer launches the “Setup - Docker Toolbox” dialog.</p>
						</li>

						<li>
							<p>Press “Next” to install the toolbox.</p>

							<p>The installer presents you with options to customize the standard installation. By default, the standard Docker Toolbox installation:</p>

							<ul>
								<li>installs executables for the Docker tools in C:\Program Files\Docker Toolbox</li>
								<li>updates any existing VirtualBox installation</li>
								<li>adds a Docker Inc. folder to your program shortcuts</li>
								<li>updates your PATH environment variable</li>
								<li>adds desktop icons for the Docker Quickstart Terminal and Kitematic</li>
							</ul>

							<p>This installation assumes the defaults are acceptable.</p>
						</li>

						<li>
							<p>Press “Next” until you reach the “Ready to Install” page.</p>

							<p>The system prompts you for your password.</p>
						</li>

						<li>
							<p>Press “Install” to continue with the installation.</p>
						</li>

						<li>
							<p>Done!</p>
						</li>
					</ol>

					<p>These instructions are pulled from the official <a href="https://docs.docker.com/installation/windows/">Docker Windows install</a> page.</p>

					<h3>Install Node.js and npm</h3>

					<p><em>Skip this section if you have Node.js and npm installed</em></p>

					<ol>
						<li>
							<p>Go to the <a href="https://nodejs.org">Node.js homepage</a>, and click the big install button. It should detect that you are running Windows. This installer will install Node.js and npm.</p>
						</li>
						<li>
							<p>Test your installation by opening up the terminal and running:</p>
							<p>
								<pre>
								C:\Users\User\Documents> node<br />
								> console.log('hello node');<br />
								hello node
								</pre>
							</p>

							<p>If you see <em>hello node</em> outputted, it works!</p>
						</li>

						<li>
							<p>Test that npm is working by opening up the terminal and running:</p>
							<p>
								<pre>
								C:\Users\User\Documents> npm -v<br />
								1.x.x
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, go to the <a href="https://docs.npmjs.com/getting-started/installing-node">npm/Node.js install page</a> and try reinstalling.</p>
						</li>
					</ol>

					<h3>Install Dockunit Package</h3>

					<ol>
						<li>
							<p>Open up a terminal and run:</p>
							<p>
								<pre>
								C:\Users\User\Documents> npm install -g dockunit
								</pre>
							</p>
						</li>

						<li>
							<p>Test that Dockunit is working by opening up the terminal and running:</p>
							<p>
								<pre>
								C:\Users\User\Documents> dockunit --version<br />
								Dockunit x.x.x by Taylor Lovett
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, try adding "C:\Users\User\AppData\Roaming\npm" (where User is your username) to your path. If this doesn't work, you probably installed Node.js or npm incorrectly.</p>
						</li>
					</ol>

					<p>That's it. You're done! Dockunit is now setup properly on your local machine.</p>
				</div>

				<div className={'environment ' + (('ubuntu' === this.state.environment) ? 'show' : '')}>
					<ol>

						<li>
							<p>Log into your Ubuntu installation as a user with sudo privileges.</p>
						</li>

						<li>
							<p>Update your apt package index.</p>

							<p><pre>$ sudo apt-get update</pre></p>
						</li>

						<li>
							<p>Install Docker</p>

							<p><pre>$ sudo apt-get install docker-engine</pre></p>
						</li>

						<li>
							<p>Verify docker is installed correctly.</p>

							<p><pre>$ sudo docker run hello-world</pre></p>

							<p>This command downloads a test image and runs it in a container. When the container runs, it prints an informational message. Then, it exits.</p>
						</li>
					</ol>

					<p>These instructions are pulled from the official <a href="https://docs.docker.com/installation/ubuntulinux/">Ubuntu install</a> page.</p>
				
					<h3>Install Node.js and npm</h3>

					<p><em>Skip this section if you have Node.js and npm installed</em></p>

					<ol>
						<li>
							<p>Run the following commands in your terminal:</p>

							<p>
								<pre>
									$ sudo apt-get update<br />
									$ sudo apt-get install nodejs<br />
									$ sudo apt-get install npm<br />
									$ sudo ln -s "$(which nodejs)" /usr/bin/node
								</pre>
							</p>
						</li>
						<li>
							<p>Test your installation by running the following in the terminal:</p>
							<p>
								<pre>
								$ node<br />
								> console.log('hello node');<br />
								hello node
								</pre>
							</p>

							<p>If you see <em>hello node</em> outputted, it works!</p>
						</li>

						<li>
							<p>Test that npm is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ npm -v<br />
								1.x.x
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, go to the <a href="https://docs.npmjs.com/getting-started/installing-node">npm/Node.js install page</a> and try reinstalling.</p>
						</li>
					</ol>

					<h3>Install Dockunit Package</h3>

					<ol>
						<li>
							<p>Open up a terminal and run:</p>
							<p>
								<pre>
								$ npm install -g dockunit
								</pre>
							</p>
						</li>

						<li>
							<p>Test that Dockunit is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ dockunit --version<br />
								Dockunit x.x.x by Taylor Lovett
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, you probably installed Node.js or npm incorrectly. You can also try putitng <em>sudo</em> before <em>npm install</em>.</p>
						</li>
					</ol>

					<p>That's it. You're done! Dockunit is now setup properly on your local machine.</p>

				</div>

				<div className={'environment ' + (('other' === this.state.environment) ? 'show' : '')}>
					<p>Follow instructions on the <a href="https://docs.docker.com/installation/">Docker installation</a> page to install Docker.</p>
				
					<h3>Install Node.js and npm</h3>

					<p><em>Skip this section if you have Node.js and npm installed</em></p>

					<ol>
						<li>
							<p>Go to the <a href="https://nodejs.org/en/download">Node.js download page</a>. Find the installer that matches your environment.</p>
						</li>
						<li>
							<p>Run the installer you downloaded.</p>
						</li>
						<li>
							<p>Test your Node.js installation by opening up the terminal and running:</p>
							<p>
								<pre>
								$ node<br />
								> console.log('hello node');<br />
								hello node
								</pre>
							</p>

							<p>If you see <em>hello node</em> outputted, it works! If not, go to the <a href="https://nodejs.org/en/download">Node.js download page</a> and try reinstalling.</p>
						</li>

						<li>
							<p>Test that npm is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ npm -v<br />
								1.x.x
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, go to the <a href="https://docs.npmjs.com/getting-started/installing-node">npm/Node.js install page</a> and try reinstalling.</p>
						</li>
					</ol>

					<h3>Install Dockunit Package</h3>

					<ol>
						<li>
							<p>Open up a terminal and run:</p>
							<p>
								<pre>
								$ npm install -g dockunit
								</pre>
							</p>
						</li>

						<li>
							<p>Test that Dockunit is working by opening up the terminal and running:</p>
							<p>
								<pre>
								$ dockunit --version<br />
								Dockunit x.x.x by Taylor Lovett
								</pre>
							</p>

							<p>If you see a version number outputted, it works! If not, you probably installed Node.js or npm incorrectly. You can also try putitng <em>sudo</em> before <em>npm install</em>.</p>
						</li>
					</ol>

					<p>That's it. You're done! Dockunit is now setup properly on your local machine.</p>
				</div>

			</div>
		);
	}
}

class DockunitjsonCreate extends React.Component {
	constructor(props, context) {
        super(props, context);

        this.handleFormChange = this.handleFormChange.bind(this);
        this.generate = this.generate.bind(this);
        this.validateRequired = this.validateRequired.bind(this);
        this.validate = this.validate.bind(this);
        this.onGenerate = this.onGenerate.bind(this);
    }

    state = {
		language: {
			value: (this.props.repository && this.props.repository.language) ? this.props.repository.language.toLowerCase() : 'php',
			errors: {},
			validators: [this.validateRequired('language')]
		},
		unitTests: {
			value: null,
			errors: {},
			validators: [this.validateRequired('unitTests')]
		},
		beforeScripts: {
			value: null,
			errors: {},
			validators: [this.validateRequired('beforeScripts')]
		},
		languageVersions: {
			value: null,
			errors: {},
			validators: [this.validateRequired('languageVersions')]
		},
		testCommand: {
			value: null,
			errors: {},
			validators: [this.validateRequired('testCommand')]
		},
		framework: {
			value: null,
			errors: {},
			validators: [this.validateRequired('framework')]
		},
		wpMainPluginFile: {
			value: null,
			errors: {},
			validators: [this.validateRequired('wpMainPluginFile')]
		},
		wpThemePlugin: {
			value: null,
			errors: {},
			validators: [this.validateRequired('wpThemePlugin')]
		},
		generated: false
	}

	onGenerate() {
		var self = this;

		var errors = {};

		['language', 'unitTests', 'languageVersions', 'framework'].forEach(function(field) {
			var newErrors = self.validate.call(self, field)();
			errors = _.extend(errors, newErrors);
		});

		if (true === self.state.unitTests) {
			['testCommand'].forEach(function(field) {
				var newErrors = self.validate.call(self, field)();
				errors = _.extend(errors, newErrors);
			});
		} else {
			if ('WordPress' === self.state.framework) {
				['wpThemePlugin'].forEach(function(field) {
					var newErrors = self.validate.call(self, field)();
					errors = _.extend(errors, newErrors);
				});

				if ('plugin' === self.state.wpThemePlugin) {
					['wpMainPluginFile'].forEach(function(field) {
						var newErrors = self.validate.call(self, field)();
						errors = _.extend(errors, newErrors);
					});
				}
			} else {
				['testCommand'].forEach(function(field) {
					var newErrors = self.validate.call(self, field)();
					errors = _.extend(errors, newErrors);
				});
			}
		}

		if (Object.keys(errors).length) {
			return false;
		}

		return this.generate();
	}

	validate(field) {
		var self = this;

		return function() {
			var validators = self.state[field].validators,
				errors = {};

			if (validators.length) {
				for (let i = 0; i < validators.length; i++) {
					errors = _.extend(errors, validators[i].call(self));
				}
			}

			var newState = {};
			newState[field] = _.extend({}, self.state[field]);

			if (errors.required) {
				newState[field].errors = {};
				newState[field].errors.required = errors.required;
			} else {
				newState[field].errors = errors;
			}

			self.setState(newState);

			return newState[field].errors;
		};
	}

	generate() {
		let generated = DockunitGenerator.generate({
			language: this.state.language.value,
			unitTests: this.state.unitTests.value,
			beforeScripts: this.state.beforeScripts.value,
			languageVersions: this.state.languageVersions.value,
			testCommand: this.state.testCommand.value,
			framework: this.state.framework.value,
			wpMainPluginFile: this.state.wpMainPluginFile.value,
			wpThemePlugin: this.state.wpThemePlugin.value
		});

		this.setState({ generated: generated });
	}

	handleFormChange(event) {
		let object = { generated: false };

		object[event.target.name] = _.extend({}, this.state[event.target.name]);
		object[event.target.name].value = event.target.value;

		if ('Yes' === object[event.target.name].value) {
			object[event.target.name].value = true;
		} else if ('No' === object[event.target.name].value) {
			object[event.target.name].value = false;
		} else if ('Choose' === object[event.target.name].value) {
			object[event.target.name].value = null;
		}

		if (event.target.multiple) {
			object[event.target.name].value = [];

			for (var i = 0; i < event.target.options.length; i++) {
				if (event.target.options[i].selected) {
					object[event.target.name].value.push(event.target.options[i].value);
				}
			}
		}

		this.setState(object);
	}

	changeUnitTests(event) {
		this.setState({ unitTests: !!parseInt(event.target.value), generated: false });
	}

	changeUpdateBeforeScripts(event) {
		let scripts = event.target.value.split("\n");
		this.setState({ beforeScripts: scripts, generated: false });
	}

	validateRequired(field) {
		var self = this;

		return function() {
			var errors = {};

			if (null === self.state[field].value) {
				errors.required = 'This field is required.';
			}

			return errors;
		};
	}

	render() {
		console.log(this.state);
		return (
			<div>
				<h2>Creating a Dockunit.json File</h2>

				<p>This tutorial will ask you a number of questions to guide you in creating a Dockunit.json file. <em>Note: Dockunit supports ALL programming languages and environments. If your language or environment isn't shown below, you can easily just create your own Dockunit.json file.</em></p>

				<p className="required"><strong>What is the primary coding language of your project?</strong></p>

				<div className="btn-group" role="group" aria-label="...">
					<button name="language" data-language="php" onClick={this.handleFormChange} type="button" className={'btn btn-default ' + (('php' === this.state.language.value) ? 'active' : '')}>PHP</button>
					
					<If test={false}>
						<div>
							<button name="language" data-language="nodejs" onClick={this.handleFormChange} type="button" className={'btn btn-default ' + (('nodejs' === this.state.language.value) ? 'active' : '')}>Node.js</button>
							<button name="language" data-language="python" onClick={this.handleFormChange} type="button" className={'btn btn-default ' + (('python' === this.state.language.value) ? 'active' : '')}>Python</button>
							<button name="language" data-language="java" onClick={this.handleFormChange} type="button" className={'btn btn-default ' + (('java' === this.state.language.value) ? 'active' : '')}>Java</button>
							<button name="language" data-language="ruby" onClick={this.handleFormChange} type="button" className={'btn btn-default ' + (('ruby' === this.state.language.value) ? 'active' : '')}>Ruby</button>
						</div>
					</If>
				</div>

				<If test={'php' === this.state.language.value}>
					<div>
						<p><em>By default a PHP container will contain the following:</em></p>
						<ul>
							<li>MySQL</li>
							<li>Git and Subversion</li>
							<li>Composer</li>
							<li>wget</li>
						</ul>
					</div>
				</If>

				<If test={'nodejs' === this.state.language.value}>
					<div>
						<p><em>By default a PHP container will contain the following:</em></p>
						<ul>
							<li>MongoDB</li>
							<li>Git and Subversion</li>
							<li>wget</li>
							<li>PHPUnit</li>
						</ul>
					</div>
				</If>

				<If test={'python' === this.state.language.value}>
					<div>
						<p><em>By default a Python container will contain the following:</em></p>
						<ul>
							<li>PostgreSQL</li>
							<li>Git and Subversion</li>
							<li>wget</li>
						</ul>
					</div>
				</If>

				<If test={'php' === this.state.language.value}>
					<SelectField
						label="What framework/CMS are you using"
						name="framework"
						onChange={this.handleFormChange}
						className="form-control"
						id="framework"
						required={true}
						options={['Choose', 'WordPress', 'Other/None']}
						errors={this.state.framework.errors}
					/>
				</If>

				<If test={'python' === this.state.language.value}>
					<SelectField
						label="What framework/CMS are you using"
						name="framework"
						onChange={this.handleFormChange}
						className="form-control"
						id="framework"
						required={true}
						options={['Choose', 'Django', 'Other/None']}
						errors={this.state.framework.errors}
					/>
				</If>

				<If test={'nodejs' === this.state.language.value}>
					<SelectField
						label="What framework/CMS are you using"
						name="framework"
						onChange={this.handleFormChange}
						className="form-control"
						id="framework"
						required={true}
						options={['Choose', 'Meteor', 'Other/None']}
						errors={this.state.framework.errors}
					/>
				</If>

				<If test={'ruby' === this.state.language.value}>
					<SelectField
						label="What framework/CMS are you using"
						name="framework"
						onChange={this.handleFormChange}
						className="form-control"
						id="framework"
						required={true}
						options={['Choose', 'Rails', 'Other/None']}
						errors={this.state.framework.errors}
					/>
				</If>

				<If test={'php' === this.state.language.value}>
					<SelectField
						label="What PHP versions do you want to test"
						name="languageVersions"
						onChange={this.handleFormChange}
						className="form-control"
						id="languageVersions"
						multiple={true}
						required={true}
						options={['7.0.x', '5.6.x', '5.2.x']}
						errors={this.state.languageVersions.errors}
					/>
				</If>

				<If test={'python' === this.state.language.value}>
					<SelectField
						label="What Python versions do you want to test"
						name="languageVersions"
						onChange={this.handleFormChange}
						className="form-control"
						id="languageVersions"
						multiple={true}
						required={true}
						options={['2.7.x', '3.5.x']}
						errors={this.state.languageVersions.errors}
					/>
				</If>

				<SelectField
					label="Does your project contain unit or integration tests"
					name="unitTests"
					onChange={this.handleFormChange}
					className="form-control"
					id="unitTests"
					required={true}
					options={['Choose', 'Yes', 'No']}
					errors={this.state.unitTests.errors}
				/>

				<If test={true === this.state.unitTests.value}>
					<div>
						<InputField
							label="Provide Unix commands needed to install/start additional unit/integration test dependancies (one command per line)"
							name="beforeScripts"
							onChange={this.handleFormChange}
							className="form-control"
							id="beforeScripts"
							type="textarea"
							rows={4}
							errors={this.state.beforeScripts.errors}
						/>

						<span className="help-block">
							* Commands must be Debian based<br />
							* Scripts run from the root of your project<br /><br />
							
							<strong>Example:</strong><br />
							apt-get install elasticsearch<br />
							./my-bootstrap-script<br /><br />

							<strong>Note:</strong> Services like MySQL and MongoDB needed to be started before they can be used.
						</span>
					</div>
				</If>

				<If test={false === this.state.unitTests.value}>
					<div>
						<InputField
							label="List any Unix commands to run before testing your application (one command per line)"
							name="beforeScripts"
							onChange={this.handleFormChange}
							className="form-control"
							id="beforeScripts"
							type="textarea"
							rows={4}
							errors={this.state.beforeScripts.errors}
						/>

						<span className="help-block">
							* Commands must be Debian based<br />
							* Scripts run from the root of your project<br /><br />
							
							<strong>Example:</strong><br />
							apt-get install elasticsearch<br />
							<span className={'initial-hide ' + (('nodejs' === this.state.language.value) ? 'show' : '')}>
								npm install
							</span>

							<span className={'initial-hide ' + (('php' === this.state.language.value) ? 'show' : '')}>
								composer install
							</span>
							./my-bootstrap-script<br /><br />

							<strong>Note:</strong> Services like MySQL and MongoDB needed to be started before they can be used.
						</span>
					</div>
				</If>

				<If test={true === this.state.unitTests.value}>
					<div>
						<InputField
							label="What is the command to run your test suite"
							name="testCommand"
							onChange={this.handleFormChange}
							className="form-control"
							id="testCommand"
							required={true}
							errors={this.state.testCommand.errors}
						/>

						<span className="help-block">
							<strong>Example:</strong><br />

							<span className={'initial-hide ' + (('php' === this.state.language.value) ? 'show' : '')}>
								phpunit
							</span>

							<span className={'initial-hide ' + (('nodejs' === this.state.language.value) ? 'show' : '')}>
								mocha
							</span>

							<span className={'initial-hide ' + (('python' === this.state.language.value) ? 'show' : '')}>
								bin/command.py
							</span>

							<span className={'initial-hide ' + (('ruby' === this.state.language.value) ? 'show' : '')}>
								bin/command.rb
							</span>
						</span>

						<button type="button" onClick={this.generate} className="btn btn-primary btn-lg btn-block">Create Dockunit.json</button>
					</div>
				</If>

				<If test={false === this.state.unitTests.value}>
					<div>
						<If test={'WordPress' === this.state.framework.value}>
							<div>
								<SelectField
									label="Is this a theme or plugin"
									name="wpThemePlugin"
									onChange={this.handleFormChange}
									className="form-control"
									required={true}
									id="wpThemePlugin"
									options={['Choose', 'Theme', 'Plugin']}
									errors={this.state.unitTests.errors}
								/>
							</div>
						</If>

						<If test={'Plugin' === this.state.wpThemePlugin.value}>
							<div>
								<InputField
									label="What is the name of the main plugin file"
									name="wpMainPluginFile"
									required={true}
									onChange={this.handleFormChange}
									className="form-control"
									id="wpMainPluginFile"
									errors={this.state.wpMainPluginFile.errors}
								/>

								<span className="help-block">
									<strong>Example:</strong><br />
									my-plugin-file.php
								</span>

								<button type="button" onClick={this.generate} className="btn btn-primary btn-lg btn-block">Create Dockunit.json</button>
							</div>
						</If>

						<If test={'Theme' === this.state.wpThemePlugin.value}>
							<button type="button" onClick={this.generate} className="btn btn-primary btn-lg btn-block">Create Dockunit.json</button>
						</If>

						<If test={'WordPress' !== this.state.framework.value}>
							<div>
								<InputField
									label="What command can be run to test your application? Perhaps just executing the main file"
									name="testCommand"
									required={true}
									onChange={this.handleFormChange}
									className="form-control"
									id="testCommand"
									errors={this.state.testCommand.errors}
								/>

								<span className="help-block">
									<strong>Example:</strong><br />

									<If test={'php' === this.state.language.value}>
										<span>php bin/command.php</span>
									</If>

									<If test={'nodejs' === this.state.language.value}>
										<span>node bin/command.js</span>
									</If>

									<If test={'python' === this.state.language.value}>
										<span>python bin/command.py</span>
									</If>

									<If test={'ruby' === this.state.language.value}>
										<span>ruby bin/command.rb</span>
									</If>
								</span>

								<button type="button" onClick={this.onGenerate} className="btn btn-primary btn-lg btn-block">Create Dockunit.json</button>
							</div>
						</If>
					</div>
				</If>

				<If test={this.state.generated !== false}>
					<div className="generate">
						<p>Create a file in the root of your project called <strong>Dockunit.json</strong>. Paste the following code into the file and commit it to your Github repository:</p>

						<textarea className="form-control" rows="6">{JSON.stringify(this.state.generated)}</textarea>
					</div>
				</If>
			</div>
		);
	}
}

let routes = {
	Start: {
		handler: Start,
		title: 'Start'
	},

	Introduction: {
		handler: Introduction,
		title: 'Introduction'
	},

	DockunitLocalSetup: {
		handler: DockunitLocalSetup,
		title: 'Setting Up Dockunit Locally'
	},

	DockunitjsonCreate: {
		handler: DockunitjsonCreate,
		title: 'Creating a Dockunit.json File'
	}
}

@connectToStores(['ApplicationStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState()
}))
class DockunitSetup extends React.Component {

	constructor(props, context) {
        super(props, context);

        this.changeSection = this.changeSection.bind(this);
        this.toggleShowDockunitSetup = this.toggleShowDockunitSetup.bind(this);
    }

    static contextTypes = {
        getStore: React.PropTypes.func,
        executeAction: React.PropTypes.func
    }

    state = {
    	section: (this.props.section) ? this.props.section : 'Start'
    }

	changeSection(event) {
		event.preventDefault();

		let handler = 'Start';

		Object.keys(routes).forEach(function(section) {
			if (section === event.target.getAttribute('data-handler')) {
				handler = section;
			}
		});

		this.setState({ section: handler });
	}

	toggleShowDockunitSetup() {
        this.context.executeAction(updateShowDockunitSetup, {
        	showDockunitSetup: false,
        	repository: null
        });
    }

	render() {
		let Handler = routes[this.state.section].handler;

		let menuHTML = Object.keys(routes).map(function(section) {
			let className = '';

			if (this.state.section === section) {
				className = 'active';
			}

			return (
				<li className={className}><a href={'#' + section} data-handler={section} onClick={this.changeSection}>{routes[section].title}</a></li>
			);
		}, this);

		let repository = this.props.ApplicationStore.dockunitSetupRepository;

		return (
			<div className="dockunit-setup">
				<div className="overlay"></div>
				<div className="dialog">
					<button type="button" className="close" onClick={this.toggleShowDockunitSetup} aria-label="Close"><span aria-hidden="true">×</span></button>
					<div className="box">
						<div className="table">
							<div className="wrap">
								<ul className="menu">
									{menuHTML}
								</ul>

								<div className="content">
									<Handler repository={repository} changeSection={this.changeSection} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default DockunitSetup;
