var gulp = require('gulp');
var compass = require('gulp-for-compass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var order = require('gulp-order');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        middleware: function(connect, opt) {
            return [
                function(req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

                    // don't just call next() return it
                    return next();
                }
            ];
        }
    });
});

gulp.task('default', function() {
    gulp.src('sass/*.sass')
        .pipe(compass({
            sassDir: 'sass',
            cssDir: 'css',
            force: true
        }));

    gulp.src('js/source/*.js')
        .pipe(order([
            'js/source/underscore.js',
            'js/source/backbone.js',
            'js/source/firebase.js',
            'js/source/backbonefire.js',
            'js/source/script.js'
        ], {base: '.'}))
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));

    // gulp.src('js/*.min.js')
    //     .pipe(uglify())
    //     .pipe(rename('script.min.js'))
    //     .pipe(gulp.dest('js'));
});

gulp.task("watch", function() {
    gulp.watch(["js/source/*.js", "sass/*.sass"], ["default"]);
});