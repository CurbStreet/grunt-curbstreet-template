'use strict';

module.exports = function(grunt) {
  var _           = grunt.util._;
  var path        = require('path');

  var config = function(target, destPath, srcPath) {
    // load component.json
    var jsonFile  = path.join(srcPath, 'component.json');
    var component;

    try {
      component = grunt.file.readJSON(jsonFile);
    } catch(e) {
      grunt.log.error(e);
      grunt.fail.fatal('component.json is not found in ' + srcPath);
    }

    // build path
    var buildPath = path.join(destPath, "build");
    var distPath  = path.join(destPath, "dist");

    // various assets
    var modules   = joinPath(srcPath, _.keys(component.modules));
    var styles    = joinPath(srcPath, component.styles);
    var images    = joinPath(srcPath, component.images);
    var fonts     = joinPath(srcPath, component.fonts);

    var moduleOpt = {
      processName: function(fileName){
        fileName = fileName.replace(srcPath + "/", '');
        return component.modules[fileName].key;
      }
    };

    var wrapOpt = {
      header: "(function(){define([],function(){\n",
      footer: "\nreturn this.JST;});}).call({});",
      basePath: buildPath
    };

    console.log(_.chain([images, fonts]).flatten().compact().value());

    var tasks = [[
      'clean',
      path.join(destPath, "*")
    ],[
      'handlebars',
      path.join(buildPath, 'modules.js'),
      modules,
      moduleOpt
    ],[
      'wrap',
      path.join(buildPath, 'modules-amd.js'),
      path.join(buildPath, 'modules.js'),
      wrapOpt
    ],[
      'uglify',
      path.join(distPath, 'modules.js'),
      path.join(buildPath, 'modules-amd.js')
    ],[
      'stylus',
      path.join(buildPath, 'theme.css'),
      styles,
      { 'include css': true, compress: false }
    ],[
      'mincss',
      path.join(distPath, 'theme.css'),
      path.join(buildPath, 'theme.css')
    ],[
      'copy',
      path.join(distPath, '/'),
      _.chain([images, fonts]).flatten().compact().value()
    ]];

    // config Grunt to do its magic
    var conf = function(task, dest, src, options) {
      return configureTask(task, target, dest, src, options);
    };


    return _.map(tasks, function(args){ return conf.apply(null, args); });
  };

  var taskName = function(task, target) {
    return task + ":" + target;
  };

  var taskKey = function(task, target) {
    return task + "." + target;
  };

  var filesHash = function(dest, src) {
  };

  var joinPath = function(srcPath, paths) {
    if(!_.isArray(paths) || _.isEmpty(paths)) { return null; }

    return _.map(paths, function(file){
      return path.join(srcPath, file);
    });
  };

  var configureTask = function(task, target, dest, src, options) {
    var key     = taskKey(task, target);
    var config  = {};
    var files   = {};

    // if options has value, add it to config
    if( !_.isUndefined(options) && !_.isNull(options) ) {
      config.options = options;
    }

    // if we have no src, the config is an array containing dest
    if(_.isUndefined(src) || _.isNull(src)) {
      config = [dest];
    } else {
      // if src is not an array, force into one
      if(!_.isArray(src)) { src = [src]; }

      files[dest] = src;
      config.files = files;
    }

    grunt.verbose.write('configuring ' + task + ' task.');
    grunt.config(key, config);
    grunt.verbose.ok();

    return taskName(task, target);
  };

  return config;
};
