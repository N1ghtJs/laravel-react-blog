<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Visit;
use App\Count;

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
        return view('admin');
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

      return response()->json([
        'visits_count' => $visits_count,
        'visits_arr' => (array)$visits_arr,
        'visits_today' => $visits_today,
        'visits_day_max' => $visits_day_max->value
      ]);
    }
}
