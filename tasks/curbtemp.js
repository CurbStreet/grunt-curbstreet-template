'use strict';

module.exports = function(grunt) {
  var config = require('./config')(grunt);
  var targetName = 'curbtemp';

  grunt.registerMultiTask('curbtemp', 'CurbStreet Templates', function(){
    var target  = targetName + '_' + this.target;

    grunt.verbose.writeflags(this.options, 'Options');

    // build path
    var srcPath   = this.data.srcPath;
    var tmpPath   = this.data.tmpPath;
    var buildPath = this.data.buildPath;
    var distPath  = this.data.distPath;

    if(!srcPath || !tmpPath || !buildPath || !distPath) {
      grunt.fail.fatal(new Error('srcPath, tmpPath, buildPath, and distPath are required'));
    }

    var tasks = config(target, srcPath, tmpPath, buildPath, distPath);

    //this.requires(tasks);
    grunt.task.run(tasks);

  });

  // load required stuff
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-copy');
};