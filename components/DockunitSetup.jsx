'use strict';

import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores} from 'fluxible-addons-react';
import updateShowDockunitSetup from '../actions/updateShowDockunitSetup';

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

				<p>Dockunit is an extremely versatile and is easy to setup once you get the hang of it. There are three major parts to this tutorial:</p>

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
	render() {
		return (
			<div>
				<h2>Setting Up a Project with Dockunit.josn</h2>

				<p>Running Dockunit locally allows you to run your test suite on your local computer. This setup assumes you have already setup Docker.</p>

				<p>
					OSX
					Windows
					Linux Distro
				</p>
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
    	section: 'Start'
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
        this.context.executeAction(updateShowDockunitSetup, false);
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
									<Handler changeSection={this.changeSection} />
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
