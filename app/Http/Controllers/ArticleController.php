<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Session\DatabaseSessionHandler;
use League\HTMLToMarkdown\HtmlConverter;
use App\Article;
use App\Comment;
use App\Visit;
use App\Tag;
use Auth;

class ArticleController extends Controller
{
  /**
   * 跳转全部文章页
   *
   * @return \Illuminate\Http\Response
   */
  public function list()
  {
    $articles = Article::where('is_hidden', 0)->orderBy('created_at', 'desc')->paginate(10);
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->content_html = str_limit(strip_tags($articles[$i]->content_html), 150);
      $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    $tags = Tag::all();
    return view('articles.list', compact('articles', 'tags'));
  }

  /**
   * 搜索文章
   *
   * @return \Illuminate\Http\Response
   */
  public function search(Request $request)
  {
    $key = $request->key;
    $articles = Article::when($key, function($query) use ($key){
      return $query->where('title', 'like', '%'.$key.'%');
    })->where('is_hidden', 0)->orderBy('created_at', 'desc')->paginate(10);
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->content_html = str_limit(strip_tags($articles[$i]->content_html), 150);
      $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    $tags = Tag::all();
    return view('articles.list', compact('articles', 'tags'));
  }

  /**
   * 跳转某篇文章
   *
   * @return \Illuminate\Http\Response
   */
  public function show(Request $request, $id)
  {
    $article = Article::findOrFail($id);
    $article->increment('view');
    //Visit::record($request, '文章', $article->title);
    $article->created_at_date = $article->created_at->toDateString();
    $comments = $article->comments()->where('parent_id', 0)->orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($comments); $i++) {
      $comments[$i]->created_at_diff = $comments[$i]->created_at->diffForHumans();
      $comments[$i]->avatar_text = mb_substr($comments[$i]->name,0,1,'utf-8');
      $replys = $comments[$i]->replys;
      for ($j=0; $j < sizeof($replys); $j++) {
        $replys[$j]->created_at_diff = $replys[$j]->created_at->diffForHumans();
        $replys[$j]->avatar_text = mb_substr($replys[$j]->name,0,1,'utf-8');
      }
    }
    $inputs = new CommentInputs;
    if (Auth::id()) {
      $inputs->name = Auth::user()->name;
      $inputs->email = Auth::user()->email;
      $inputs->website = Auth::user()->website;
    }else {
      $comment = Comment::where('ip', $request->ip())->orderBy('created_at', 'desc')->first();
      if ($comment) {
        $inputs->name = $comment->name;
        $inputs->email = $comment->email;
        $inputs->website = $comment->website;
      }
    }
    return view('articles.show', compact('article', 'comments', 'inputs'));
  }



}

class CommentInputs {
  public $name = '';
  public $email = '';
  public $website = '';
}
