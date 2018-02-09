<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddViewAndCommentColumnsToArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('articles', function (Blueprint $table) {
          $table->integer('view')->default(0);
          $table->integer('comment')->default(0);
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('articles', function (Blueprint $table) {
          $table->dropColumn('view');
          $table->dropColumn('comment');
      });
    }
}
