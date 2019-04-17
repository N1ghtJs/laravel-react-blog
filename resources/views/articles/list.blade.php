@extends('layouts.app')

@section('title', '全部文章')

@section('content')
<div class="container" style="margin-bottom:20px">
    <div class="row">
        <div class="col-md-7 col-md-offset-1">
          	<div class="">
				@isset($tags)
					<span>热门关键词：</span>
					@foreach($tags as $tag)
						<a href="{{ route('tags.show', $tag->name) }}"><span style="margin-right:10px">{{ $tag->name }}</span></a>
					@endforeach
				@endisset

				@isset($searches)
					<span>搜索最多：</span>
					@foreach($searches as $search)
						<a href="{{ route('articles.search.get', $search->name) }}"><span style="margin-right:10px">{{ $search->name }}</span></a>
					@endforeach
				@endisset
          	</div>
          @if(count($articles))
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
                    <a href="{{ route('articles.show', $article->id) }}"><img src="{{ $article->cover or '/default.jpg' }}" class="img-responsive z-cover" alt="imax1"></a>
                  </div>
                </div>
              </div>
            @endforeach
            {{ $articles->links() }}
          @else
            <div class="alert alert-warning" role="alert" style="margin-top:20px">sorry, no articles!</div>
          @endif
        </div>
        <div class="col-md-3">
          <div class="">

          </div>
        </div>
    </div>
</div>
@endsection
