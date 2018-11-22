<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Visit;
use App\Count;
use App\User;
use App\Setting;

class AdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('super');
    }

    /**
     * Show the application admin.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //挂载博主信息
        $master = User::findOrFail(1);

        //挂载存储盘信息
        $file_disk = Setting::where('key', 'file_disk')->value('value');

        return view('admin', [
            'master' => $master,
            'file_disk' => $file_disk
        ]);
    }

    /**
     * 返回面板数据
     *
     * @return \Illuminate\Http\Response
     */
    public function dashboard_api()
    {
      $visits_count = DB::table('visits')->count();

      $date = Carbon::today()->subDay(19);
      $visits_arr = array();
      $visits_max = 0;
      for ($i=0; $i < 20; $i++) {
        $count = DB::table('visits')->whereDate('created_at', $date->toDateString())->count();
        array_push($visits_arr, array(
          'x' => $date->toDateString(),
          'y' => $count
        ));
        $date = $date->addDay();
        if ($count > $visits_max){
          $visits_max = $count;
        }
      }
      $visits_today = $visits_arr[19]['y'];
      $visits_day_max = Count::where('key', 'visits_day_max')->first();
      if ($visits_max > $visits_day_max->value) {
        $visits_day_max->value = $visits_max;
        $visits_day_max->save();
      }

      $articles_count = DB::table('articles')->count();
      $articles_today = DB::table('articles')->whereDate('created_at', Carbon::today()->toDateString())->count();
      $comments_count = DB::table('comments')->count();
      $comments_today = DB::table('comments')->whereDate('created_at', Carbon::today()->toDateString())->count();

      return response()->json([
        'visits_count' => $visits_count,
        'visits_arr' => (array)$visits_arr,
        'visits_today' => $visits_today,
        'visits_day_max' => $visits_day_max->value,
        'articles_count' => $articles_count,
        'articles_today' => $articles_today,
        'comments_count' => $comments_count,
        'comments_today' => $comments_today,
      ]);
    }
}
