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
  public function upload_api(Request $request)
  {
    $cosClient = new Client(array('region' => env('COS_REGION'),
    'credentials'=> array(
        'appId' => env('COS_APPID'),
        'secretId' => env('COS_KEY'),
        'secretKey' => env('COS_SECRET'))));

    try {
        $result = $cosClient->putObject(array(
            'Bucket' => 'images-1253193383',
            'Key' => md5_file($request->file).'.'.$request->file->extension(),
            'Body' => file_get_contents($request->file),
            'ServerSideEncryption' => 'AES256'));
        return response()->json([
            'message' => '上传成功!',
            'ObjectURL' => $result['ObjectURL']
        ]);
    } catch (\Exception $e) {
        echo "$e\n";
    }
  }
}
