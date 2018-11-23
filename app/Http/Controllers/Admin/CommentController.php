<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Common\MyFunction;
use App\Comment;
use Auth;

class CommentController extends Controller
{
    /**
     * 返回所有的评论 [API]
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $comments = Comment::orderBy('created_at', 'desc')->paginate(2);
        for ($i=0; $i < sizeof($comments); $i++) {
            $comments[$i]->key = $comments[$i]->id;
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
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        //TODO 删除评论下的回复
        $comment->delete();
        return response()->json([
            'message' => '删除成功!'
        ]);
    }
}
