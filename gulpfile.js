var gulp = require('gulp');
var sass = require('gulp-sass'); // sass=>css
var browserSync = require('browser-sync').create(); // livereload
var useref = require('gulp-useref'); // 整合文件css or js   遇到的坑： html 中一定要有注释
var uglify = require('gulp-uglify'); // js压缩
var gulpIf = require('gulp-if');  // If condition do something
var minifyCss = require('gulp-minify-css'); // css压缩
var imagemin = require('gulp-imagemin'); // 图片压缩
var cache = require('gulp-cache'); // 只压缩修改过的，减少重复压缩图片的时间
var del = require('del');
var runSequence = require('run-sequence'); // 指定 tasks 按顺序执行

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss') // 资源文件夹
    .pipe(sass())
    .pipe(gulp.dest('app/css')) // 目标文件夹
    .pipe(browserSync.reload({
      stream: true
    }))
})

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    // minify only if it's a css file
    .pipe(gulpIf('*.css', minifyCss()))
    // uglify only if it's a js file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
})

gulp.task('imagemin', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app',
    }
  })
})

gulp.task('clean', function() {
  return del.sync('dist').then(function(callback) {
    return cache.clearAll(callback)
  })
})

// 删除dist下任意文件，除了images文件夹下的
gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*'])
})

// 监听文件改动
gulp.task('watch',function() {
  gulp.watch('app/scss/**/*.scss', ['sass']); //自动监听scss文件的保存，保存就执行sass task
  // 监听HTML/CSS文件的改动，自动刷新浏览器
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('dev', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})

//Build
gulp.task('build', function(callback) {
  runSequence(
    'clean:dist', 
    ['sass', 'useref', 'imagemin', 'fonts'],
    callback
  )
  console.log('Building successfully!')
});