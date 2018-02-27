<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVisitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->increments('id');
            $table->string('ip');//访客IP
            $table->string('path')->nullable();//访问路劲
            $table->string('page')->nullable();//访问页面描述
            $table->string('title')->nullable();//访问页面 title
            $table->string('city')->nullable();//访客 IP 对应城市
            $table->integer('user_id')->default(0);//如果是登录用户记录 id
            $table->string('client')->nullable();//客户端信息
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('visits');
    }
}
