/*jshint globalstrict: true*/
/*global require */

'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function() {
  return gulp.src(['test/setup.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }));
});