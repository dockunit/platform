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
				testCommand = '',
				beforeScripts = [];


			if (params.beforeScripts && params.beforeScripts.trim()) {
				beforeScripts = params.beforeScripts.trim().split("\n")
			}

			if (true === params.unitTests) {
				testCommand = params.testCommand;

				tag = 'php-mysql-phpunit-' + versionMap[version] + '-fpm';
			} else {
				if ('WordPress' === framework) {
					tag = 'php-mysql-phpunit-wordpress-' + versionMap[version] + '-fpm';

					if ('Plugin' === params.wpThemePlugin) {
						if ('5.2' === versionMap[version]) {
							testCommand = 'wp-activate-plugin ' + params.wpMainPluginFile;

							beforeScripts = ['service mysql start', 'wp-install latest'].concat(beforeScripts);
						} else {
							beforeScripts = [
								"service mysql start",
						        "wp core download --path=/temp/wp --allow-root",
						        "wp core config --path=/temp/wp --dbname=test --dbuser=root --allow-root",
						        "wp core install --url=http://localhost --title=Test --admin_user=admin --admin_password=12345 --admin_email=test@test.com --path=/temp/wp --allow-root",
						        "mkdir /temp/wp/wp-content/plugins/test",
						        "cp -r . /temp/wp/wp-content/plugins/test"
							].concat(beforeScripts);

							testCommand = 'wp plugin activate test --allow-root --path=/temp/wp';
						}
					} else {
						if ('5.2' === versionMap[version]) {
							testCommand = 'wp-activate-theme test';

							beforeScripts = ['service mysql start', 'wp-install latest'].concat(beforeScripts);
						} else {
							beforeScripts = [
								"service mysql start",
						        "wp core download --path=/temp/wp --allow-root",
						        "wp core config --path=/temp/wp --dbname=test --dbuser=root --allow-root",
						        "wp core install --url=http://localhost --title=Test --admin_user=admin --admin_password=12345 --admin_email=test@test.com --path=/temp/wp --allow-root",
						        "mkdir /temp/wp/wp-content/plugins/test",
						        "cp -r . /temp/wp/wp-content/plugins/test"
							].concat(beforeScripts);

							testCommand = 'wp theme activate test --allow-root --path=/temp/wp';
						}
					}
				} else {
					testCommand = params.testCommand;
					tag = 'php-mysql-phpunit-' + versionMap[version] + '-fpm';
				}
			}

			let container = {
				prettyName: params.language + ' ' + versionMap[version],
				image: 'dockunit/prebuilt-images:' + tag,
				testCommand: testCommand,
				beforeScripts: beforeScripts
			};

			file.containers.push(container);
		});

		return file;
	}
}

export default new Generator;
