<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
      'title', 'cover', 'content', 'is_top', 'is_hidden', 'view', 'comment'
  ];

  /**
     * 获得此博客文章的评论
     */
  public function comments()
  {
      return $this->hasMany('App\Comment');
  }

  /**
     * 获得此博客文章的标签
     */
    public function tags()
    {
        return $this->belongsToMany('App\Tag');
    }

  /**
   * 更新浏览量
   * @var [int]
   */
  static public function update_view($id)
  {
     $article = Article::findOrFail($id);
     $article->view = $article->view + 1;
     $article->update([
         'view' => $article->view,
     ]);
  }

   /**
    * 更新评论量
    * @var [int]
    */
   static public function update_comment($id)
   {
       $article = Article::findOrFail($id);
       $article->comment = $article->comment + 1;
       $article->update([
           'comment' => $article->comment,
       ]);
   }
}
