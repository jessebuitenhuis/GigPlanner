var concat = require('gulp-concat');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

var scripts = {
    main: [
        'client/scripts/**/*.js'
    ],
    vendor: [
        'node_modules/angular/angular.js',
        'node_modules/angular-resource/angular-resource.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js'
    ]
};

var styles = {
    vendor: [
        'node_modules/bootstrap/dist/css/bootstrap.css'
    ],
    main: [

    ]
}

gulp.task('default', ['scripts', 'styles']);

gulp.task('watch', function(){
    gulp.watch([scripts.vendor, scripts.main], ['scripts']);
    gulp.watch([styles.vendor, styles.main], ['styles']);
});

gulp.task('scripts', function(){
    gulp.src(scripts.vendor)
       .pipe(concat('vendor.js'))
       .pipe(gulp.dest('public/scripts'));

    gulp.src(scripts.main)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('styles', function(){
    gulp.src(styles.vendor)
        .pipe(concat('vendor.css'))
        .pipe(minify())
        .pipe(gulp.dest('public/styles'));

    gulp.src(styles.main)
        .pipe(concat('main.css'))
        .pipe(minify())
        .pipe(gulp.dest('public/styles'));
});

