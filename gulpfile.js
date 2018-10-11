"use strict"

const gulp = require('gulp');
const connect = require('gulp-connect'); //Runs local dev server
const open = require('gulp-open'); //Open url in web browser
const browserify = require('browserify'); //Bundles our js
const reactify = require('reactify'); //Transforms React JSX to JS
const source = require('vinyl-source-stream'); //Use conventional text streams with Gulp
const concat = require('gulp-concat'); //concatenates files
const lint = require('gulp-eslint');

const config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
}

//start local dev server
gulp.task('connect', () => {
    connect.server({
        root:['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], () => {
    gulp.src('dist/index.html')
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', () => {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', () => {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());

});

gulp.task('css', () => {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
})

gulp.task('watch', ()=> {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
})

gulp.task('default', ['html', 'js', 'css', 'open', 'watch']);