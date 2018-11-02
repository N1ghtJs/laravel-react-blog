<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Setting;

class SettingController extends Controller
{
  public function index_api(Request $request)
  {
    $keys = explode(",", $request->keys);
    $settings = Setting::whereIn('key', $keys)->get();
    $data = [];
    foreach ($settings as $setting) {
      $data[$setting->key] = $setting->value;
    }
    return response()->json([
        'data' => $data
    ]);
  }
  public function store_api(Request $request)
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
