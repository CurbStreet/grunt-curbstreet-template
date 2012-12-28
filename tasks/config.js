'use strict';

module.exports = function(grunt) {
  var _           = grunt.util._;
  var path        = require('path');

  var config = function(target, srcPath, tmpPath, buildPath, distPath) {
    // load component.json
    var jsonFile  = path.join(srcPath, 'component.json');
    var component;

    try {
      component = grunt.file.readJSON(jsonFile);
    } catch(e) {
      grunt.log.error(e);
      grunt.fail.fatal('component.json is not found in ' + srcPath);
    }

    // various assets
    var modules   = joinPath(srcPath, _.keys(component.modules));
    var styles    = joinPath(srcPath, component.styles);
    var images    = joinPath(srcPath, component.images);
    var fonts     = joinPath(srcPath, component.fonts);
    var assets    = _.chain([images, fonts]).flatten().compact().value();

    var moduleOpt = {
      processName: function(fileName){
        fileName = fileName.replace(srcPath + "/", '');
        return component.modules[fileName].key;
      },
      wrapped: true
    };

    var wrapOpt = {
      header: "(function(){define(['handlebars'],function(Handlebars){\n",
      footer: "\nreturn this.JST;});}).call({});",
      basePath: buildPath
    };

    var tasks = [[
      'clean',
      'dest',
      [
        path.join(buildPath, "*"),
        path.join(distPath, "*"),
        path.join(tmpPath, "*")
      ]
    ]];

    if(!_.isEmpty(modules)) {
      tasks = tasks.concat([[
        'handlebars',
        'build_modules',
        path.join(tmpPath, 'modules.js'),
        modules,
        moduleOpt
      ],[
        'wrap',
        'wrap_modules',
        path.join(buildPath, 'modules.js'),
        path.join(tmpPath, 'modules.js'),
        wrapOpt
      ],[
        'uglify',
        'uglify_modules',
        path.join(distPath, 'modules.js'),
        path.join(buildPath, 'modules.js')
      ]]);
    }

    if(!_.isEmpty(styles)) {
      tasks = tasks.concat([[
        'stylus',
        'build_styles',
        path.join(tmpPath, 'theme.css'),
        styles,
        { 'include css': true, compress: false }
      ],[
        'scopecss',
        'scope_theme',
        path.join(buildPath, 'theme.css'),
        path.join(tmpPath, 'theme.css'),
        { scope: 'div.module' }
      ],[
        'mincss',
        'minify_styles',
        path.join(distPath, 'theme.css'),
        path.join(buildPath, 'theme.css')
      ]]);
    }

    if(!_.isEmpty(assets)) {
      tasks.push([
        'copy',
        'copy_assets_to_build',
        path.join(buildPath, '/'),
        assets
      ]);
      tasks.push([
        'copy',
        'copy_assets_to_release',
        path.join(distPath, '/'),
        assets
      ]);
    }

    // config Grunt to do its magic
    var conf = function(task, suffix, dest, src, options) {
      configureTask(taskKey(task, target, suffix), dest, src, options);
      return taskName(task, target, suffix);
    };


    return _.map(tasks, function(args){ return conf.apply(null, args); });
  };

  var taskName = function(task, target, suffix) {
    suffix = suffix || "";
    return task + ":" + target + "_" + suffix;
  };

  var taskKey = function(task, target, suffix) {
    suffix = suffix || "";
    return task + "." + target + "_" + suffix;
  };

  var filesHash = function(dest, src) {
  };

  var joinPath = function(srcPath, paths) {
    if(!_.isArray(paths) || _.isEmpty(paths)) { return null; }

    return _.map(paths, function(file){
      return path.join(srcPath, file);
    });
  };

  var configureTask = function(task, dest, src, options) {
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
    grunt.config(task, config);
    grunt.verbose.ok();
  };

  return config;
};
