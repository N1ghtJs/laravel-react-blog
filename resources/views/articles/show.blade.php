@extends('layouts.app')

@section('title', $article->title)

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="z-article-show">
            <h1 class="z-title">{{ $article->title }}</h1>
            <p class="z-info"><span style="margin-right:20px">{{$article->created_at_date}}</span>sad creeper</p>
            <div class="z-content">
              {!! $article->content !!}
            </div>
            <p class="z-counter">阅读 {{ $article->view }}</p>
          </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
    wx.config(<?php echo $app->jssdk->buildConfig(array('onMenuShareAppMessage', 'onMenuShareTimeline'), true) ?>);
    wx.ready(function(res) {
        wx.onMenuShareAppMessage({
            title: {{ $article->cover }},
            desc: '23333',
            link: res.url,
            imgUrl: {{ $article->cover }},
            trigger: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {}
        });
        wx.onMenuShareTimeline({
            title: {{ $article->cover }},
            desc: '23333',
            link: res.url,
            imgUrl: {{ $article->cover }},
            trigger: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {}
        });
    });
</script>

@endsection
