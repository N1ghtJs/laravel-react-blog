@extends('layouts.app')

@section('title', $article->title)

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="z-article-show">
            @if (session('error'))
                <div class="alert alert-danger">
                    {{ session('error') }}
                </div>
            @endif
            @if (session('message'))
                <div class="alert alert-success">
                    {{ session('message') }}
                </div>
            @endif
            <h1 class="z-title">{{ $article->title }}</h1>
            <p class="z-info"><span style="margin-right:20px">{{$article->created_at_date}}</span>sad creeper</p>
            <div class="z-content">
              {!! $article->content_html !!}
            </div>
            <p class="z-counter">
              阅读 {{ $article->view }}
              <a
                href=""
                onclick="return false"
                data-toggle="modal"
                data-target="#commentModal">
                <span class="glyphicon glyphicon-pencil"></span> 评论
              </a>
            </p>

            <div class="z-comments">
              @foreach($comments as $comment)
                <!-- hr 定位点 -->
                <hr id="comment{{ $comment->id }}">

                <!-- header -->
                @if($comment->user_id == 1)
                  <img src="{{ $comment->master->avatar or '/images/default-avatar.png' }}" class="img-circle z-avatar">
                  <p class="z-name z-center-vertical">{{ $comment->master->name }}<span class="label label-info z-label">博 主</span></p>
                @elseif($comment->website)
                  <p class="z-avatar-text">{{ $comment->avatar }}</p>
                  <a href="{{ $comment->website }}" target="_blank">
                    <p class="z-name">{{ $comment->name }}</p>
                  </a>
                @else
                  <p class="z-avatar-text">{{ $comment->avatar }}</p>
                  <p class="z-name">{{ $comment->name }}</p>
                @endif

                <!-- content -->
                <p class="z-content">{{ $comment->content }}</p>

                <!-- footer -->
                <p class="z-info">
                  {{ $comment->created_at_diff }} · {{ $comment->city }}
                  <span
                    onclick="reply({{ $comment->id }}, {{ $comment->id }}, '{{ $comment->name }}')"
                    class="glyphicon glyphicon-share-alt z-reply-btn">
                  </span>
                </p>

                <!-- replys -->
                <div class="z-reply">
                  @foreach($comment->replys as $reply)
                    <!-- 定位点 -->
                    <div id="comment{{ $reply->id }}"></div>
                    <!-- header -->
                    @if( $reply->user_id == 1 )
                      <img src="{{ $reply->master->avatar or '/images/default-avatar.png' }}" class="img-circle z-avatar">
                      <p class="z-name z-center-vertical">{{ $reply->master->name }}<span class="label label-info z-label">博 主</span></p>
                    @elseif( $reply->website )
                      <p class="z-avatar-text">{{ $reply->avatar }}</p>
                      <a href="{{ $reply->website }}" target="_blank">
                        <p class="z-name">{{ $reply->name }}</p>
                      </a>
                    @else
                      <p class="z-avatar-text">{{ $reply->avatar }}</p>
                      <p class="z-name">{{ $reply->name }}</p>
                    @endif
                    <!-- content -->
                    <p class="z-content">回复 <b>{{ $reply->target_name }}</b>：{{ $reply->content }}</p>
                    <!-- footer -->
                    <p class="z-info">
                      {{ $reply->created_at_diff }} · {{ $reply->city }}
                      <span
                        onclick="reply({{ $comment->id }}, {{ $reply->id }}, '{{ $reply->name }}')"
                        class="glyphicon glyphicon-share-alt z-reply-btn"></span>
                    </P>
                  @endforeach
                </div>
              @endforeach
            </div>

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
        <form action="{{ route('comments.store') }}" method="post">
          {{ csrf_field() }}
          <div class="form-group">
            <label for="content">留言</label>
            <textarea class="form-control" id="content" name="content" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="name">昵称</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="[选填] 怎么称呼？" value="{{ $input->name or '' }}">
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">邮箱</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="[选填] 如果有人回复，会收到邮件提醒" value="{{ $input->email or '' }}">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">个人网站</label>
            <input type="text" class="form-control" id="website" name="website" placeholder="[选填] 包含 http:// 或 https:// 的完整域名" value="{{ $input->website or '' }}">
          </div>
          <input type="text" id="parent_id" name="parent_id" style="display:none">
          <input type="text" id="target_id" name="target_id" style="display:none">
          <input type="text" name="article_id" value="{{ $article->id }}" style="display:none">
          <input type="submit" id="commentFormBtn"  style="display:none">
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" onclick="document.getElementById('commentFormBtn').click()">OK</button>
      </div>
    </div>
  </div>
</div>

<!-- img Modal -->
<div class="modal fade bs-example-modal-lg" id="imgModal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style="max-width:100%">
  <div class="modal-dialog" style="width:100%" role="document">
    <div class="modal-content" style="text-align:center;background-color:rgba(0,0,0,0.5)">
      <img id="imgModalImage" src="" alt="" style="max-width:100%">
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script type="text/javascript">

  //文章图片点击放大
  $("img").click(function(){
    $('#imgModalImage').attr('src', this.src)
    $('#imgModal').modal('show')
  });
  $('#imgModal').click(function(){
    $('#imgModal').modal('hide')
  })

  //回复
  function reply(parent_id, target_id, target_name){
    console.log(target_name);
    document.getElementById('parent_id').value = parent_id;
    document.getElementById('target_id').value = target_id;
    document.getElementById('content').placeholder = '回复 @'+target_name+'：'
    $('#commentModal').modal('show');
  }
</script>
@endsection
