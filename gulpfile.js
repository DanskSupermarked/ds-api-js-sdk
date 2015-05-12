var gulp = require('gulp');

// Lint
gulp.task('lint', function() {
  var jscs = require('gulp-jscs');
  var jshint = require('gulp-jshint');
  return gulp.src('{lib,test}/**/*.js')
    .pipe(jscs({
      esnext: true
    }))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test:node', ['build:es5'], function() {
  var mocha = require('gulp-mocha');
  return gulp.src('test/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('test:browser', ['build'], function() {
  var mochaPhantomJS = require('gulp-mocha-phantomjs');
  return gulp.src([
      'test/polyfill.io.html',
      'test/jquery-polyfills.html'
    ])
    .pipe(mochaPhantomJS({
      reporter: 'spec'
    }));
});

// Test code for lint errors andrun unit tests
gulp.task('test', ['lint', 'test:node', 'test:browser']);

gulp.task('tdd', ['lint', 'test:node'], function() {
  gulp.watch('{lib,test}/**/*.js', ['lint', 'test:node']);
});

// Build es5 compatible files using Babel
gulp.task('build:es5', function() {
  return gulp.src('lib/index.js')
    .pipe(require('gulp-rename')('ds-api.js'))
    .pipe(require('gulp-babel')({
      modules: 'umdStrict'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(require('gulp-uglify')())
    .pipe(require('gulp-rename')('ds-api.min.js'))
    .pipe(gulp.dest('dist'));
});

// Build es5 compatible files using Babel
gulp.task('build:jquery-polyfill', function() {
  return gulp.src('lib/jquery-polyfill.js')
    .pipe(gulp.dest('dist'))
    .pipe(require('gulp-uglify')())
    .pipe(require('gulp-rename')('jquery-polyfill.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:es5', 'build:jquery-polyfill']);

gulp.task('deploy', ['build', 'test'], function() {
  var deployCdn = require('gulp-deploy-azure-cdn');
  var gutil = require('gulp-util');
  var pkg = require('./package.json');

  return gulp.src(['**/*.*'], {
    cwd: 'dist'
  }).pipe(deployCdn({
    containerName: 'api',
    serviceOptions: ['dansksupermarked', process.env.BLOB_TOKEN],
    folder: 'ds-api/' + pkg.version,
    zip: true,
    deleteExistingBlobs: false,
    metadata: {
      cacheControl: 'public, max-age=31530000', // cache in browser
      cacheControlHeader: 'public, max-age=31530000' // cache in azure CDN. As this data does not change, we set it to 1 year
    }
  })).on('error', gutil.log);
});
