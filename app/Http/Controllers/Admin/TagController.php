<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Tag;

class TagController extends Controller
{

    public function index()
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

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->articles()->detach();
        $tag->delete();
        return response()->json([
            'message' => '删除成功！'
        ]);
    }
}
