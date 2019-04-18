<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{
    /**
     * 返回标签对应的文章
     *
     * @return \Illuminate\Http\Response
     */
    public function show($name)
    {
        $articles = Tag::where('name', $name)->first()->articles()->where('is_hidden', 0)->orderBy('view', 'desc')->paginate(10);
		foreach ($articles as $article) {
			$article->cover = imageURL($article->cover);
            $articles->content = str_limit(strip_tags($articles[$i]->content), 150);
            $articles->created_at_date = $articles->created_at->toDateString();
            $articles->updated_at_diff = $articles->updated_at->diffForHumans();
		}
        $tags = Tag::all();
        return view('articles.list', compact('articles', 'tags'));
    }
}
