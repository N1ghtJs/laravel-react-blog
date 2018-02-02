<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
  /**
   * 默认上传，使用腾讯云静态存储
   *
   * @return \Illuminate\Http\Response
   */
  public function index()
  {
      return view('welcome');
  }
}
