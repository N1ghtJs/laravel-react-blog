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
        $comment->parent_id = $request->parent_id ? $request->parent_id : 0;
        $comment->article_id = $request->article_id;
        $comment->content = $request->content;
        $comment->name = $request->name;
        $comment->email = $request->email;
        $comment->website = $request->website;
        $comment->ip = $request->ip();
        $comment->city = $city['region'].' '.$city['city'];
        $comment->target_name = $request->target_name;
        $comment->save();
        return back()->with('message', '留言成功！');
    }
}
