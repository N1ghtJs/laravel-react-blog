<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Common\MyUpload;
use App\User;

class UserController extends Controller
{

    public function show($id)
    {
        return response()->json([
            'user' => User::findOrFail($id)
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->avatar) {
            $user->avatar = MyUpload::uploadFile($request->avatar);
        }
        $user->save();
        return response()->json([
            'message' => '保存成功！'
        ]);
    }
}
