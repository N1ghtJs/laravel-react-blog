<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;

class HomeController extends Controller
{
    /**
     * Show the home.
     *
     * @return \Illuminate\Http\Response
     */
    public function home()
    {
      $articles = Article::orderBy('created_at', 'desc')->limit(5)->get();
      for ($i=0; $i < sizeof($articles); $i++) {
        $articles[$i]->content = strip_tags(str_limit($articles[$i]->content, 200));
      }
      return view('home', compact('articles'));
    }
}
