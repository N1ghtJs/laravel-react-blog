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
  public function show($id)
  {
    $articles = Tag::findOrFail($id)->articles()->where('is_hidden', 0)->orderBy('view', 'desc')->paginate(10);
    for ($i=0; $i < sizeof($articles); $i++) {
      $articles[$i]->content = str_limit(strip_tags($articles[$i]->content), 150);
      $articles[$i]->created_at_date = $articles[$i]->created_at->toDateString();
      $articles[$i]->updated_at_diff = $articles[$i]->updated_at->diffForHumans();
    }
    $tags = Tag::all();
    return view('articles.list', compact('articles', 'tags'));
  }

  /**
   * 返回所有的标签 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $tags = Tag::all();
    for ($i=0; $i < sizeof($tags); $i++) {
      $tags[$i]->key = $tags[$i]->id;
    }
    $tags_arr = array();
    for ($i=0; $i < sizeof($tags); $i++) {
      array_push($tags_arr, $tags[$i]->name);
    }
    return response()->json([
      'tags' => $tags,
      'tags_arr' => $tags_arr,
    ]);
  }

  /**
   * 删除标签（和对应关联） [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function destroy_api($id)
  {
    $tag = Tag::findOrFail($id);
    $tag->articles()->detach();
    $tag->delete();
    return response()->json([
      'message' => '删除成功！'
    ]);
  }
}
