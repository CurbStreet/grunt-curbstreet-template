'use strict';

module.exports = function(grunt) {
  grunt.registerMultiTask('scopecss', 'Scope CSS files', function(){
    var options = this.options({scope: 'div.scoped'});

    grunt.verbose.writeflags(this.options, 'Options');

    var src     = this.file.src;
    var dest    = this.file.dest;
    var scope   = options.scope;

    if (src.length === 0) {
      grunt.log.writeln('Nothing to scope!');
      return;
    }

    var jscssp = require('jscssp');


    src.forEach(function(file){
      var content = grunt.file.read(file);
      var parser = new jscssp.CSSParser();
      var sheet = parser.parse(content);

      sheet.cssRules.forEach(function(rule){
        if(rule.mSelectorText) {
          rule.mSelectorText = scope + ' ' + rule.mSelectorText;
        }
        if(rule.parsedCssText) {
          rule.parsedCssText = scope + ' ' + rule.parsedCssText;
        }
      });

      grunt.file.write(dest, sheet.cssText());
      grunt.log.writeln('File ' + dest.cyan + ' created.');
    });

  });
};