/*
 * grunt-dustjs
 * https://github.com/STAH/grunt-dustjs
 *
 * Copyright (c) 2013-2016 Stanislav Lesnikov
 * Licensed under the MIT license.
 * https://github.com/STAH/grunt-dustjs/blob/master/LICENSE-MIT
 */

module.exports = function main(grunt) {
  'use strict';

  function compile(source, filepath, options) {
    var path = require('path');
    var dust = require('dustjs-linkedin');
    var saveConfig = dust.config;
    var fullFilename = options.fullname;
    var name;

    if (typeof fullFilename === 'function') {
      name = fullFilename(filepath);
    } else if (fullFilename) {
      name = filepath;
    } else {
      // Sets the name of the template as the filename without the extension
      // Example: "fixtures/dust/one.dust" > "one"
      name = path.basename(filepath, path.extname(filepath));
    }

    if (name !== undefined) {
      try {
        dust.config = options;
        return dust.compile(source, name);
      } catch (e) {
        grunt.log.error(e);
        grunt.fail.warn('Dust.js failed to compile template "' + name + '".');
      }
      dust.config = saveConfig;
    }

    return '';
  }

  grunt.registerMultiTask('dustjs', 'Grunt task to compile Dust.js templates.', function task() {
    // Extend with the default options if none are specified
    var options = this.options({
      fullname: false,
      transformQuote: false,
      prepend: '',
      append: '',
      whitespace: false,
      amd: false,
      cjs: false,
      silent: false
    });

    this.files.forEach(function doFiles(file) {
      var srcFiles = grunt.file.expand(file.src);
      var taskOutput = [];

      srcFiles.forEach(function doSources(srcFile) {
        var sourceCode = grunt.file.read(srcFile);
        var sourceCompiled = compile(sourceCode, srcFile, options);

        if (options.transformQuote) {
          sourceCompiled = sourceCompiled.replace('chk.write("', "chk.write('");
          sourceCompiled = sourceCompiled.replace('");', "');");
          sourceCompiled = sourceCompiled.replace(/\\"/g, '"');
        }

        taskOutput.push(sourceCompiled);
      });

      if (taskOutput.length > 0) {
        grunt.file.write(file.dest,
          options.prepend + taskOutput.join('\n') + options.append);

        if (!options.silent) {
          grunt.verbose.writeln('[dustjs] Compiled ' +
            grunt.log.wordlist(srcFiles.toString().split(','), { color: false }) + ' => ' + file.dest);
          grunt.verbose.or.writeln('[dustjs] Compiled ' + file.dest);
        }
      }
    });
  });
};
