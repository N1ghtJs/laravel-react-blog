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
            <p class="z-counter">
              阅读 {{ $article->view }}
              <a href="" onclick="return false" style="float:right" data-toggle="modal" data-target="#commentModal"><span class="glyphicon glyphicon-pencil"></span> 评论</a>
            </p>
          </div>
        </div>
    </div>
</div>

<!-- comment Modal -->
<div class="modal fade" id="commentModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">说点什么吧..</h4>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="exampleInputFile">留言</label>
            <textarea class="form-control" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">昵称</label>
            <input type="text" class="form-control" id="name" placeholder="[选填] 怎么称呼？">
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">邮箱</label>
            <input type="email" class="form-control" id="email" placeholder="[选填] 如果有人回复，会收到邮件提醒">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">个人网站</label>
            <input type="text" class="form-control" id="website" placeholder="[选填]">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>
</div>
@endsection
