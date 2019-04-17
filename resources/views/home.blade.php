@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <!-- 最新文章 -->
          @foreach($articles as $article)
          <div class="z-article-vertical">
              <img src="{{ $article->cover == '' ? 'default.jpg' : $article->cover }}" class="img-responsive z-cover" alt="imax1">
              <div class="z-content">
                  @if(count($article->tags))
                    @foreach($article->tags as $tag)
                      <span class="label label-info" style="font-size:11px;padding:1px 5px">{{ $tag->name }}</span>
                    @endforeach
                  @endif
                  <p class="z-title">{{ $article->title }}</p>
                  <p class="z-info">- 发表于 {{ $article->created_at_date }} · 最后访问 {{ $article->updated_at_diff }} -</span>
                  <p class="z-intro">{{ $article->content }}</p>

                  <div class="z-center-horizontal">
                      <a href="{{ route('articles.show', $article->id) }}" class="z-button">read more..</a>
                  </div>
              </div>
          </div>
          @endforeach
		  @if(count($articles) == 10)
			  <a href="{{ route('articles.list') }}" class="z-home-more-articles">
			  	更多文章 >>
			  </a>
		  @endif
        </div>
        <!-- <div class="col-md-4">

        </div> -->
    </div>
</div>
@endsection
