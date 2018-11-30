<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Setting;

class SettingController extends Controller
{

    public function index(Request $request)
    {
        $data = Setting::getSettings($request->keys);
        return response()->json([
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            $setting = Setting::where('key', $key)->first();
            if ($setting) {
                $setting->value = $value;
                $setting->save();
            }else {
                $setting = new Setting();
                $setting->key = $key;
                $setting->value = $value;
                $setting->save();
            }
        }
        return response()->json([
            'message' => '保存成功！'
        ]);
    }
}
