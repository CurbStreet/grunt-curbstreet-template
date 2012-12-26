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

    // clean path
    var cleanPath = path.join(destPath, "*");

    // various assets
    var modules   = joinPath(srcPath, component.templates);
    var styles    = joinPath(srcPath, component.styles);
    var images    = joinPath(srcPath, component.images, "**", "*");
    var fonts     = joinPath(srcPath, component.fonts, "**", "*");

    // modules
    var modulejs  = path.join(destPath, 'modules.js');
    var modulemin = path.join(destPath, 'modules.min.js');

    // styles
    var stylecss  = path.join(destPath, 'theme.css');
    var stylemin  = path.join(destPath, 'theme.min.css');
    var styleOpt  = { 'include css': true, compress: false };
    // copy other assets
    var copyDest  = path.join(destPath, '/');
    var copySrc   = _.flatten([images, fonts]);
    copySrc = _.compact(copySrc);

    // config Grunt to do its magic
    var conf = function(task, dest, src, options) {
      return configureTask(task, target, dest, src, options);
    };

    var tasks = [
      [ 'clean',        cleanPath                         ],
      [ 'handlebars',   modulejs,     modules             ],
      [ 'uglify',       modulemin,    modulejs            ],
      [ 'stylus',       stylecss,     styles,   styleOpt  ],
      [ 'mincss',       stylemin,     stylecss            ],
      [ 'copy',         copyDest,     copySrc             ]
    ];

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
