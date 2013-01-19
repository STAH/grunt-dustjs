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

  // Temporary helper for normalizing files object
  var normalizeMultiTaskFiles = function(data, target) {
    var prop, obj;
    var files = [];
    if (grunt.util.kindOf(data) === 'object') {
      if ('src' in data || 'dest' in data) {
        obj = {};
        if ('src' in data) { obj.src = data.src; }
        if ('dest' in data) { obj.dest = data.dest; }
        files.push(obj);
      } else if (grunt.util.kindOf(data.files) === 'object') {
        for (prop in data.files) {
          files.push({src: data.files[prop], dest: prop});
        }
      } else if (Array.isArray(data.files)) {
        data.files.forEach(function(obj) {
          var prop;
          if ('src' in obj || 'dest' in obj) {
            files.push(obj);
          } else {
            for (prop in obj) {
              files.push({src: obj[prop], dest: prop});
            }
          }
        });
      }
    } else {
      files.push({src: data, dest: target});
    }

    // Process each normalized file object as a template.
    files.forEach(function(obj) {
      // Process src as a template (recursively, if necessary).
      if ('src' in obj) {
        obj.src = grunt.util.recurse(obj.src, function(src) {
          if (typeof src !== 'string') { return src; }
          return grunt.template.process(src);
        });
      }
      if ('dest' in obj) {
        // Process dest as a template.
        obj.dest = grunt.template.process(obj.dest);
      }
    });

    return files;
  };

  var compile;

  grunt.registerMultiTask("dustjs", "Grunt task to compile Dust.js templates.", function () {

    this.files = this.files || normalizeMultiTaskFiles(this.data, this.target);

    var options = this.data.options || {};

    this.files.forEach(function (file) {
      var srcFiles = grunt.file.expand({filter: 'isFile'}, file.src);
      var taskOutput = [];

      srcFiles.forEach(function (srcFile) {
        var sourceCode = grunt.file.read(srcFile);
        var sourceCompiled = compile(sourceCode, srcFile, options.fullname);

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest, taskOutput.join("\n"));
        grunt.log.writeln("File '" + file.dest + "' created.");
      }
    });
  });

  compile = function (source, filepath, fullFilename) {
    var path = require("path");
    var dust = require("dustjs-linkedin");

    try {
      var name;
      if (typeof fullFilename === "function") {
        name = fullFilename(filepath);
      } else if (fullFilename) {
        name = filepath;
      } else {
        // Sets the name of the template as the filename without the extension
        // Example: "fixtures/dust/one.dust" > "one"
        name = path.basename(filepath, path.extname(filepath));
      }

      if (name !== undefined) {
        var output = dust.compile(source, name);
        return output;
      }
      return '';
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Dust.js failed to compile.");
    }
  };
};
