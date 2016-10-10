var gulp      = require('gulp'),
  less        = require('gulp-less'),
  minifycss   = require('gulp-minify-css'),
  uglify      = require('gulp-uglify'),
  rename      = require('gulp-rename'),
  concat      = require('gulp-concat'),
  autoprefixer = require('gulp-autoprefixer'),//待用
  imagemin    = require('gulp-imagemin'),
  pngquant    = require('imagemin-pngquant'),
  cache       = require('gulp-cache'),
  browserSync = require('browser-sync').create();

var basePath = "app/src/";
var outPath  = "app/dist/";

gulp.task('server', ['less'], function(){
  browserSync.init({
    server:  ["app/src/", "app/dist/"]
  });

  gulp.watch(basePath+"less/*.less", ['less']);
  gulp.watch("app/src/*.html").on('change',browserSync.reload);
  gulp.watch(basePath+"js/*.js", ['js']);
  gulp.watch(basePath+"bin/js/*.js", ['bin-js']);
})

gulp.task('js', function(){

  return gulp.src(basePath+"js/*.js")
        .pipe(concat('all.js'))
        .pipe(gulp.dest(outPath+"js"))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(outPath+"js"))
        .pipe(browserSync.stream());
})

gulp.task('less', function(){

  return gulp.src(basePath+"less/*.less")
        .pipe(less())
        /*.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))*/
        .pipe(gulp.dest(outPath+"css"))
        .pipe(minifycss())
        .pipe(rename((function (path) {
          path.basename += ".min";
          path.extname = ".css"
        })))
        .pipe(gulp.dest(outPath+"css"))
        .pipe(browserSync.stream());
})

gulp.task('bin-js', function(){

  return gulp.src(basePath+"bin/js/*.js")
        .pipe(gulp.dest(outPath+"script/js"))
})

gulp.task('img', function(){

  return gulp.src(basePath+"img/*.*")
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(outPath+"img"))
})

gulp.task('default',['bin-js', 'img', 'server'])