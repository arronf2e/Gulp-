var gulp = require('gulp');
var sass = require('gulp-sass'); // sass=>css
var browserSync = require('browser-sync').create(); // livereload
var useref = require('gulp-useref');

gulp.task('hello', function () {
  console.log('Hello Gulp')
})

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
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', ['browserSync', 'sass'],function() {
  gulp.watch('app/scss/**/*.scss', ['sass']); //自动监听scss文件的保存，保存就执行sass task
  // 监听HTML/CSS文件的改动，自动刷新浏览器
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})