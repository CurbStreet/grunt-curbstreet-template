'use strict';

var grunt = require('grunt');

exports['test modules'] = function(test) {
  var expect = '(function(){define([],function(){return this.JST=this.JST||{},this.JST.test=function(t,e,n){return n=n||t.helpers,"<h1>test</h1>"},this.JST.test2=function(t,e,n){return n=n||t.helpers,"<h1>test2</h1>"},this.JST})}).call({});';
  var result = grunt.file.read('tmp/dist/modules.js');

  test.equal(expect, result, 'should concat and minify modules');

  test.done();
};

exports['test theme'] = function(test) {
  var expect = 'div.module .main{color:red}div.module .imported{color:#00f}div.module .concat{color:#00f}';
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