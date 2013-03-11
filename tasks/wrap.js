'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('wrap', 'Wrap files', function(){
    var options = this.options({header: '', footer: ''});

    grunt.verbose.writeflags(this.options, 'Options');

    this.files.forEach(function(file){
      var src     = file.src;
      var dest    = file.dest;
      var header  = options.header;
      var footer  = options.footer;


      if (src.length === 0) {
        grunt.log.writeln('Nothing to wrap!');
        return;
      }


      src.forEach(function(file){
        var content = header + grunt.file.read(file) + footer;
        grunt.file.write(dest, content);
        grunt.log.writeln('File ' + dest.cyan + ' created.');
      });
    });

  });
};