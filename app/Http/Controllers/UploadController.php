<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Qcloud\Cos\Client;

class UploadController extends Controller
{
  /**
   * 默认上传，使用腾讯云静态存储
   * images-1253193383
   *
   * @return \Illuminate\Http\Response
   */
  static public function uploadFileToCOS($file)
  {
    $cosClient = new Client(array('region' => env('COS_REGION'),
    'credentials'=> array(
        'appId' => env('COS_APPID'),
        'secretId' => env('COS_KEY'),
        'secretKey' => env('COS_SECRET'))));

    $key = md5_file($file).'.'.$file->extension();
    $result = $cosClient->putObject(array(
        'Bucket' => 'images-1253193383',
        'Key' => $key,
        'Body' => file_get_contents($file),
        'ServerSideEncryption' => 'AES256'));
    return $key; //图片名称
    //return $result['ObjectURL']; //图片地址
  }
}
