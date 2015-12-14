# EloquentJs client library
[![API docs](https://doc.esdoc.org/github.com/parsnick/eloquentjs-client/badge.svg)](https://doc.esdoc.org/github.com/parsnick/eloquentjs-client/)
[![Build Status](https://travis-ci.org/parsnick/eloquentjs-client.svg)](https://travis-ci.org/parsnick/eloquentjs-client)
[![Coverage Status](https://coveralls.io/repos/parsnick/eloquentjs-client/badge.svg?branch=master&service=github)](https://coveralls.io/github/parsnick/eloquentjs-client?branch=master)

This repo contains the javascript source for the EloquentJs project.
For more information about EloquentJs, see the [main eloquentjs repository](https://github.com/parsnick/eloquentjs).

## About

The EloquentJs package for Laravel, available via Composer, includes a pre-built copy of this library. If you just want to use EloquentJs, head over to the [eloquentjs repo](https://github.com/parsnick/eloquentjs).

If you want to contribute, view the source, or customise the build, carry on.

## Documentation

API documentation exists at [doc.esdoc.org/github.com/parsnick/eloquentjs-client](https://doc.esdoc.org/github.com/parsnick/eloquentjs-client/).

User-friendly documentation for usage of this library exists at [parsnick/eloquentjs](https://github.com/parsnick/eloquentjs).

## Integrating with eloquentjs

If you want to generate a custom build, install the library as an npm module:

```
npm install laravel-eloquentjs
```

You can then import the components you want directly into your own scripts. The build tasks (and others) are defined in the package.json "scripts", which you might need to refer to - nothing special though, just a standard browserify with the `babelify` transform.

##### Why would you want to do this?

* You want to replace one or more components - perhaps you're using a framework that already provides certain features which you'd prefer to use (e.g. AJAX instead of the Fetch polyfill, an IoC container instead of the bundled Manager).
* You don't need all the functionality of EloquentJs and would rather create a partial build.
* You want to substantially change the core code.
* You need to add behaviours to models and prefer the ES2015 class sugar over the ES5-style

Note: there's no reason you can't customise the standard build by overwriting the prototypes, etc. but you might still prefer to create your own build for better code organisation, testing purposes, and/or a smaller build size.

##### ES2015 example
```js
// models/Post.js
import { Model } from 'laravel-eloquentjs';

class Post extends Model {

    customBehaviour() {
        // do stuff
    }

}

export default Post;
```

## Contributing
All contributions welcome. For anything related to the companion PHP package, please use [parsnick/eloquentjs](https://github.com/parsnick/eloquentjs).

## License
MIT
