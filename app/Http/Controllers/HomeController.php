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
      Visit::record($request, '首页');
      $articles = Article::where('is_hidden', 0)->orderBy('created_at', 'desc')->limit(5)->get();
      for ($i=0; $i < sizeof($articles); $i++) {
        $articles[$i]->content = str_limit(strip_tags($articles[$i]->content), 300);
        $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
        $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
      }
      return view('home', compact('articles'));
    }
}
