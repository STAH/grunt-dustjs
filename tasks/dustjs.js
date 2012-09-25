/*
 * grunt-dustjs
 * https://github.com/STAH/grunt-dustjs
 *
 * Copyright (c) 2012 Stanislav Lesnikov
 * Licensed under the MIT license.
 * https://github.com/STAH/grunt-dustjs/blob/master/LICENSE-MIT
 */


module.exports = function (grunt) {
  "use strict";

  grunt.registerMultiTask("dustjs", "Grunt task to compile Dust.js templates.", function () {

    if (!this.files) {
      grunt.warn('Missing files property.');
      return false;
    }

    var options = this.data.options || {};

    this.files.forEach(function (file) {
      var srcFiles = grunt.file.expandFiles(file.src);
      var taskOutput = [];

      srcFiles.forEach(function (srcFile) {
        var sourceCode = grunt.file.read(srcFile);
        var sourceCompiled = grunt.helper("dust", sourceCode, srcFile, options.fullname);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  grunt.registerHelper("dustjs", function (source, filepath, fullFilename) {
    var path = require("path");
    var dust = require("dustjs-linkedin");

    try {
      var name;
      if (fullFilename) {
        name = filepath;
      } else {
        // Sets the name of the template as the filename without the extension
        // Example: "fixtures/dust/one.dust" > "one"
        name = path.basename(filepath, path.extname(filepath));
      }

      var output = dust.compile(source, name);
      return output; 
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Dust.js failed to compile.");
    }
  });
};
