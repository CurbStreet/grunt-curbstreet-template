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
    var pages   = joinPath(srcPath, _.keys(component.pages));
    var styles    = joinPath(srcPath, component.styles);
    var images    = component.images;
    var fonts     = component.fonts;
    var assets    = _.chain([images, fonts]).flatten().compact().value();

    var pageOpt = {
      processName: function(fileName){
        fileName = fileName.replace(srcPath + "/", '');
        var f = component.pages[fileName].key;
        var theme = target.replace("curbtemp_", '');
        return f + theme;
      },
      processPartialName: function(fileName){
        fileName = fileName.replace(srcPath + "/", '');
        var f = component.pages[fileName].key;
        var theme = target.replace("curbtemp_", '');
        return f + theme;
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

    if(!_.isEmpty(pages)) {
      tasks = tasks.concat([[
        'handlebars',
        'build_pages',
        path.join(tmpPath, 'pages.js'),
        pages,
        pageOpt
      ],[
        'wrap',
        'wrap_pages',
        path.join(buildPath, 'pages.js'),
        path.join(tmpPath, 'pages.js'),
        wrapOpt
      ],[
        'uglify',
        'uglify_pages',
        path.join(distPath, 'pages.js'),
        path.join(buildPath, 'pages.js')
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
        { scope: 'div.page-wrap' }
      ],[
        'cssmin',
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
        assets,
        {},
        {expand: true, cwd: (srcPath+'/') }
      ]);
      tasks.push([
        'copy',
        'copy_assets_to_release',
        path.join(distPath, '/'),
        assets,
        {},
        {expand: true, cwd: (srcPath + '/') }
      ]);
    }

    // config Grunt to do its magic
    var conf = function(task, suffix, dest, src, options, fileOptions) {
      console.log("=======================");
      console.log(task);
      console.log(suffix);
      console.log(dest);
      console.log(src);
      console.log(options);
      console.log(fileOptions);

      configureTask(taskKey(task, target, suffix), dest, src, options, fileOptions);
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

  var configureTask = function(task, dest, src, options, fileOptions) {
    var config  = {};
    var files   = [];

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

      var file = {
        src: src,
        dest: dest
      };

      files.push(_.extend(file, fileOptions));
      config.files = files;
    }

    grunt.verbose.write('configuring ' + task + ' task.');
    grunt.config(task, config);
    grunt.verbose.ok();
  };

  return config;
};
