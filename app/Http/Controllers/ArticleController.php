<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Session\DatabaseSessionHandler;
use League\HTMLToMarkdown\HtmlConverter;
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
      $articles[$i]->content = str_limit(strip_tags($articles[$i]->content), 100);
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    return $articles;
  }
  /**
   * 跳转某篇文章
   *
   * @return \Illuminate\Http\Response
   */
  public function show(Request $request, $id)
  {
    Article::update_view($id);
    $article = Article::findOrFail($id);
    $article->created_at_date = $article->created_at->toDateString();
    $comments = $article->comments()->orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($comments); $i++) {
      $comments[$i]->created_at_diff = $comments[$i]->created_at->diffForHumans();
    }
    return view('articles.show', compact('article', 'comments'));
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
   * 创建或更新文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function store_api(Request $request)
  {
    if ($request->id) {
      $article = Article::findOrFail($request->id);
      $article->title = $request->title;
      $article->cover = $request->cover;
      $article->content = $request->content;
      $article->save();
      return response()->json([
          'message' => '更新成功!'
      ]);
    }else{
      $article = new Article;
      $article->title = $request->title;
      $article->cover = $request->cover;
      $article->content = $request->content;
      $article->save();
      return response()->json([
          'message' => '创建成功!'
      ]);
    }
  }
  /**
   * 发表（或隐藏）文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function publish_api($id)
  {
    $article = Article::findOrFail($id);
    if ($article->is_hidden) {
      $article->is_hidden = 0;
      $article->save();
      return response()->json([
          'message' => '文章已发表！'
      ]);
    }else {
      $article->is_hidden = 1;
      $article->save();
      return response()->json([
          'message' => '文章已切换为笔记！'
      ]);
    }
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
  /**
   * html 转 markdown [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function markdown_api(Request $request)
  {
    $converter = new HtmlConverter();
    return $converter->convert($request->content);
  }
}
