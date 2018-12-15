<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\CommentRemind;
use App\Common\MyFunction;
use App\Comment;
use App\User;
use App\Blacklist;
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
        $ip = $request->ip();
        if (Blacklist::check($ip)) {
            return back()->with('error', '留言失败2333');
        }

        $content = $request->content;
        if(!preg_match('/[\x{4e00}-\x{9fa5}]/u', $content) && preg_match('/http:\/\/|https:\/\//u', $content)) {
            return back()->with('error', '疑似广告');
        }

        $comment = new Comment;
        $comment->user_id = Auth::id() ? Auth::id() : 0;

        if ($request->parent_id) {
            $comment->parent_id = $request->parent_id;
            $comment->target_id = $request->target_id;
        }else {
            $comment->parent_id = 0;
            $comment->target_id = 0;
        }
        $comment->article_id = $request->article_id;
        $comment->content = $content;
        $comment->name = $request->name;
        $comment->email = $request->email;
        $comment->website = $request->website;
        $comment->ip = $ip;
        // $comment->city = $city['region'].' '.$city['city'];
        $comment->save();

        //发送邮件
        if ($request->parent_id) {
            $commentTarget = Comment::findOrFail($request->target_id);
            $url = url("/articles/{$comment->article->id}#comment{$comment->id}");
            if (setting('reply_email')) {
                try {
                    Mail::to($commentTarget->email)
                        ->send(new CommentRemind($commentTarget->content, $comment, $url));
                }catch (\Exception $e) {}
            }
        }else {
            $url = url("/articles/{$comment->article->id}#comment{$comment->id}");
            if (setting('comment_email')) {
                try {
                    Mail::to(User::findOrFail(1))
                        ->send(new CommentRemind($comment->article->title, $comment, $url));
                }catch (\Exception $e) {}
            }
        }
        return back()->with('message', '留言成功！');
    }
}
