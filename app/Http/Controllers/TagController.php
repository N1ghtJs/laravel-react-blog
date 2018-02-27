<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Tag;

class TagController extends Controller
{
  /**
   * 返回所有的标签 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $tags = Tag::all();
    $tags_arr = array();
    for ($i=0; $i < sizeof($tags); $i++) {
      array_push($tags_arr, $tags[$i]->name);
    }
    return response()->json([
      'tags' => $tags,
      'tags_arr' => $tags_arr,
    ]);
  }
}
