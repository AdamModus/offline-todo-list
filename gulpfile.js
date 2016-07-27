var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// where all the files are
var src = {
    css: 'app/style/css',
    js: 'app/js/**/*.js',
    html: 'app/*.html',
    sw: 'app/*.js'
};

// Static Server + watching scss/html files
gulp.task('serve', function () {
    // start browserSync
    browserSync({
        // root folder
        server: "./app",
        // used port
        port: 8181,
        // browsers you want to open the project with
        browser: "Google Chrome Canary"
    });
});

gulp.task('watch', function () {
    gulp.watch([src.html, src.js, src.sw, src.css]).on('change', reload);
});

gulp.task('default', ['serve'], function () {
    gulp.start('watch');
});