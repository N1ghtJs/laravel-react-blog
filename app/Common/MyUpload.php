<?php

namespace App\Common;

use Illuminate\Http\Request;
use Qcloud\Cos\Client;
use App\Setting;

class MyUpload
{
    /**
    * 根据设置的存储盘存储
    */
    static public function uploadFile($file)
    {
        $fileName = md5_file($file).'.'.$file->extension();

        $file_disk = Setting::where('key', 'file_disk')->value('value');
        if ($file_disk == 'cos') {
            //使用：腾讯云静态存储 COS
            $cosClient = new Client(array('region' => env('COS_REGION'),
            'credentials'=> array(
                'appId' => env('COS_APPID'),
                'secretId' => env('COS_KEY'),
                'secretKey' => env('COS_SECRET'))));

            $result = $cosClient->putObject(array(
                'Bucket' => env('COS_BUCKET'),
                'Key' => $fileName,
                'Body' => file_get_contents($file),
                'ServerSideEncryption' => 'AES256'));

            //return $result['ObjectURL']; 此项可生成 COS 完整地址
        }else {
            //使用：默认 Storage local 存储
            $file->storeAs('public/images', $fileName);
        }

        return $fileName;
    }

    /**
    * 根据设置的存储盘和相对路径生成绝对路径
    */
    static public function generateUrl($url)
    {
        $file_disk = Setting::where('key', 'file_disk')->value('value');
        if ($file_disk == 'cos') {
            return 'http://images-1253193383.cosbj.myqcloud.com/' . $url;
        }else {
            return '/storage/images/' . $url;
        }
    }
}
