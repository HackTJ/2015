/* Config settings - Update this when you clone the repo */
var repo = {
	remoteUrl: "https://github.com/HackTJ/2015.git",
	branch: "gh-pages",
}
var homepageRepo = {
	remoteUrl: "https://github.com/HackTJ/hacktj.github.io.git",
	branch: "master",
}
/* ----------------------------------------------------- */

var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css')
var minifyJS = require('gulp-uglify')
var minifyIMG = require('gulp-imagemin')
var deploy = require("gulp-gh-pages");
var static = require('node-static');
var concat = require('gulp-concat');

// Compile HTML
gulp.task('html', function() {
    return gulp.src('./jade/[!_]*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./out'))
});

// Compile CSS
gulp.task('css', function () {
    return gulp.src('./scss/[!_]*.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        .pipe(minifyCSS())
        .pipe(gulp.dest('./out/css'))
});

// Copy js
gulp.task('js', function(){
    return gulp.src(['./js/_*.js', './js/*.js'])
        .pipe(concat('main.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('./out/js'))
});

// Copy over static resources
gulp.task('static', function(){
    return gulp.src('./static/**')
        .pipe(gulp.dest('./out'));
});

// Compress images - used only for deploys
gulp.task('static-images', function(){
    return gulp.src('./static/**')
        .pipe(minifyIMG({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('./out'));
});

gulp.task('deploy', ['css', 'html', 'static-images', 'js'], function () {
    return gulp.src("./out/**/*")
        .pipe( deploy( repo ) )
        .pipe( deploy() );
});

gulp.task('deploy-homepage', ['css', 'html', 'static-images', 'js'], function () {
    return gulp.src("./out/**/*")
        .pipe( deploy( homepageRepo ) )
        .pipe( deploy() );
});

gulp.task('watch', ['default'], function() {
    port = (process.argv.length > 4 && process.argv[3] == '--port') ? parseInt(process.argv[4]) : 8000;
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            new static.Server('./out').serve(request, response);
        }).resume();
    }).listen(port);

    gulp.watch('./static/**', ['static']);
    gulp.watch('./scss/**/*.scss', ['css']);
    gulp.watch('./js/**/*.js', ['js'])
    gulp.watch('./jade/*.jade', ['html']);

    console.log("Server listening on port %s", port)
});

gulp.task('default', ['css', 'html', 'js', 'static'])