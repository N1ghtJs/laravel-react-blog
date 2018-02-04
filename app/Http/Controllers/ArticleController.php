<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;

class ArticleController extends Controller
{
  /**
   * 返回所有的文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $articles = Article::orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->key = $articles[$i]->id;
      $articles[$i]->content = strip_tags(str_limit($articles[$i]->content, 100));
    }
    return $articles;
  }
  /**
   * 跳转某篇文章
   *
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    $article = Article::findOrFail($id);
    return view('articles.show', compact('article'));
  }
  /**
   * 返回某个文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function show_api($id)
  {
    $article = Article::findOrFail($id);
    return $article;
  }
  /**
   * 创建文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function store_api(Request $request)
  {
    $article = new Article;
    $article->title = $request->title;
    $article->cover = $request->cover;
    $article->content = $request->content;
    $article->save();
    return response()->json([
        'message' => '创建成功!'
    ]);
  }
  /**
   * 删除文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function destroy_api($id)
  {
    $article = Article::findOrFail($id);
    $article->delete();
    return response()->json([
        'message' => '删除成功!'
    ]);
  }
}
