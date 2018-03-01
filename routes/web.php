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
  Route::get('/dashboard', 'AdminController@dashboard_api');
  Route::get('/articles', 'ArticleController@index_api');
  Route::post('/articles', 'ArticleController@store_api');
  Route::post('/articles/update', 'ArticleController@update_api');
  Route::get('/articles/publish/{id}', 'ArticleController@publish_api');
  Route::get('/articles/delete/{id}', 'ArticleController@destroy_api');
  Route::post('/articles/markdown', 'ArticleController@markdown_api');
  Route::get('/articles/{id}', 'ArticleController@show_api');
  Route::get('/comments', 'CommentController@index_api');
  Route::get('/comments/delete/{id}', 'CommentController@destroy_api');
  Route::get('/visits', 'VisitController@index_api');
  Route::post('/upload', 'UploadController@upload_api');
  Route::get('/tags', 'TagController@index_api');
  Route::get('/tags/delete/{id}', 'TagController@destroy_api');
});
