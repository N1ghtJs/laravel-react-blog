<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Article;

class Test extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'command:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '用来执行一些临时任务。';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		$this->changeImageUrlInArticle();
    }

	/**
	 * 文章内容中存储的图片信息是绝对路径，当图片地址变化后，图片就会失效，此时需要批量修改图片 url
	 */
	public function changeImageUrlInArticle()
	{
		$articles = Article::all();

		foreach ($articles as $article) {
			$article->content_raw = str_replace('http://images-1253193383.cosbj.myqcloud.com/', '/storage/images/', $article->content_raw);
			$article->content_html = str_replace('http://images-1253193383.cosbj.myqcloud.com/', '/storage/images/', $article->content_html);
			$article->content_raw = str_replace('http://images-1253193383.cos.ap-beijing.myqcloud.com/', '/storage/images/', $article->content_raw);
			$article->content_html = str_replace('http://images-1253193383.cos.ap-beijing.myqcloud.com/', '/storage/images/', $article->content_html);

			$article->save();
		}
	}
}
