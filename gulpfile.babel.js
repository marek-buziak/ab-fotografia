'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import clean from 'gulp-clean';
import uglifyJS from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
// import imageminWebp from 'imagemin-webp';
const {src, dest, pipe, watch, series, parallel} = gulp;

// ścieżki główne
const paths = {
	src: './src',
	dest: './dist',
	temp: './temp'
};

// kompilator sass z sourcemaps - deweloperski
export const stylesDev = (done) => {
	return src([paths.src + '/scss/*.scss'/*, '!' + paths.src + '/scss/bootstrap*.scss'*/])
		.pipe(sourcemaps.init())
		.pipe(gulpSass({outputStyle: 'expanded'}).on('error', gulpSass.logError))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.dest + '/css'));

	done();
};

// kompilator sass bez sourcemaps - produkcyjny
export const stylesDist = (done) => {
	return src([paths.src + '/scss/*.scss'/*, '!' + paths.src + '/scss/bootstrap*.scss'*/])
		.pipe(gulpSass().on('error', gulpSass.logError))
		.pipe(cleanCSS())
		.pipe(rename('index.min.css'))
		.pipe(dest(paths.dest + '/css'));

	done();
};

// babel - kompilacja kodu > ES6 do wersji ES5
export const babelCompile = (done) => {

	return src([paths.src + '/js/*.js'])
		.pipe(babel())
		.pipe(rename('index.babel.js'))
		.pipe(dest(paths.dest + '/js'));

	done();
};

// uglifikacja kodu JS
export const uglify = (done) => {
	return src([paths.dest + '/js/*.babel.js'])
		.pipe(uglifyJS())
		.pipe(rename('index.min.js'))
		.pipe(dest(paths.dest + '/js'));

	done();
};

// imagemin
export const imageMin = (done) => {
	return src([paths.src + '/img/**/*.jpg', paths.src + '/img/**/*.JPG', paths.src + '/img/**/*.png'])
		.pipe(imagemin([imagemin.mozjpeg({quality: 75, progressive: true}), imagemin.optipng({optimizationLevel: 5})]))
		.pipe(dest(paths.dest + '/img'));

	done();
};

// konwersja PNG, JPEG, TIFF do WebP
export const webPconverter = (done) => {
	return src([paths.src + '/img/**/*.jpg', paths.src + '/img/**/*.JPG', paths.src + '/img/**/*.png'])
		.pipe(webp({quality: 50})) // default quality - 75
		.pipe(dest(paths.dest + '/img/webP'))

	done();
};

// webP imageMin
// export const webPimagemin = (done) => {
//
// 	return src([paths.temp + '/webPUncompressed/**/*.webp'])
// 		.pipe(imageminWebp({quality: 50}))
// 		.pipe(dest(paths.dest + '/img/webP'))
//
// 	done();
// };

// czyszczenie całego folderu dist - produkcyjnego
export const cleanDist = (done) => {
	return src([paths.dest], {read: false, allowEmpty: true})
		.pipe(clean());

	done();
};

// czyszczenie dist -> css
export const cleanDistCSS = (done) => {
	return src([paths.dest + '/css'], {read: false, allowEmpty: true})
		.pipe(clean());

	done();
};

// czyszczenie dist -> js
export const cleanDistJS = (done) => {
	return src([paths.dest + '/js'], {read: false, allowEmpty: true})
		.pipe(clean());

	done();
};

// czyszczenie dist -> img
export const cleanDistIMG = (done) => {
	return src([paths.dest + '/img'], {read: false, allowEmpty: true})
		.pipe(clean());

	done();
};

// watch deweloperski
export const watchFilesDev = () => {
	watch ([paths.src + '/scss/*.scss'], series(cleanDistCSS, stylesDev));
	watch ([paths.src + '/js/*.js'], series(cleanDistJS, babelCompile));
	watch ([paths.src + '/img/**/*.jpg', paths.src + '/img/**/*.JPG', paths.src + '/img/**/*.png'], series(cleanDistIMG, parallel(webPconverter, imageMin)));
};



//  gulpDev zapisane w funkcji strzałkowej; domyślnie funkcje wykonywane są w trybie "series" - od góry do dołu, od lewej do prawej
//const gulpDev = (done) => {
//
//	cleanDist;
//	stylesDev;
//	babelCompile;
//
//	done();
//};

// export default gulpDev
// exports.gulpDev = series(cleanDist, parallel(imageMin, stylesDev, babelCompile));
exports.gulpDev = series(cleanDist, parallel(webPconverter, imageMin, stylesDev, babelCompile));

// export default gulpDist
exports.gulpDist = series(cleanDist, parallel(webPconverter, imageMin, stylesDev, babelCompile), uglify);
