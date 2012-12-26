'use strict';

module.exports = function(grunt) {
  var config = require('./config')(grunt);
  var targetName = 'curbtemp';

  grunt.registerMultiTask('curbtemp', 'CurbStreet Templates', function(){
    var target  = targetName + '_' + this.target;

    grunt.verbose.writeflags(this.options, 'Options');

    var tasks = config(target, this.file.dest, this.file.srcRaw[0]);

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