@extends('layouts.app')

@section('title', '全部文章')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-7 col-md-offset-1">
          @foreach ( $articles as $article)
            <div class="z-article-horizontal">
              <div class="row">
                <div class="col-xs-8">
                    <a href="{{ route('articles.show', $article->id) }}"><p class="z-title">{{ $article->title }}</p></a>
                    <p class="z-info hidden-xs">发表于 {{ $article->created_at_date }} · 最后访问 {{ $article->updated_at_diff }}</span>
                    <p class="z-intro">{{ $article->content }}</p>
                    <div class="hidden-xs">
                      @if(count($article->tags))
                        @foreach($article->tags as $tag)
                          <span class="label label-info" style="font-size:11px;padding:1px 5px">{{ $tag->name }}</span>
                        @endforeach
                      @endif
                    </div>
                </div>
                <div class="col-xs-4" style="padding-left:0">
                  <a href="{{ route('articles.show', $article->id) }}"><img src="{{ $article->cover == '' ? '/default.jpg' : $article->cover }}" class="img-responsive z-cover" alt="imax1"></a>
                </div>
              </div>
            </div>

          @endforeach
          {{ $articles->links() }}
        </div>
        <div class="col-md-3">
          <div class="" style="height:500px;width:100%">

          </div>
        </div>
    </div>
</div>
@endsection
