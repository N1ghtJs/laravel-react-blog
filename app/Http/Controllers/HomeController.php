<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;
use App\Visit;

class HomeController extends Controller
{
    /**
     * Show the home.
     *
     * @return \Illuminate\Http\Response
     */
    public function home(Request $request)
    {
        $articles = Article::where('is_hidden', 0)->orderBy('is_top', 'desc')->orderBy('created_at', 'desc')->limit(10)->get();
        foreach ($articles as $article) {
            $article->cover = imageURL($article->cover);
            $article->content = str_limit(strip_tags($article->content_html), 500);
            $article->created_at_date = $article->created_at->toDateString();
            $article->updated_at_diff = $article->updated_at->diffForHumans();
        }
        return view('home', compact('articles'));
    }
}
