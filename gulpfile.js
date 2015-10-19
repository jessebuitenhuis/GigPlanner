var concat          = require('gulp-concat'),
    gulp            = require('gulp'),
    watch           = require('gulp-watch'),
    uglify          = require('gulp-uglify'),
    minify          = require('gulp-minify-css'),
    templateCache   = require('gulp-angular-templatecache'),
    annotate      = require('gulp-ng-annotate');

var scripts = {
    main: [
        'client/app.js',
        'client/**/*.js'
    ],
    vendor: [
        'node_modules/angular/angular.js',
        'node_modules/angular-resource/angular-resource.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/underscore/underscore.js'
    ]
};

var styles = {
    vendor: [
        'node_modules/bootstrap/dist/css/bootstrap.css'
    ],
    main: [

    ]
};

var templates = 'client/**/*.html';

gulp.task('default', ['renderTemplates', 'scripts', 'styles']);

gulp.task('watch', function(){
    gulp.watch(templates, ['renderTemplates']);
    gulp.watch([scripts.vendor, scripts.main], ['scripts']);
    gulp.watch([styles.vendor, styles.main], ['styles']);
});

gulp.task('scripts', function(){
    gulp.src(scripts.vendor)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/scripts'));

    gulp.src(scripts.main)
        .pipe(concat('main.js'))
        .pipe(annotate())
        .pipe(uglify())
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

gulp.task('renderTemplates', function(){
   gulp.src(templates)
       .pipe(templateCache('app.templates.js', {standalone: true}))
       .pipe(gulp.dest('client'));
});

