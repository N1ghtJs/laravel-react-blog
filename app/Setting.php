<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{

    public static function getSetting($key)
    {
        return Setting::where('key', $key)->value('value');
    }

    public static function getSettings($keys)
    {
        $keys = explode(",", $keys);
        $settings = Setting::whereIn('key', $keys)->get();
        $data = [];
        foreach ($settings as $setting) {
            $data[$setting->key] = $setting->value;
        }
        return (object)$data;
    }
}
