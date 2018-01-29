var gulp = require('gulp'),
  connect = require('gulp-connect'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify');

  gulp.task('connect', ()=> {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task("jshint", ()=>{
   return gulp.src(['./src/**/**.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
});

gulp.task('javascript', ['jshint'] ,()=>{
	 gulp.src([  
        './src/_base.js', 
        './src/window-monitor.js', 
        './src/ads-monitor.js', 
        './src/reporter.js']
      )
      .pipe(concat("script.js"))
      .pipe(uglify())
      .pipe(gulp.dest('./app'))

      .pipe(connect.reload());
});

gulp.task('html', ['javascript'] ,()=>{
	 gulp.src(['./src/**/**.html'])
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('watch', ()=> {
  gulp.watch(['./src/**/**'], ['html']);
});

gulp.task('default', ['connect', 'watch', 'html']);