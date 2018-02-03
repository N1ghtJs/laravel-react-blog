@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="z-article-show">
            <h1 class="z-title">{{ $article->title }}</h1>
            <div class="z-content">
              {!! $article->content !!}
            </div>
          </div>
        </div>
    </div>
</div>
@endsection
