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

Route::get('/articles/search/{key}', 'ArticleController@search')->name('articles.search.get');
Route::post('/articles/search', 'ArticleController@search')->name('articles.search.post');
Route::get('/articles/list', 'ArticleController@list')->name('articles.list');
Route::resource('/articles', 'ArticleController');
Route::resource('/comments', 'CommentController');
Route::get('/tags/{name}', 'TagController@show')->name('tags.show')->where('name', '.*');

Route::middleware(['auth', 'super'])->namespace('Admin')->prefix('admin-api')->group(function () {

  Route::get('/articles', 'ArticleController@index');
  Route::post('/articles', 'ArticleController@store');
  Route::get('/articles/publish/{id}', 'ArticleController@publish');
  Route::get('/articles/top/{id}', 'ArticleController@top');
  Route::get('/articles/delete/{id}', 'ArticleController@destroy');
  Route::post('/articles/markdown', 'ArticleController@markdown');
  Route::get('/articles/{id}', 'ArticleController@show');
  Route::post('/upload', 'ArticleController@uploadFileApi');
  Route::post('/import', 'ArticleController@import');
  Route::get('/tags', 'TagController@index');
  Route::get('/tags/delete/{id}', 'TagController@destroy');

  Route::get('/comments', 'CommentController@index');
  Route::get('/comments/delete/{id}', 'CommentController@destroy');
  Route::get('/blacklist', 'BlacklistController@index');
  Route::get('/blacklist/delete/{id}', 'BlacklistController@destroy');
  Route::post('/blacklist', 'BlacklistController@store');

  Route::get('/settings', 'SettingController@index');
  Route::post('/settings', 'SettingController@store');

  Route::get('/users/{id}', 'UserController@show');
  Route::post('/users/{id}', 'UserController@update');
  Route::post('/users/{id}/password', 'UserController@changePassword');
});
