<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Common\Common;
use App\Comment;

class CommentController extends Controller
{
  /**
   * 保存评论
   *
   * @return \Illuminate\Http\Response
   */
  public function store(Request $request)
  {
    $city = Common::getCity($request->ip());
    $comment = new Comment;
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
}
