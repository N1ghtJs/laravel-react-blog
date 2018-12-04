<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    public function changePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if (Hash::check($request->password, $user->password)) {
            $user->password = bcrypt($request->newPassword);
            $user->save();
            return response()->json([
              'status' => 0,
              'message' => '修改成功！',
            ]);
        }else {
            return response()->json([
              'status' => 1,
              'message' => '原密码错误！',
            ]);
        }
    }
}
