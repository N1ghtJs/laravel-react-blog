<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', 'HomeController@home')->name('home');

Route::get('/admin', 'AdminController@index')->name('admin');

Route::resource('/articles', 'ArticleController');

Route::post('/upload', 'UploadController@upload')->name('upload');
