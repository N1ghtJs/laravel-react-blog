@extends('layouts.app')

@section('title', $article->title)

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="z-article-show">
            @if (session('message'))
                <div class="alert alert-success">
                    {{ session('message') }}
                </div>
            @endif
            <h1 class="z-title">{{ $article->title }}</h1>
            <p class="z-info"><span style="margin-right:20px">{{$article->created_at_date}}</span>sad creeper</p>
            <div class="z-content">
              {!! $article->content !!}
            </div>
            <p class="z-counter">
              阅读 {{ $article->view }}
              <a href="" onclick="return false" style="float:right" data-toggle="modal" data-target="#commentModal"><span class="glyphicon glyphicon-pencil"></span> 评论</a>
            </p>
            <div class="z-comments">
              @foreach ($comments as $comment)
                <hr id="comment{{ $comment->id }}">
                @if( $comment->user_id == 1 )
                  <img src="/v.jpg" class="img-circle z-avatar">
                  <p class="z-name z-center-vertical">sad creeper <span class="label label-info z-label">作 者</span></p>
                @elseif( $comment->website )
                  <p class="z-avatar-text"><?php echo $comment['avatar_text'] ? $comment['avatar_text'] : '匿' ?></p>
                  <a href="{{ $comment->website }}" target="_blank">
                    <p class="z-name"><?php echo $comment['name'] ? $comment['name'] : '匿名' ?></p>
                  </a>
                @else
                  <p class="z-avatar-text"><?php echo $comment['avatar_text'] ? $comment['avatar_text'] : '匿' ?></p>
                  <p class="z-name"><?php echo $comment['name'] ? $comment['name'] : '匿名' ?></p>
                @endif
                <p class="z-content">{{ $comment->content }}</p>
                <p class="z-info">{{ $comment->created_at_diff }} · {{ $comment->city }} <span data-toggle="modal" data-target="#commentModal" data-replyid="{{ $comment->id }}" data-replyname="{{ $comment->name }}" class="glyphicon glyphicon-share-alt z-reply-btn"></span></p>
                <div class="z-reply">
                  @foreach( $comment->replys as $reply )
                    @if( $reply->user_id == 1 )
                      <img src="/v.jpg" class="img-circle z-avatar">
                      <p class="z-name z-center-vertical">sad creeper <span class="label label-info z-label">作 者</span></p>
                    @elseif( $reply->website )
                      <p class="z-avatar-text"><?php echo $reply['avatar_text'] ? $reply['avatar_text'] : '匿' ?></p>
                      <a href="{{ $reply->website }}" target="_blank">
                        <p class="z-name"><?php echo $reply['name'] ? $reply['name'] : '匿名' ?></p>
                      </a>
                    @else
                      <p class="z-avatar-text"><?php echo $reply['avatar_text'] ? $reply['avatar_text'] : '匿' ?></p>
                      <p class="z-name"><?php echo $reply['name'] ? $reply['name'] : '匿名' ?></p>
                    @endif
                    <p class="z-content">回复 <b>{{ $reply->target_name }}</b>：{{ $reply->content }}</p>
                    <p class="z-info">{{ $reply->created_at_diff }} · {{ $reply->city }} <span data-toggle="modal" data-target="#commentModal" data-replyid="{{ $comment->id }}" data-replyname="{{ $reply->name }}" class="glyphicon glyphicon-share-alt z-reply-btn"></span></p>
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
            <label for="exampleInputFile">留言</label>
            <textarea class="form-control" id="content" name="content" rows="3" required></textarea>
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">昵称</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="[选填] 怎么称呼？" value="{{ $inputs->name }}">
          </div>
          <div class="form-group">
            <label for="exampleInputEmail1">邮箱</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="[选填] 如果有人回复，会收到邮件提醒" value="{{ $inputs->email }}">
          </div>
          <div class="form-group">
            <label for="exampleInputPassword1">个人网站</label>
            <input type="text" class="form-control" id="website" name="website" placeholder="[选填] 包含 http:// 或 https:// 的完整域名" value="{{ $inputs->website }}">
          </div>
          <input type="text" id="parent_id" name="parent_id" style="display:none">
          <input type="text" id="target_name" name="target_name" style="display:none">
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
  $('#commentModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget)
    if (button.data('replyid')) {
      var replyid = button.data('replyid')
      var replyname = button.data('replyname') ? button.data('replyname') : '匿名'

      var modal = $(this)
      modal.find('#parent_id').val(replyid)
      modal.find('#target_name').val(replyname)
      modal.find('#content').attr("placeholder", "回复 @"+replyname)
    }else {
      var modal = $(this)
      modal.find('#parent_id').val(0)
      modal.find('#target_name').val('')
      modal.find('#content').attr("placeholder", "")
    }
  })

  $("img").click(function(){
    $('#imgModalImage').attr('src', this.src)
    $('#imgModal').modal('show')
  });
  $('#imgModal').click(function(){
    $('#imgModal').modal('hide')
  })
</script>
@endsection
