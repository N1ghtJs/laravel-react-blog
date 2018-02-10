<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Common\MyFunction;
use App\Comment;
use Auth;

class CommentController extends Controller
{
  /**
   * 保存评论
   *
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $city = MyFunction::getCity($request->ip());
    $comment = new Comment;
    $comment->user_id = Auth::id() ? Auth::id() : 0;
    $comment->article_id = $request->article_id;
    $comment->content = $request->content;
    $comment->name = $request->name;
    $comment->email = $request->email;
    $comment->website = $request->website;
    $comment->ip = $request->ip();
    $comment->city = $city['region'].' '.$city['city'];
    $comment->save();
    return back()->with('message', '留言成功！');
  }
  /**
   * 返回所有的评论 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $comments = Comment::orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($comments); $i++) {
      $comments[$i]->key = $comments[$i]->id;
      $comments[$i]->content = str_limit($comments[$i]->content, 100);
      $comments[$i]->article_name = $comments[$i]->article->title;
      $comments[$i]->location = '/articles/' . $comments[$i]->article_id . '#comment' .$comments[$i]->id;
    }
    return $comments;
  }
  /**
   * 删除评论 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function destroy_api($id)
  {
    $comment = Comment::findOrFail($id);
    //TODO 删除评论下的回复
    $comment->delete();
    return response()->json([
        'message' => '删除成功!'
    ]);
  }
}
