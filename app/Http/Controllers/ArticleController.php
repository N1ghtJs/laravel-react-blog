<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;

class ArticleController extends Controller
{
  /**
   * 返回所有的文章
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
    $articles = Article::all();
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->key = $articles[$i]->id;
      $articles[$i]->content = str_limit($articles[$i]->content, 100);
    }
    return $articles;
  }
  /**
   * 返回某个文章
   *
   * @return \Illuminate\Http\Response
   */
  public function show($id)
  {
    $article = Article::findOrFail($id);
    return $article;
  }
}
