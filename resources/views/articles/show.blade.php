@extends('layouts.app')

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
