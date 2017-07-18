const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
// 编译less文件
gulp.task('less', () => {
    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('fonts', () => {
    return gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('commonJs', () => {
    return gulp.src('./src/common/**/*')
        .pipe(gulp.dest('./dist/common'));
});


//压缩 img 图片
gulp.task('img', () => {
    return gulp.src('./src/images/**/*.{jpg,jpeg,png,gif}')
        .pipe(gulp.dest('./dist/images'));
});


//压缩 自定义 js 文件
gulp.task('scripts', () => {
    return gulp.src([
            './src/js/*.js'
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist/js'));
});

//压缩 自定义 html 文件
gulp.task('html', () => {
    return gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./dist/'));
});

//删除dist文件夹
gulp.task('del', function() {
    gulp.src('./dist', { read: false })
        .pipe(clean());
});

//browserSync  文件保存自动刷新浏览器
gulp.task('watch-html', ['html'], (callback) => {
    browserSync.reload();
    callback();
});
gulp.task('watch-fonts', ['fonts'], (callback) => {
    browserSync.reload();
    callback();
});

gulp.task('watch-less', ['less'], (callback) => {
    browserSync.reload();
    callback();
});

gulp.task('watch-scripts', ['scripts'], (callback) => {
    browserSync.reload();
    callback();
});


gulp.task('serve', ['fonts', 'commonJs', 'scripts', 'less', 'html', 'img'], () => {
    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });
    gulp.watch('./src/fonts/*.{eot,svg,ttf,woff,woff2}', ['watch-fonts']);
    gulp.watch('./src/**/*.html', ['watch-html']);
    gulp.watch('./src/less/**/*.less', ['watch-less']);
    gulp.watch('./src/js/*.js', ['watch-scripts']);
});

gulp.task('default', ['serve']);
