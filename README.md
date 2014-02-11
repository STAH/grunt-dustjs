grunt-dustjs
----------

Grunt task to compile Dust.js templates.

Getting Started
===============

Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-dustjs`.

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks("grunt-dustjs");
```

[getting_started]: https://github.com/gruntjs/grunt/wiki/Getting-started
[grunt]: http://gruntjs.com

Documentation
=============

Inside your `grunt.js` file, add a section named `dustjs` with one or more targets. Each section contains a files object that specifies the Dust.js template files to compile.

##### `files` object
This defines what files this task will process. It can contain any valid Grunt files format.

When using a src/dest format, the key (destination) should be an unique filepath (supports [grunt.template](https://github.com/gruntjs/grunt/wiki/grunt.template)) and the value (source) should be a filepath or an array of filepaths (supports [minimatch](https://github.com/isaacs/minimatch)). All source files will be combined into the destination output.

When using the dynamic format (example #3), each source file will be processed into its own destination file.

### Options

##### `fullname` _default_: `false`
Used to customize the template variable names. If `fullname` is `true`, the full path will be used as the template name. If `fullname` is a function, the function receives a single argument, which is the full path, and returns the name of the template.

##### `transformQuote` _default_: `false`
Used to reverse quotes usage by dustjs: double quotes replaced by single quotes and vice versa. Output is more clean after this transformation.

### Example #1

```javascript
module.exports = function (grunt) {
  //...
  grunt.loadNpmTasks("grunt-dustjs");
  //...

  var config = {
    //...
    dustjs: {},
    //...
  };

  config.dustjs: {
    compile: {
      files: {
        "js/templates.js": ["src/templates/**/*.html"]
      }
    }
  },
});
```

### Example #2 (custom template names)

```javascript
var path = require("path");

module.exports = function (grunt) {
  //...
  grunt.loadNpmTasks("grunt-dustjs");
  //...

  var config = {
    //...
    dustjs: {},
    //...
  };

  config.dustjs: {
    compile: {
      files: {
        "js/templates.js": ["src/templates/**/*.html"]
      },
      options: {
        fullname: function(filepath) {
          var key = path.relative("src/templates", path.dirname(filepath)).split(path.sep) // folder names
            .concat([path.basename(filepath, path.extname(filepath))]) // template name
            .join(".");

          if (key.charAt(0) == ".")
            return key.substr(1, key.length - 1);
          return key;
        }
      }
    }
  },
});
```


### Example #3 (one JS file per template)

```javascript
module.exports = function (grunt) {
  //...
  grunt.loadNpmTasks("grunt-dustjs");
  //...

  var config = {
    //...
    dustjs: {},
    //...
  };

  config.dustjs: {
    compile: {
      files: [
        {
          expand: true,
          cwd: "dust/",
          src: "**/*.html",
          dest: "",
          ext: ".js"
        }
      ]
    }
  }
});
```


Contributing
============

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

Release History
===============
*   __07/02/2014 - 1.2.1__: Update jshint
*   __14/01/2014 - 1.2.0__: Add append/prepend wrapper strings (@kreegr), error handling (@sunflowerdeath)
*   __23/07/2013 - 1.1.0__: Introduce transformQuote option.
*   __23/07/2013 - 1.0.1__: Correct expand function.
*   __18/07/2013 - 1.0.0__: Release.
*   __18/07/2013 - 0.2.4__: Update examples.
*   __19/01/2013 - 0.2.2__: Grunt v0.4rc5 compatibility (@toddself).
*   __14/12/2012 - 0.2.1__: Grunt v0.4 compatibility (@SpeCT).
*   __08/12/2012 - 0.2.0__: Add namespace support (@bernharduw).
*   __25/09/2012 - 0.1.2__: Initial release.

License
=======

Copyright (c) 2013-2014 Stanislav Lesnikov
Licensed under the MIT license.
