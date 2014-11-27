var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifyCSS = require('gulp-minify-css')
var jade = require('gulp-jade');
var minifyJS = require('gulp-uglify')

var deploy = require("gulp-gh-pages");
var static = require('node-static');

// compile CSS
gulp.task('css', function () {
    return gulp.src('./scss/[!_]*.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        // .pipe(minifyCSS()) // Only for production
        .pipe(gulp.dest('./out/css'))
});

// compile HTML
gulp.task('html', function() {
    return gulp.src('./jade/[!_]*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./out'))
});

// Copy over js
gulp.task('js', function(){
    return gulp.src('./js/**')
        // .pipe(minifyJS()) // Only for production
        .pipe(gulp.dest('./out/js'))
});

// Copy over static resources
gulp.task('static', function(){
    return gulp.src('./static/**')
        .pipe(gulp.dest('./out'));
});


gulp.task('default', ['css', 'html', 'js', 'static'])

gulp.task('deploy', ['css', 'html', 'static', 'js'], function () {
    var remote = "https://github.com/pandringa/HackTJ.git";

    return gulp.src("./out/**/*")
        .pipe( deploy( remote ) );
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

