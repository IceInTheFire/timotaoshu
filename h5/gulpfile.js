const gulp = require('gulp');
const less = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const babel = require('gulp-babel');  //es6转es5
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require('gulp-imagemin');
const rev = require('./lib/gulp-rev/index');            //生成hash文件   自己更改了源码
const revReplace = require("gulp-rev-replace");
const clean = require("gulp-clean");

// gulp revReplace

// gulp.task('build', ['less','js','concatJs', 'imagemin','lib']);
gulp.task('less', function() {
    gulp.src([
        'src/css/**.less',
        'src/css/**/**.less',
        '!src/css/common/**.less'
    ])
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 5 versions'],
        cascade: false
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('dist/css'));
});
gulp.task('js', function() {
    gulp.src([
        'src/js/**.js',
        'src/js/**/**.js',
        '!src/js/common/**.js',
        '!src/js/lib/**.js'
    ])
    .pipe(babel({
        presets: ['env']
    }))
    //     // .pipe(babel({
    //     //     presets: ['es2015']
    //     // }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
gulp.task('lib', function() {
    gulp.src([
        'src/lib/**',
    ])
    // .pipe(uglify())
    .pipe(gulp.dest('dist/lib'));
});
gulp.task('concatJs', function() {
    gulp.src([
        'src/js/common/rem.js',
        'src/js/common/**.js'
    ])
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(concat('common.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
gulp.task('imagemin', function() {
    gulp.src([
        'src/images/**',
        'src/images/**/**'
    ])
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function () {
    var cssWatcher = gulp.watch([
        'src/css/**.less',
        'src/css/**/**.less',
        '!src/css/common/**.less'], ['less']);
    cssWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    var jsWatcher = gulp.watch([
        'src/js/**.js',
        'src/js/**/**.js',
        '!src/js/common/**.js'], ['js']);
    jsWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    var jsConcatWatcher = gulp.watch([
        'src/js/common/**.js'], ['concatJs']);
    jsConcatWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    var iamgeWatcher = gulp.watch([
        'src/images/**',
        'src/images/**/**'], ['imagemin']);
    iamgeWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('cleanmd5', () => {
    gulp.src([
        'dist/css/rev-manifest.json',
        'dist/js/rev-manifest.json'
    ])
        .pipe(clean());

});

gulp.task('rev', ['less', 'js', 'concatJs', 'imagemin', 'lib', 'cleanmd5'], () =>{
    gulp.src(['dist/**/**.css'])
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/css'));
    gulp.src(['dist/**/**.js'])
        .pipe(rev())
        .pipe(gulp.dest('dist'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('revReplace', ['rev'],function() {
    var manifest = gulp.src([
        'dist/css/rev-manifest.json',
        'dist/js/rev-manifest.json'
    ]);
    var bundle = gulp.src(['views/**/**'])
        .pipe(revReplace({
                manifest:manifest,
                replaceInExtensions:['.js', '.css', '.html', '.hbs','.pug','.ejs']
            }))
        .pipe(gulp.dest('dist-views'))
    return bundle;
});

/*
* 打包
*
* 要gulp两下
* */
gulp.task('default', ['revReplace']);
