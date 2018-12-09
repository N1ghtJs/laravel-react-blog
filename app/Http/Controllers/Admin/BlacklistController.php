<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Blacklist;

class BlacklistController extends Controller
{
    public function index()
    {
        $blacks = Blacklist::all();
        return response()->json([
            'blacks' => $blacks
        ]);
    }

    public function store(Request $request)
    {
        $ip = $request->ip;
        $black = Blacklist::where('ip', $ip)->first();
        if ($black) {
            return response()->json([
                'message' => '该IP已存在于黑名单中！'
            ]);
        }else {
            $black = new Blacklist;
            $black->ip = $ip;
            $black->save();
            return response()->json([
                'message' => '该IP已被加入黑名单！'
            ]);
        }
    }

    public function destroy($id)
    {
        $black = Blacklist::findOrFail($id);
        $black->delete();
        return response()->json([
            'message' => '删除成功！'
        ]);
    }
}
