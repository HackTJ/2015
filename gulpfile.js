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

var concat = require('gulp-concat');
var deploy = require("gulp-gh-pages");
var gulp = require('gulp');
var http = require('node-static');
var jade = require('gulp-jade');
var minifyIMG = require('gulp-imagemin')
var minifyJS = require('gulp-uglify')
var rm = require('gulp-rm');
var sass = require('gulp-sass');
var when = require('when');


/**** Compiler tasks ****/
var compiler = {};

// Clean /out directory
compiler.clean = function() {
	console.log('Cleaning /out directory...');
	return gulp.src( './out/**/*', { read: false })
    .pipe( rm() )
}

// Compile HTML
compiler.html = function() {
	console.log('Compiling HTML...');
    return gulp.src('./jade/[!_]*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./out'))
}

// Compile CSS
compiler.css = function() {
	console.log('Compiling CSS...');
    return gulp.src('./scss/[!_]*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('./out/css'))
}

// Compile JS
compiler.js = function() {
	console.log('Compiling JS...');
    return gulp.src(['./js/_*.js', './js/*.js'])
        .pipe(concat('main.js'))
        .pipe(minifyJS())
        .pipe(gulp.dest('./out/js'))
}

// Compile static resources
compiler.static = function(){
	console.log('Compiling static...');
    return gulp.src('./static/**')
        .pipe(gulp.dest('./out'));
}

compiler.static_compression = function(){
	console.log('Compressing static...')
    return gulp.src('./static/**')
        .pipe(minifyIMG({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('./out'));
}

// Add gulp tasks for each compiler
Object.keys(compiler).forEach(function(name){
	gulp.task(name, compiler[name]);
})

// Clear directory and compile all
var compileAll = function(){
	return when.all([
		compiler.html(),
		compiler.css(),
		compiler.js(),
		compiler.static_compression()
	])
}
gulp.task('compile', ['clean'], compileAll)

var compileDev = function(cb){
	return when.all([
		compiler.html(),
		compiler.css(),
		compiler.js(),
		compiler.static()
	])
}
gulp.task('compile-dev', ['clean'], compileDev)


/**** Deploy tasks ****/
var deploy = {}

// Deploy to hacktj.org/year
deploy.year = function(){
	console.log("Deploying to event page")
	return gulp.src("./out/**/*")
        .pipe( deploy( repo ) )
}
// Deploy to hacktj.org
deploy.homepage = function() {
	console.log("Deploying to homepage")
    return gulp.src("./out/**/*")
        .pipe( deploy( homepageRepo ) )
}

// Deploy to both targets
deploy.all = function(cb){
	return when.all([
		deploy.year,
	 	deploy.homepage
	])
}

// Add gulp tasks for each deploy target
Object.keys(compiler).forEach(function(target){
	gulp.task('deploy-'+target, ['compile'], deploy[target]);
});


gulp.task('watch', ['default'], function() {

    port = (process.argv.length > 4 && process.argv[3] == '--port') ? parseInt(process.argv[4]) : 8000;
    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            new http.Server('./out').serve(request, response);
        }).resume();
    }).listen(port);

    gulp.watch('./static/**', ['static']);
    gulp.watch('./scss/**/*.scss', ['css']);
    gulp.watch('./js/**/*.js', ['js'])
    gulp.watch('./jade/*.jade', ['html']);

    console.log("Server listening on port %s", port)
});

gulp.task('default', ['compile-dev'])