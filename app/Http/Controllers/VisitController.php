<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Visit;

class VisitController extends Controller
{
  /**
   * 返回所有的访问 [API]
   *
   * @return \Illuminate\Http\Response
   */
  public function index_api()
  {
    $visits = Visit::orderBy('created_at', 'desc')->get();
    for ($i=0; $i < sizeof($visits); $i++) {
      $visits[$i]->key = $visits[$i]->id;
      $visits[$i]->client_limit = str_limit($visits[$i]->client, 10);
    }
    return $visits;
  }
}
