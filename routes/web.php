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
Route::resource('/comments', 'CommentController');

Route::middleware(['auth', 'super'])->prefix('z')->group(function () {
  Route::get('/articles', 'ArticleController@index_api');
  Route::post('/articles', 'ArticleController@store_api');
  Route::post('/articles/update', 'ArticleController@update_api');
  Route::get('/articles/publish/{id}', 'ArticleController@publish_api');
  Route::get('/articles/delete/{id}', 'ArticleController@destroy_api');
  Route::post('/articles/markdown', 'ArticleController@markdown_api');
  Route::get('/articles/{id}', 'ArticleController@show_api');
  Route::post('/upload', 'UploadController@upload_api');
});
