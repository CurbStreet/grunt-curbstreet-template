'use strict';

var grunt = require('grunt');

exports['test modules'] = function(test) {
  var expect = 'this.JST=this.JST||{},this.JST["test/fixtures/example_template/templates/test.hbs"]=function(t,e,s){return s=s||t.helpers,"<h1>test</h1>"},this.JST["test/fixtures/example_template/templates/test2.hbs"]=function(t,e,s){return s=s||t.helpers,"<h1>test2</h1>"};';
  var result = grunt.file.read('tmp/dist/example_template/modules.min.js');

  test.equal(expect, result, 'should concat and minify modules');

  test.done();
};

exports['test theme'] = function(test) {
  var expect = '.main{color:red}.imported{color:#00f}.concat{color:#00f}';
  var result = grunt.file.read('tmp/dist/example_template/theme.min.css');

  test.equal(expect, result, 'should import, concat, and minify theme');

  test.done();
};

exports['test images'] = function(test) {
  var expect = 'mock png';
  var result = grunt.file.read('tmp/dist/example_template/images/mock.png');

  test.equal(expect, result, 'should copy images');

  test.done();
};

exports['test fonts'] = function(test) {
  var expect = 'mock font';
  var result = grunt.file.read('tmp/dist/example_template/fonts/mock.eot');

  test.equal(expect, result, 'should copy fonts');

  test.done();
};