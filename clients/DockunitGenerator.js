'use strict';

class Generator {
	generate(params) {
		let file = {
			containers: []
		};

		let versionMap = {
			php: {
				'5.2.x': '5.2',
				'5.6.x': '5.6',
				'7.0.x': '7.0-rc-1'
			},
			nodejs: {
				'4.2.x': '4.2.1',
				'0.10.x': '0.10.40',
				'0.12.x': '0.12.7'
			},
			java: {
				'OpenJDK 8': 8,
				'OpenJDK 7': 7,
				'OpenJDK 6': 6
			}
		};

		params.languageVersions.forEach(function(version) {
			let tag = '',
				testCommand = '',
				beforeScripts = [];


			if (params.beforeScripts && params.beforeScripts.trim()) {
				beforeScripts = params.beforeScripts.trim().split("\n")
			}

			if ('java' == params.language) {
				tag = 'java-maven-ant-gradle-openjdk-' + versionMap.java[version];

				if ('Gradle' === params.buildTool) {
					testCommand = 'gradle build';
				} else if ('Maven' === params.buildTool) {
					testCommand = 'mvn package';
				} else {
					testCommand = params.testCommand;
				}
			} else {
				if (true === params.unitTests) {
					testCommand = params.testCommand;

					if ('php' === params.language) {
						tag = 'php-mysql-phpunit-' + versionMap.php[version] + '-fpm';
					} else if ('nodejs' === params.language) {
						tag = 'nodejs-mongodb-mocha-jasmine-' + versionMap.nodejs[version];
					}
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

						if ('php' === params.language) {
							tag = 'php-mysql-phpunit-' + versionMap.php[version] + '-fpm';
						} else if ('nodejs' === params.language) {
							tag = 'nodejs-mongodb-mocha-jasmine-' + versionMap.nodejs[version];
						}
					}
				}
			}

			let container = {
				prettyName: params.language + ' ' + versionMap[params.language][version],
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
