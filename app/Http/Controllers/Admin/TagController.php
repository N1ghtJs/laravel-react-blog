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
        $tagsArr = array();
        foreach ($tags as $tag) {
            $tag->key = $tag->id;
            array_push($tagsArr, $tag->name);
        }
        return response()->json([
            'tags' => $tags,
            'tagsArr' => $tagsArr,
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
