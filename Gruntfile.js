module.exports = function task(grunt) {
  'use strict';
  grunt.initConfig({
    eslint: {
      target: ['Gruntfile.js', 'tasks/**/*.js']
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-eslint');

  // Default task.
  grunt.registerTask('default', 'eslint');
};
