'use strict';

var _ = require('lodash');

var webpackDevConfig = require('./webpack.config');
var webpackProdConfig = _.clone(webpackDevConfig);

webpackDevConfig.keepalive = true;
webpackDevConfig.watch = true;

module.exports = function (grunt) {
    grunt.initConfig({
        clean: ['build'],
        concurrent: {
            dev: ['nodemon:app', 'webpack:dev', 'watch:css', 'watch:js', 'copy:js', 'copy:fonts', 'copy:img'],
            options: {
                logConcurrentOutput: true
            }
        },
		cssmin: {
			all: {
				files: {
					'assets/css/dist/main.min.css': ['assets/css/src/main.css']
				}
			}
		},
		sass: {
			all: {
				files: {
					'assets/css/src/main.css': 'assets/css/src/scss/main.scss'
				}
			}
		},
        jshint: {
            all: [
                '*.js',
                '{actions,configs,components,services,stores}/**/*.js'
            ],
            options: {
                jshintrc: true
            }
        },
        nodemon: {
            app: {
                script: './server.js',
                options: {
                    ignore: ['build/**'],
                    ext: 'js,jsx'
                }
            }
        },
		copy: {
			js: {
				files: [{
					expand: true,
					cwd: 'assets/js/dist/',
					src: ['*.*'],
					dest: 'build/js'
				}]
			},
			css: {
				files: [{
					expand: true,
					cwd: 'assets/css/dist/',
					src: ['*.*'],
					dest: 'build/css'
				}]
			},
			fonts: {
				files: [{
					expand: true,
					cwd: 'assets/fonts/',
					src: ['*.*'],
					dest: 'build/fonts/bootstrap'
				}]
			},
			img: {
				files: [{
					expand: true,
					cwd: 'assets/img/',
					src: ['*.*'],
					dest: 'build/img'
				}]
			}
		},
		watch: {
			css: {
				files: [
					'bower_components/bootstrap-sass-official/assets/stylesheets/*.scss',
					'bower_components/bootstrap-sass-official/assets/stylesheets/bootstrap/*.scss',
					'bower_components/bootstrap-sass-official/assets/stylesheets/bootstrap/mixins/*.scss',
					'assets/css/src/scss/*.scss',
					'assets/css/src/scss/components/*.scss',
					'assets/css/src/scss/global/*.scss',
					'assets/css/src/scss/layout/*.scss'
				],
				tasks: ['sass:all', 'cssmin:all', 'copy:css'],
				options: {
					spawn: false
				}
			},
			js: {
				files: [
					'assets/js/src/*.js',
				],
				tasks: ['uglify:all', 'copy:js'],
				options: {
					spawn: false
				}
			}
		},
        webpack: {
			dev: webpackDevConfig,
			prod: webpackProdConfig
        },
        uglify: {
        	all: {
				files: {
					'assets/js/dist/sockets.min.js': ['assets/js/src/sockets.js'],
					'assets/js/dist/bootstrap.min.js': ['assets/js/src/bootstrap.js'],
					'assets/js/dist/navbars.min.js': ['assets/js/src/navbars.js']
				}
			}
		}
    });

    // libs
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

    // tasks
	grunt.registerTask('default', ['clean', 'jshint', 'copy:css', 'concurrent:dev']);
	grunt.registerTask('prepare', ['clean', 'jshint', 'copy:css', 'webpack:prod', 'copy:js', 'copy:fonts', 'copy:img']);
};

