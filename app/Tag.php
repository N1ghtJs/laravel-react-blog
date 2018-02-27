<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
      'name', 'article_num', 'search_num'
  ];

  /**
     * 获得此标签下的文章
     */
    public function articles()
    {
        return $this->belongsToMany('App\Article');
    }
}
