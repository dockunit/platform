# Dockunit Platform

Fully open sourced [Dockunit.io](http://dockunit.io) platform for running [Dockunit](https://github.com/tlovett1/dockunit) containerized continuous integration tests. 

## Purpose

[Dockunit](https://github.com/tlovett1/dockunit) gives you true build freedom using [Docker](http://docker.com) 
technology. No longer are you bound to testing your software in a limited set of environments with a limited set 
of utilities and dependencies. Define your own build environments using Dockunit with no restrictions; test across 
multiple versions of your favorite programming languages using a variety of technologies and tools. Dockunit.io
lets you integrate your Dockunit tests into your software repositories. No more blindly merging pull requests. 
Dockunit.io tests integrate tightly with Github to automatically check the integrity of each change or proposed 
change to your code base.

## Local Development

__Requirements:__

* [Node.js](https://nodejs.org/)
* [npm](https://www.npmjs.com)
* [Grunt](http://gruntjs.com)
* [Redis](http://redis.io)
* [Docker](https://www.docker.com)

Here are some easy steps to get started developing locally:

1. Clone this repository.
2. Run `npm install` from within the project directory.
3. One directory below the project directory, create a file called `secrets.js`. This file will contain some secret keys that the platform will use. For most of the keys, you can just fill in dummy data for testing. Here is an example `secrets.js` file:
  
  ```js
  module.exports = {
    githubClientId: 'xxxxxxx',
    githubClientSecret: 'xxxxxxx',
    githubWebhooksSecret: 'xxxxxxx',
    sessionSecret: 'xxxxxxx'
  };
  ```
4. Run `DEBUG=dockunit grunt` from within the project directory.


## License

Dockunit Platform is free software; you can redistribute it and/or modify it under the terms of the 
[GNU General Public License](http://www.gnu.org/licenses/gpl-2.0.html) as published by the Free 
Software Foundation; either version 2 of the License, or (at your option) any later version.