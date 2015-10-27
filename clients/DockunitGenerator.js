'use strict';

class Generator {
	generate(params) {
		let file = {
			containers: []
		};

		let versionMap = {
			'5.2.x': '5.2',
			'5.6.x': '5.6',
			'7.0.x': '7.0-rc-1'
		};

		params.languageVersions.forEach(function(version) {
			let tag = '',
				testCommand = '';

			if (true === params.unitTests) {
				testCommand = params.testCommand;
			} else {
				if ('WordPress' === framework) {
					
				} else {
					testCommand = params.testCommand;
					tag = 'php-mysql-phpunit-' + versionMap[version] + '-fpm';
				}
			}

			let container = {
				prettyName: params.language + ' ' + versionMap[version],
				image: 'dockunit/prebuilt-images:' + tag,
				testCommand: testCommand
			};

			if (params.beforeScripts && params.beforeScripts.trim()) {
				container.beforeScripts = params.beforeScripts.trim().split("\n")
			}

			file.containers.push(container);
		});

		return file;
	}
}

export default new Generator;
