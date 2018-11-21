<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\UploadController;
use App\User;

class UserController extends Controller
{
    public function show_api($id)
    {
        return response()->json([
            'data' => User::findOrFail($id)
        ]);
    }

    public function update_api(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->name = $request->name;
        $user->email = $request->email;
        if ($request->avatar) {
            $user->avatar = UploadController::uploadFileToCOS($request->avatar);
        }
        $user->save();
        return response()->json([
            'message' => '保存成功！',
            'data' => $user
        ]);
    }
}
