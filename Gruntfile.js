module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    jshint: {
          options: {
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          sub: true,
          undef: true,
          boss: true,
          eqnull: true
      },
      globals: {},
      files: ['Gruntfile.js', 'tasks/**/*.js']
    }
  });

  // Load local tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', 'jshint');
};