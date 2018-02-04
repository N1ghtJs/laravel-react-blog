@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <!-- 轮播 -->
          <!-- <div id="carousel-example-generic" class="carousel slide z-slide" data-ride="carousel" style="margin-bottom: 20px;">
              <div class="carousel-inner z-inner" role="listbox">
                  <div class="item active">
                      <a href="#"><img src="default.jpg" class="img-responsive" alt="imax1"></a>
                      <div class="z-content">
                          <p class="z-title">Measure Anything in Laravel with StatsD</p>
                          <p class="z-intro">I want to show you some tools and techniques you can use to measure anything and everything that you want in your Laravel applications with StatsD. These ideas are simple and not new; yet, I believe that the simplicity and power are what makes StatsD great.</p>
                          <div class="z-center-horizontal">
                              <a href="" class="z-button">read more..</a>
                          </div>
                      </div>
                  </div>
                  <div class="item">
                      <a href="#"><img src="/img/default2.png" class="img-responsive" alt="imax2"></a>
                      <div class="z-content">
                          <p class="z-title">Measure Anything in Laravel with StatsD</p>
                          <p class="z-intro">I want to show you some tools and techniques you can use to measure anything and everything that you want in your Laravel applications with StatsD. These ideas are simple and not new; yet, I believe that the simplicity and power are what makes StatsD great.</p>
                          <div class="z-center-horizontal">
                              <a href="" class="z-button">read more..</a>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="z-slide-button">
                  <a class="z-location-left" href="#carousel-example-generic" data-slide="prev">
                      <span class="z-button glyphicon glyphicon-chevron-left"></span>
                  </a>
                  <a class="z-location-right" href="#carousel-example-generic" data-slide="next">
                      <span class="z-button glyphicon glyphicon-chevron-right"></span>
                  </a>
              </div>
          </div> -->

          <!-- 最新文章 -->
          @foreach($articles as $article)
          <div class="z-article-vertical">
              <img src="{{ $article->cover == '' ? 'default.jpg' : $article->cover }}" class="img-responsive z-cover" alt="imax1">
              <div class="z-content">
                  <p class="z-title">{{ $article->title }}</p>
                  <p class="z-intro">{{ $article->content }}</p>
                  <div class="z-center-horizontal">
                      <a href="{{ route('articles.show', $article->id) }}" class="z-button">read more..</a>
                  </div>
              </div>
          </div>
          @endforeach
        </div>
        <!-- <div class="col-md-4">

        </div> -->
    </div>
</div>
@endsection
