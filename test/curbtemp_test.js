'use strict';

var grunt = require('grunt');

exports['test pages.js'] = function(test) {
  var expect = '!function(){define(["handlebars"],function(a){return this.JST=this.JST||{},this.JST.test=a.template(function(a,b,c,d,e){return this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{},"<h1>test</h1>"}),this.JST.test2=a.template(function(a,b,c,d,e){return this.compilerInfo=[4,">= 1.0.0"],c=this.merge(c,a.helpers),e=e||{},"<h1>test2</h1>"}),this.JST})}.call({});';
  var result = grunt.file.read('tmp/dist/pages.js');

  test.equal(expect, result, 'should concat and minify modules');

  test.done();
};

exports['test theme.css'] = function(test) {
  var expect = 'div.page-wrap .main{color:red}div.page-wrap .imported{color:#00f}div.page-wrap .concat{color:#00f}';
  var result = grunt.file.read('tmp/dist/theme.css');

  test.equal(expect, result, 'should import, concat, and minify theme');

  test.done();
};

exports['test images'] = function(test) {
  var expect = 'mock png';
  var result = grunt.file.read('tmp/dist/images/mock.png');

  test.equal(expect, result, 'should copy images');

  test.done();
};

exports['test fonts'] = function(test) {
  var expect = 'mock font';
  var result = grunt.file.read('tmp/dist/fonts/mock.eot');

  test.equal(expect, result, 'should copy fonts');

  test.done();
};
