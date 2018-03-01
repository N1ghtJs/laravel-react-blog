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
   * 返回所有的文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $articles = Article::orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->key = $articles[$i]->id;
      $articles[$i]->content = str_limit(strip_tags($articles[$i]->content), 60);
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    return $articles;
  }

  /**
   * 跳转全部文章页
   *
   * @return \Illuminate\Http\Response
   */
  public function list()
  {
    $articles = Article::where('is_hidden', 0)->orderBy('created_at', 'desc')->paginate(10);
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->content = str_limit(strip_tags($articles[$i]->content), 150);
      $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    return view('articles.list', compact('articles'));
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
    Visit::record($request, '文章', $article->title);
    $article->created_at_date = $article->created_at->toDateString();
    $comments = $article->comments()->where('parent_id', 0)->orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($comments); $i++) {
      $comments[$i]->created_at_diff = $comments[$i]->created_at->diffForHumans();
      $comments[$i]->avatar_text = $comments[$i]->name[0];
      $replys = $comments[$i]->replys;
      for ($j=0; $j < sizeof($replys); $j++) {
        $replys[$j]->created_at_diff = $replys[$j]->created_at->diffForHumans();
        $replys[$j]->avatar_text = $replys[$j]->name[0];
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
  /**
   * 返回某个文章 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function show_api($id)
  {
    $article = Article::findOrFail($id);
    for ($i=0; $i < sizeof($article->tags); $i++) {
      $article->tags[$i] = $article->tags[$i]->name;
    }

    $tags= Tag::all();
    for ($i=0; $i < sizeof($tags); $i++) {
      $tags[$i] = $tags[$i]->name;
    }
    return response()->json([
      'article' => $article,
      'tags_arr' => $tags,
    ]);
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
      $message = '更新成功！';
    }else{
      $article = new Article;
      $message = '创建成功！';
    }
    $article->title = $request->title;
    $article->cover = $request->cover;
    $article->content = $request->content;
    $article->save();
    //处理标签
    //先删除文章关联的所有标签
    //遍历标签，如果标签存在则添加关联，如果标签不存在先创建再添加关联
    $article->tags()->detach();
    for ($i=0; $i < sizeof($request->tags); $i++) {
      $tag = Tag::where('name', $request->tags[$i])->first();
      if ($tag) {
        $article->tags()->attach($tag->id);
      }else {
        $tag = new Tag;
        $tag->name = $request->tags[$i];
        $tag->save();
        $article->tags()->attach($tag->id);
      }
    }
    return response()->json([
        'message' => $message
    ]);
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

class CommentInputs {
  public $name = '';
  public $email = '';
  public $website = '';
}
