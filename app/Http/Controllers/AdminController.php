<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Visit;

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
      for ($i=0; $i < 20; $i++) {
        array_push($visits_arr, array(
          'x' => $date->toDateString(),
          'y' => DB::table('visits')->whereDate('created_at', $date->toDateString())->count()
        ));
        $date = $date->addDay();
      }
      $visits_today = $visits_arr[19]['y'];

      return response()->json([
        'visits_count' => $visits_count,
        'visits_arr' => (array)$visits_arr,
        'visits_today' => $visits_today
      ]);
    }
}
