<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Session\DatabaseSessionHandler;
use League\HTMLToMarkdown\HtmlConverter;
use App\Common\MyUpload;
use App\Article;
use App\Comment;
use App\Visit;
use App\Tag;
use App\User;
use App\Search;
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
      foreach ($articles as $article) {
          $article->cover = imageURL($article->cover);
          $article->content = str_limit(strip_tags($article->content_html), 150);
          $article->created_at_date = $article->created_at->toDateString();
          $article->updated_at_diff = $article->updated_at->diffForHumans();
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

	  // 保存（更新）搜索关键词
	  $search = Search::where('name', $key)->first();
	  if (!$search) {
	  	$search = new Search;
		$search->name = $key;
		$search->save();
	  }
	  $search->increment('search_num');

      $articles = Article::when($key, function($query) use ($key){
          return $query->where('title', 'like', '%'.$key.'%');
      })->where('is_hidden', 0)->orderBy('created_at', 'desc')->paginate(10);
      foreach ($articles as $article) {
          $article->cover = imageURL($article->cover);
          $article->content = str_limit(strip_tags($article->content_html), 150);
          $article->created_at_date = $article->created_at->toDateString();
          $article->updated_at_diff = $article->updated_at->diffForHumans();
      }

	  $searches = Search::where('search_num', '>', 1)->orderBy('search_num')->limit(10)->get();
      return view('articles.list', compact('articles', 'searches'));
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
      $article->created_at_date = $article->created_at->toDateString();
      $comments = $article->comments()->where('parent_id', 0)->orderBy('created_at', 'desc')->get();

      //处理评论，关联回复
      foreach ($comments as $comment) {
          $comment->created_at_diff = $comment->created_at->diffForHumans();
          if ($comment->name) {
              $comment->avatar = mb_substr($comment->name, 0, 1, 'utf-8');
          }else {
              $comment->avatar = '匿';
              $comment->name = 'null';

          }
          if ($comment->user_id == 1) {
              $comment->master = User::select('name', 'avatar')->findOrFail(1);
              $comment->master->avatar = imageURL($comment->master->avatar);
          }

          // $comment->replys = $comment->replys;
          foreach ($comment->replys as $reply) {
              $reply->created_at_diff = $reply->created_at->diffForHumans();
              $reply->target_name = Comment::findOrFail($reply->target_id)->name;
              if ($reply->name) {
                  $reply->avatar = mb_substr($reply->name, 0, 1, 'utf-8');
              }else {
                  $reply->avatar = '匿';
                  $reply->name = 'null';

              }
              if ($reply->user_id == 1) {
                  $reply->master = User::select('name', 'avatar')->findOrFail(1);
                  $reply->master->avatar = imageURL($reply->master->avatar);
              }
          }
      }

      //自动填写
      $input = (object)[];
      if (Auth::id()) {
          $input = User::select('name', 'email', 'website')->findOrFail(Auth::id());
      }else {
          $comment = Comment::where('ip', $request->ip())->orderBy('created_at', 'desc')->select('name', 'email', 'website')->first();
          $input = $comment ? $comment : $input;
      }

      return view('articles.show', compact('article', 'comments', 'input'));
  }

}
