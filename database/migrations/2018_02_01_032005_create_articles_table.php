<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('cover')->nullable();
            $table->longText('content_raw')->nullable();
            $table->longText('content_html')->nullable();
            $table->longText('content_markdown')->nullable();
            $table->boolean('is_markdown')->default(0);
            $table->boolean('is_top')->default(0);
            $table->boolean('is_hidden')->default(1);
            $table->integer('view')->default(0);
            $table->integer('comment')->default(0);
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
        Schema::dropIfExists('articles');
    }
}
